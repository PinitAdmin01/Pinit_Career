import test from 'node:test';
import assert from 'node:assert/strict';
import { admissionsService } from '../src/lib/services/admissionsService';
import {
  resetHostelStore,
  seedHostelData,
  getBlocks,
  getRooms,
  allocateRoomBed,
  vacateRoomBed,
  createMaintenanceTicket,
  updateMaintenanceTicketStatus,
  requestNightOutPass,
  approveNightOutPass,
  computeHostelOccupancySummary,
  exportHostelRosterCSV,
} from '../src/lib/admin/hostelManagement';
import {
  generateHostelToken,
  calculateDistanceMeritScore,
  calculateMessRebate,
} from '../src/lib/admin/centralHostelWarden';

test('Admissions Matrix & Hostel Block 79 - Operations & Housing Management Suite', async (t) => {
  const tenantId = 'inst-apex-001';

  await t.test('admissions service handles application tracking and non-empty responses safely', async () => {
    const res = await admissionsService.trackApplication('NON-EXISTENT-APP-999');
    assert.ok(res, 'Response should exist');
    assert.equal(res.application, null, 'Unregistered application should resolve to null');

    const emptyRes = await admissionsService.trackApplication('');
    assert.equal(emptyRes.application, null, 'Empty application query should resolve to null');
  });

  await t.test('central hostel warden generates deterministic tokens and evaluates distance-merit score', () => {
    const token = generateHostelToken('BLOCK_A_MENS_JUNIOR', 2026);
    assert.match(token, /^HSTL-2026-BLOC-[0-9A-F]{6}$/);

    // Distance merit score calculation
    // Priority = 0.5 * distance + 0.5 * merit (with statutory PwD score = 100)
    const normalScore = calculateDistanceMeritScore(500, 9.0, false);
    assert.equal(normalScore, 70.0);

    const pwdScore = calculateDistanceMeritScore(20, 4.5, true);
    assert.equal(pwdScore, 100, 'Statutory PwD applicants must receive priority 100');

    // Mess rebate: minimum 5 consecutive days required (150 INR/day)
    const validRebate = calculateMessRebate(7);
    assert.equal(validRebate, 7 * 150);

    const invalidRebate = calculateMessRebate(3);
    assert.equal(invalidRebate, 0);
  });

  await t.test('hostel block and room allocation enforces gender policies and bed limits', () => {
    resetHostelStore();
    seedHostelData(tenantId);

    const blocks = getBlocks(tenantId);
    assert.ok(blocks.length >= 2, 'Must have at least 2 seeded residential blocks');

    const maleBlock = blocks.find((b) => b.genderPolicy === 'MALE');
    assert.ok(maleBlock, 'Male residence block must exist');

    const roomsInBlock = getRooms(tenantId, maleBlock.id);
    assert.ok(roomsInBlock.length > 0, 'Rooms must exist in block');

    const targetRoom = roomsInBlock.find((r) => r.status === 'AVAILABLE') || roomsInBlock[0];

    // Attempting to allocate female student to male-only block should fail
    const femaleAttempt = allocateRoomBed({
      institutionId: tenantId,
      roomId: targetRoom.id,
      studentId: 'stu-female-101',
      studentName: 'Pooja Verma',
      enrollmentNumber: 'ROLL-PV1',
      gender: 'FEMALE',
    });
    assert.equal(femaleAttempt.success, false);
    assert.ok(femaleAttempt.error?.includes('GENDER_POLICY_VIOLATION'));

    // Allocating male student succeeds
    const allocation = allocateRoomBed({
      institutionId: tenantId,
      roomId: targetRoom.id,
      studentId: 'stu-male-101',
      studentName: 'Vikram Seth',
      enrollmentNumber: 'ROLL-VS1',
      gender: 'MALE',
    });

    assert.equal(allocation.success, true);
    assert.ok(allocation.room);
    assert.ok(allocation.room.occupants.some((o) => o.studentName === 'Vikram Seth'));

    // Vacate bed
    const vacated = vacateRoomBed(tenantId, targetRoom.id, 'stu-male-101');
    assert.equal(vacated, true);
  });

  await t.test('maintenance ticketing manages resident requests and lifecycle transitions', () => {
    resetHostelStore();
    seedHostelData(tenantId);

    const blocks = getBlocks(tenantId);
    const rooms = getRooms(tenantId, blocks[0].id);

    const ticket = createMaintenanceTicket({
      institutionId: tenantId,
      blockId: blocks[0].id,
      roomNumber: rooms[0].roomNumber,
      reportedByStudentId: 'stu-test-01',
      reportedByStudentName: 'Aarav Patel',
      category: 'PLUMBING',
      priority: 'HIGH',
      description: 'Water pressure low in 2nd floor wing bathroom.',
    });

    assert.ok(ticket.id.startsWith('TCK-'));
    assert.equal(ticket.status, 'OPEN');
    assert.equal(ticket.category, 'PLUMBING');

    const updated = updateMaintenanceTicketStatus(ticket.id, 'RESOLVED', 'Senior Plumber Ramesh');
    assert.ok(updated);
    assert.equal(updated.status, 'RESOLVED');
    assert.equal(updated.assignedTechnician, 'Senior Plumber Ramesh');
    assert.ok(updated.resolvedAt);
  });

  await t.test('curfew compliance and night-out pass parental consent flow', () => {
    resetHostelStore();
    seedHostelData(tenantId);

    const pass = requestNightOutPass({
      institutionId: tenantId,
      studentId: 'stu-test-02',
      studentName: 'Kavita Rao',
      roomNumber: 'BH1-204',
      destination: 'Tech Park, Whitefield, Bengaluru',
      parentConsentVerified: false,
      departureTimestamp: '2026-11-20T18:00:00Z',
      expectedReturnTimestamp: '2026-11-22T08:00:00Z',
    });

    assert.ok(pass.id.startsWith('NOP-'));
    assert.equal(pass.status, 'REQUESTED');
    assert.equal(pass.parentConsentVerified, false);

    const approved = approveNightOutPass(pass.id, 'Warden Dr. R. Sharma', true);
    assert.equal(approved.success, true);
    assert.ok(approved.pass);
    assert.equal(approved.pass.status, 'APPROVED');
    assert.equal(approved.pass.parentConsentVerified, true);
    assert.equal(approved.pass.approverWarden, 'Warden Dr. R. Sharma');
  });

  await t.test('computes occupancy summary metrics and exports statutory CSV roster', () => {
    resetHostelStore();
    seedHostelData(tenantId);

    const summary = computeHostelOccupancySummary(tenantId);
    assert.ok(typeof summary.totalCapacityBeds === 'number');
    assert.ok(typeof summary.occupiedBeds === 'number');
    assert.ok(typeof summary.occupancyRate === 'number');

    const csv = exportHostelRosterCSV(tenantId);
    assert.ok(csv.includes('Room_Number') || csv.includes('Block_Name'));
  });
});
