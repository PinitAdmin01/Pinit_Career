import csv

TASKS = [
    ("TASK-1564", "Course 14", "iot_emb", "Day 06 - Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise", "IN_PROGRESS", "Asynchronous serial UART communication physics, fractional Baud Rate Register (BRR) calculations, 16x oversampling, and start-bit detection."),
    ("TASK-1565", "Course 14", "iot_emb", "Day 07 - Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA & High-Speed Clocks", "IN_PROGRESS", "Synchronous full-duplex SPI circular shift registers, CPOL/CPHA bus modes 0-3, chip-select timing, and NOR Flash page streaming."),
    ("TASK-1566", "Course 14", "iot_emb", "Day 08 - Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop Conditions & Clock Stretching", "IN_PROGRESS", "Open-drain I2C bus physics, pull-up resistor calculations, START/STOP conditions, 7-bit addressing, and bus clear recovery routines."),
    ("TASK-1567", "Course 14", "iot_emb", "Day 09 - Controller Area Network (CAN Bus): Differential Signaling, Arbitration & CRC Framing", "IN_PROGRESS", "Industrial CAN bus differential signaling (CAN_H/CAN_L), 120-ohm termination, dominant bit non-destructive arbitration, and 32-bit filter masking."),
    ("TASK-1568", "Course 14", "iot_emb", "Day 10 - Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver)", "IN_PROGRESS", "Complete hardware communications engine: non-blocking state machine transceivers, zero-drop UART ring buffers, SPI streaming, and I2C recovery.")
]

csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(csv_path, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    for row in TASKS:
        writer.writerow(row)
print("Registered TASK-1564..1568 in agent_tasks.csv")

control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_path, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "AGENT-445",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "TASK-1564..1568",
        "In_Progress",
        "2026-10-18 23:48:00",
        "Course 14 (iot_emb) Month 1 Block 2: Days 6-10 (UART Baud Rate Calculations, SPI Modes 0-3 Shift Registers, I2C Open-Drain Bus Recovery, CAN Bus Differential Arbitration & Milestone 2 Multi-Protocol Bus Engine)"
    ])
print("Registered AGENT-445 in multi_agent_control.csv")
