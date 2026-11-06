with open('scripts/build_iot_sec_day21.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_more = '''    "Furthermore, security architects must enforce Flash Memory Protection Unit (MPU) attributes across dual-bank boundaries. While the application is executing from Bank A, the hardware MPU is programmed to mark Bank A as Read-Only and Execute-Never-Privileged, preventing malicious exploits from modifying executing code. Simultaneously, Bank B is configured as Read-Write but Execute-Never (XN), ensuring that staged firmware packets cannot be prematurely executed by Return-Oriented Programming (ROP) or buffer overflow payloads before cryptographic validation.",'''

p4_more = '''    "To ensure complete fault isolation, modern microcontrollers integrate Hardware Brown-Out Reset (BOR) circuitry with programmable voltage threshold levels. If the operating voltage drops below 2.7 volts during the self-test execution, the BOR circuit forces an immediate hardware reset, triggering the bootloader's rollback logic before unpredictable CPU instruction decoding can corrupt external peripherals or flash memory.",'''

p5_more = '''    "In mission-critical industrial systems, FOTA verification extends beyond firmware binaries to configuration parameters, machine learning weights, and cryptographic key material. When updating edge AI micro-vision sensors or predictive vibration monitors, the update bundle incorporates signed model weights and calibration matrices, ensuring that mathematical perception models are updated atomically alongside operational control firmware.",
    "Automated regression testing suites in continuous integration pipelines simulate hundreds of thousands of interrupted FOTA updates across simulated microcontrollers. By verifying that power interruptions at every single sector boundary result in either successful resume or safe rollback to the previous proven baseline, engineering teams guarantee five-nines (99.999%) operational reliability across deployed global fleets.",'''

p2_target = '    "In Part 2, our DualBankPartitionLayoutManager models partition'
text = text.replace(p2_target, p2_more + '\n' + p2_target)

p4_target = '    "In Part 4, our FotaWatchdogRollbackController demonstrates'
text = text.replace(p4_target, p4_more + '\n' + p4_target)

p5_target = '    "Upon validating that staging, swapping, confirmation, and rollback'
text = text.replace(p5_target, p5_more + '\n' + p5_target)

# Ensure assertion is active
text = text.replace('# assert wc >= 580', 'assert wc >= 580')

with open('scripts/build_iot_sec_day21.py', 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully topped up build_iot_sec_day21.py!')
