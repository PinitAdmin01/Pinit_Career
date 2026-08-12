import { hostelService } from '@/lib/services/hostelService';
import { financeService } from '@/lib/services/financeService';
import { libraryService } from '@/lib/services/libraryService';
import { transportService } from '@/lib/services/transportService';
import { examsService } from '@/lib/services/examsService';
import { eventsService } from '@/lib/services/eventsService';
import { grievancesService } from '@/lib/services/grievancesService';
import { researchService } from '@/lib/services/researchService';
import { maintenanceService } from '@/lib/services/maintenanceService';
import { advisorService } from '@/lib/services/advisorService';
import { admissionsService } from '@/lib/services/admissionsService';
import { hrService } from '@/lib/services/hrService';
import { procurementService } from '@/lib/services/procurementService';
import { assetsService } from '@/lib/services/assetsService';
import { alumniService } from '@/lib/services/alumniService';
import { communicationService } from '@/lib/services/communicationService';
import { documentsService } from '@/lib/services/documentsService';
import { notesService } from '@/lib/services/notesService';
import { servicesService } from '@/lib/services/servicesService';

const CAMPUS_PREFIXES = [
  '/api/admissions', '/api/finance', '/api/exams', '/api/library', '/api/hostel',
  '/api/transport', '/api/documents', '/api/hr', '/api/procurement', '/api/assets',
  '/api/maintenance', '/api/services', '/api/advisor', '/api/grievances', '/api/events',
  '/api/research', '/api/alumni', '/api/notes', '/api/settings',
];

export function isCampusApiPath(cleanPath: string): boolean {
  if (cleanPath === '/api/communication/evaluate') return false;
  if (cleanPath.startsWith('/api/communication')) return true;
  return CAMPUS_PREFIXES.some(p => cleanPath === p || cleanPath.startsWith(p + '/'));
}

function bodyOf(body: unknown): Record<string, any> {
  if (!body) return {};
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return body as Record<string, any>;
}

export async function tryCampusFallback(
  method: string,
  cleanPath: string,
  uid: string | null,
  body: unknown,
  params: URLSearchParams,
  actor: { name: string; email: string }
): Promise<unknown> {
  const b = bodyOf(body);
  const studentId = uid || '';
  const studentName = actor.name || actor.email || 'Student';
  const studentEmail = actor.email || '';

  switch (cleanPath) {
    case '/api/hostel/stats':
      return hostelService.getStats(studentId, studentName);
    case '/api/hostel/request-room':
      return hostelService.requestRoom(studentId, studentName, b.roomCode || b.room);
    case '/api/hostel/log-attendance':
      return hostelService.logAttendance(studentId, studentName, b.type || 'check-in', b.roomCode || b.room || '');
    case '/api/hostel/raise-complaint':
      return hostelService.raiseComplaint(studentId, studentName, b.category, b.title, b.description || '');
    case '/api/hostel/resolve-complaint':
      return hostelService.resolveComplaint(b.complaintId || b.id);
    case '/api/hostel/register-visitor':
      return hostelService.registerVisitor(studentId, b.name, b.relation, b.purpose);
    case '/api/hostel/checkout-visitor':
      return hostelService.checkoutVisitor(studentId, b.visitorId || b.id);
    case '/api/hostel/approve-allocation':
      return hostelService.approveAllocation(b.studentId || studentId, b.roomCode || b.room);

    case '/api/finance/student-dues':
      return financeService.getStudentDues(studentId);
    case '/api/finance/pay-due':
      return financeService.payDue(studentId, studentName, b.installmentId, studentEmail);
    case '/api/finance/scholarships':
      return financeService.getScholarships();
    case '/api/finance/apply-scholarship':
      return financeService.applyScholarship(studentId, b.scholarshipId);
    case '/api/finance/admin-stats':
      return financeService.getAdminStats();

    case '/api/library/books':
      return libraryService.getStats(studentId, studentName);
    case '/api/library/borrow':
      return libraryService.borrow(studentId, studentName, b.isbn);
    case '/api/library/return':
      return libraryService.returnBook(studentId, b.borrowId || b.id);
    case '/api/library/reserve':
      return libraryService.reserve(studentId, studentName, b.isbn);
    case '/api/library/add-book':
      return libraryService.addBook(b.isbn, b.title, b.author, b.genre, Number(b.copies) || 1);

    case '/api/exams/student-schedule':
      return examsService.getStudentSchedule();
    case '/api/exams/student-results':
      return examsService.getStudentResults(studentId);
    case '/api/exams/submit-marks':
      return examsService.submitMarks(b.studentId || studentId, b.marks || {});
    case '/api/exams/publish-results':
      return examsService.publishResults(b.studentId || studentId, b.isPublished !== false);

    case '/api/transport/stats':
      return transportService.getStats(studentId);
    case '/api/transport/register':
      return transportService.register(studentId, b.routeCode || b.route, b.stop);
    case '/api/transport/approve-registration':
      return transportService.approveRegistration(b.studentId || studentId);
    case '/api/transport/add-route':
      return transportService.addRoute(
        b.code, b.name, b.driverName,
        b.vehicle,
        typeof b.stops === 'string' ? b.stops.split(',').map((s: string) => s.trim()) : (b.stops || []),
        b.timing
      );

    case '/api/documents/stats':
      return documentsService.getStats();
    case '/api/documents/request':
      return documentsService.requestDoc(studentId, b.type || b.category, b.purpose || b.description);
    case '/api/documents/approve':
      return documentsService.approveDoc(b.requestId || b.id);

    case '/api/admissions/applications':
      return admissionsService.getApplications();
    case '/api/admissions/apply':
      return admissionsService.apply(studentId || `anon-${Date.now()}`, studentName, b.course, Number(b.rank) || 0);
    case '/api/admissions/verify-doc':
      return admissionsService.verifyDoc(b.appId || b.id, b.action === 'reject' ? 'reject' : 'approve');
    case '/api/admissions/allocate-seats':
      return admissionsService.allocateSeats();
    case '/api/admissions/seat-matrix':
      return admissionsService.getSeatMatrix();

    case '/api/hr/stats':
      return hrService.getStats();
    case '/api/hr/approve-leave':
      return hrService.approveLeave(b.leaveId || b.id);
    case '/api/hr/create-job':
      return hrService.createJob(b.title, b.dept);
    case '/api/hr/run-payroll':
      return hrService.runPayroll();

    case '/api/procurement/stats':
      return procurementService.getStats();
    case '/api/procurement/create-request':
      return procurementService.createRequest(b.item, Number(b.qty) || 1, b.dept, Number(b.cost) || 0);
    case '/api/procurement/approve-request':
      return procurementService.approveRequest(b.requestId || b.id);
    case '/api/procurement/issue-po':
      return procurementService.issuePo(b.requestId || b.id, b.vendorName);
    case '/api/procurement/dispatch-po':
      return procurementService.dispatchPo(b.orderId || b.id);
    case '/api/procurement/deliver-po':
      return procurementService.deliverPo(b.orderId || b.id);
    case '/api/procurement/clear-invoice':
      return procurementService.clearInvoice(b.orderId || b.id);
    case '/api/procurement/create-vendor':
      return procurementService.createVendor(b.name, b.email, b.category);

    case '/api/assets/stats':
      return assetsService.getStats();
    case '/api/assets/create':
      return assetsService.create(b.name, b.category, b.location);
    case '/api/assets/schedule-maintenance':
    case '/api/assets/schedule-mnt':
      return assetsService.scheduleMnt(b.assetCode, b.issue, b.staff, b.scheduledDate);
    case '/api/assets/complete-maintenance':
    case '/api/assets/complete-mnt':
      return assetsService.completeMnt(b.mntId || b.id);
    case '/api/assets/renew-amc':
      return assetsService.renewAmc(b.amcId || b.id, b.expiryDate);

    case '/api/maintenance/stats':
      return maintenanceService.getTickets();
    case '/api/maintenance/report':
      return maintenanceService.reportTicket(b.category, b.location, b.description);
    case '/api/maintenance/schedule':
      return maintenanceService.scheduleTicket(b.ticketId || b.id, b.technician);
    case '/api/maintenance/start':
      return maintenanceService.startTicket(b.ticketId || b.id);
    case '/api/maintenance/resolve':
      return maintenanceService.resolveTicket(b.ticketId || b.id);

    case '/api/communication/all':
      return communicationService.getAll();
    case '/api/communication/send-email':
      return communicationService.logCommunication('email', b.subject, b.body || b.message, b.category);
    case '/api/communication/send-sms':
      return communicationService.logCommunication('sms', b.subject, b.body || b.text || b.message, b.category);
    case '/api/communication/post-announcement':
      return communicationService.logCommunication('announcement', b.title || b.subject, b.message || b.body, b.category);

    case '/api/services/stats':
      return servicesService.getStats(studentId);
    case '/api/services/apply-leave':
      return servicesService.applyLeave(studentId, b.startDate, b.endDate, b.reason, b.type);
    case '/api/services/file-request':
      return servicesService.fileRequest(studentId, b.category, b.description);
    case '/api/services/book-appointment':
      return servicesService.bookAppointment(studentId, b.staffName, b.date, b.time, b.purpose);
    case '/api/services/book-counselling':
      return servicesService.bookCounselling(studentId, b.counselorName, b.date, b.time);
    case '/api/services/approve-leave':
      return servicesService.approveLeave(b.leaveId || b.id);
    case '/api/services/approve-request':
      return servicesService.approveRequest(b.requestId || b.id);

    case '/api/advisor/performance':
      return advisorService.getPerformance(studentId);
    case '/api/advisor/quest/complete':
      return advisorService.completeQuest(studentId);
    case '/api/advisor/admin/risks':
      return advisorService.getAtRiskStudents();
    case '/api/advisor/admin/alert':
      return advisorService.sendAlert(b.studentId || studentId, b.message);

    case '/api/grievances/stats':
      return grievancesService.getStats(studentId, studentName);
    case '/api/grievances/submit':
      return grievancesService.submit(studentId, studentName, b.reporterType || 'student', b.category, b.title, b.description, !!b.anonymous);
    case '/api/grievances/submit-faculty':
      return grievancesService.submit(studentId, studentName, 'faculty', b.category, b.title, b.description, !!b.anonymous);
    case '/api/grievances/investigate':
      return grievancesService.investigate(b.ticketId || b.id);
    case '/api/grievances/resolve':
      return grievancesService.resolve(b.ticketId || b.id, b.resolution || '');

    case '/api/events/stats':
      return eventsService.getStats(studentId, studentName);
    case '/api/events/rsvp':
      return eventsService.rsvp(studentId, studentName, b.eventId || b.id);
    case '/api/events/publish':
      return eventsService.publish(b.category, b.title, b.description, b.date, b.time, b.venue, Number(b.capacity) || 0, b.host);
    case '/api/events/issue-certificate':
    case '/api/events/issue-cert':
      return eventsService.issueCert(b.rsvpId || b.id);

    case '/api/research/stats':
      return researchService.getStats(studentId, studentName);
    case '/api/research/publish-paper':
      return researchService.publishPaper(studentId, studentName, b.title, b.authors, b.journal, b.status);
    case '/api/research/update-status':
    case '/api/research/update-paper-status':
      return researchService.updatePaperStatus(b.paperId || b.id, b.status);
    case '/api/research/grant-approval':
    case '/api/research/approve-funding':
      return researchService.approveFunding(b.fundingId || b.id);

    case '/api/alumni/stats': {
      const stats = await alumniService.getStats() as any;
      return {
        directory: stats.alumni || stats.directory || [],
        jobs: stats.jobs || [],
        donations: stats.donations || [],
        events: stats.events || [],
        connects: stats.connects || [],
        referrals: stats.referrals || [],
      };
    }
    case '/api/alumni/add-job':
    case '/api/alumni/post-job':
      return alumniService.addJob(b.title, b.company, b.location, b.salary, b.postedBy || studentName);
    case '/api/alumni/mentorship-request':
      return alumniService.requestMentorship(b.mentorName, b.studentName || studentName, b.slot);
    case '/api/alumni/referral-request':
      return alumniService.requestReferral(b.jobId, b.studentName || studentName);
    case '/api/alumni/donate':
      return alumniService.donate(b.campaignId || b.id, Number(b.amount) || 0, b.contributorName || studentName);

    case '/api/notes/stats':
      return notesService.getNotes(params.get('batch') || b.batch || 'CSE-2026');

    case '/api/settings/migration/validate':
    case '/api/settings/migration/execute':
    case '/api/settings/erp/sync':
    case '/api/settings/rollout/feedback':
      return { ok: false, error: 'Admin CSV/ERP tools require a Node host. They are not available on static Firebase export.' };

    default:
      throw new Error(`Unhandled campus path: ${method} ${cleanPath}`);
  }
}
