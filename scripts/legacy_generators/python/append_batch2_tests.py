tests_to_append = '''
test('Systems Long Lessons: comp_fund Day 17 Operating System Security & Firewall Verification', async () => {
  const d17 = getLongLesson('comp_fund', 17);
  assert.ok(d17, 'comp_fund Day 17 must resolve');
  assert.equal(d17.day, 17);
  assert.equal(d17.parts.length, 5);

  const res1 = await executeBashSuite(d17.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('UAC_PRIVILEGE_BOUNDARY_VERIFIED'));

  const res2 = await executeBashSuite(d17.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SUDO_PRIVILEGE_DELEGATION_VERIFIED'));

  const res3 = await executeBashSuite(d17.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('HOST_FIREWALL_SPI_VERIFIED'));

  const res4 = await executeBashSuite(d17.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MANDATORY_ACCESS_CONTROL_VERIFIED'));

  const res5 = await executeBashSuite(d17.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Security Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 18 Cryptography Fundamentals Verification', async () => {
  const d18 = getLongLesson('comp_fund', 18);
  assert.ok(d18, 'comp_fund Day 18 must resolve');
  assert.equal(d18.day, 18);
  assert.equal(d18.parts.length, 5);

  const res1 = await executeBashSuite(d18.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('AES256_GCM_AUTHENTICATED_ENCRYPTION_VERIFIED'));

  const res2 = await executeBashSuite(d18.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ASYMMETRIC_CRYPTOGRAPHY_VERIFIED'));

  const res3 = await executeBashSuite(d18.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('OPENSSH_KEY_AUTHENTICATION_VERIFIED'));

  const res4 = await executeBashSuite(d18.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PKI_CERTIFICATE_AUTHORITY_VERIFIED'));

  const res5 = await executeBashSuite(d18.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Crypto Health Index:     100/100'));
});

test('Systems Long Lessons: comp_fund Day 19 Hardware Peripherals & Display Interfaces Verification', async () => {
  const d19 = getLongLesson('comp_fund', 19);
  assert.ok(d19, 'comp_fund Day 19 must resolve');
  assert.equal(d19.day, 19);
  assert.equal(d19.parts.length, 5);

  const res1 = await executeBashSuite(d19.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('USB4_THUNDERBOLT4_TUNNELING_VERIFIED'));

  const res2 = await executeBashSuite(d19.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('DISPLAY_INTERFACE_BANDWIDTH_VERIFIED'));

  const res3 = await executeBashSuite(d19.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PCIE_IOMMU_DMA_PROTECTION_VERIFIED'));

  const res4 = await executeBashSuite(d19.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('USB_PD_EPR_POWER_DELIVERY_VERIFIED'));

  const res5 = await executeBashSuite(d19.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Peripheral Health Index: 100/100'));
});

test('Systems Long Lessons: comp_fund Day 20 Software Installation & Package Managers Verification', async () => {
  const d20 = getLongLesson('comp_fund', 20);
  assert.ok(d20, 'comp_fund Day 20 must resolve');
  assert.equal(d20.day, 20);
  assert.equal(d20.parts.length, 5);

  const res1 = await executeBashSuite(d20.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PACKAGE_DEPENDENCY_GRAPH_VERIFIED'));

  const res2 = await executeBashSuite(d20.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('APT_PACKAGE_ECOSYSTEM_VERIFIED'));

  const res3 = await executeBashSuite(d20.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CROSS_PLATFORM_PACKAGE_MANAGEMENT_VERIFIED'));

  const res4 = await executeBashSuite(d20.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PATH_PRECEDENCE_RESOLUTION_VERIFIED'));

  const res5 = await executeBashSuite(d20.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Package Health Index:    100/100'));
});

test('Systems Long Lessons: comp_fund Day 21 Milestone 3 Capstone Verification', async () => {
  const d21 = getLongLesson('comp_fund', 21);
  assert.ok(d21, 'comp_fund Day 21 must resolve');
  assert.equal(d21.day, 21);
  assert.equal(d21.parts.length, 5);

  const res1 = await executeBashSuite(d21.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('MILESTONE3_HOST_DEFENSE_VERIFIED'));

  const res2 = await executeBashSuite(d21.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('MILESTONE3_CRYPTOGRAPHIC_ENGINE_VERIFIED'));

  const res3 = await executeBashSuite(d21.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MILESTONE3_PERIPHERAL_BUS_VERIFIED'));

  const res4 = await executeBashSuite(d21.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MILESTONE3_ENVIRONMENT_PACKAGING_VERIFIED'));

  const res5 = await executeBashSuite(d21.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Milestone 3 Health:    100/100'));
});
'''

target_file = 'tests/systems_long_lessons_parity.test.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

if 'comp_fund Day 17 Operating System Security' not in content:
    content = content.rstrip() + '\n' + tests_to_append
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Appended Days 17-21 tests successfully.")
else:
    print("Days 17-21 tests already present.")
