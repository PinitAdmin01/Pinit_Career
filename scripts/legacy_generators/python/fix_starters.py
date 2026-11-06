with open('src/lib/data/nodeWeb30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    (
        'eStarter: lines("function calculateEventLoopLag(expectedMs: number, actualMs: number): { lagMs: number; status: string } {", "  // Return lag metrics", "  return { lagMs: 0, status: \'HEALTHY\' };", "}"),',
        'eStarter: lines("function calculateEventLoopLag(expectedMs, actualMs) {", "  // Return lag metrics", "  return { lagMs: 0, status: \'HEALTHY\' };", "}"),'
    ),
    (
        'aStarter: lines("function formatWorkerTaskPayload(taskId: string, payload: any): { id: string; timestamp: number; payload: any } {", "  // Return worker payload", "  return { id: \'\', timestamp: 0, payload: null };", "}"),',
        'aStarter: lines("function formatWorkerTaskPayload(taskId, payload) {", "  // Return worker payload", "  return { id: \'\', timestamp: 0, payload: null };", "}"),'
    ),
    (
        'eStarter: lines("function computeKafkaPartition(key: string, numPartitions: number): number {", "  // Compute partition index", "  return 0;", "}"),',
        'eStarter: lines("function computeKafkaPartition(key, numPartitions) {", "  // Compute partition index", "  return 0;", "}"),'
    ),
    (
        'aStarter: lines("function evaluateConsumerLag(leo: number, committed: number): { lag: number; isCritical: boolean } {", "  // Evaluate lag", "  return { lag: 0, isCritical: false };", "}"),',
        'aStarter: lines("function evaluateConsumerLag(leo, committed) {", "  // Evaluate lag", "  return { lag: 0, isCritical: false };", "}"),'
    ),
    (
        'eStarter: lines("function routeRabbitMqMessage(routingKey: string, bindingPatterns: string[]): string[] {", "  // Match AMQP routing key", "  return [];", "}"),',
        'eStarter: lines("function routeRabbitMqMessage(routingKey, bindingPatterns) {", "  // Match AMQP routing key", "  return [];", "}"),'
    ),
    (
        'aStarter: lines("function classifyDlqAction(attempts: number, maxRetries: number, isCorrupt: boolean): { action: string; attempts: number } {", "  // Determine DLQ action", "  return { action: \'RETRY\', attempts: 0 };", "}"),',
        'aStarter: lines("function classifyDlqAction(attempts, maxRetries, isCorrupt) {", "  // Determine DLQ action", "  return { action: \'RETRY\', attempts: 0 };", "}"),'
    ),
    (
        'eStarter: lines("function generateRedisStreamId(timestampMs: number, sequence: number): string {", "  // Return stream entry ID", "  return \'\';", "}"),',
        'eStarter: lines("function generateRedisStreamId(timestampMs, sequence) {", "  // Return stream entry ID", "  return \'\';", "}"),'
    ),
    (
        'aStarter: lines("function filterStalePelEntries(entries: Array<{ id: string; idleMs: number }>, minIdleMs: number): string[] {", "  // Filter stale entries", "  return [];", "}"),',
        'aStarter: lines("function filterStalePelEntries(entries, minIdleMs) {", "  // Filter stale entries", "  return [];", "}"),'
    ),
    (
        'eStarter: lines("function validateOutboxRecord(record: { id: number; aggregateId: string; payload: any; status: string }): boolean {", "  // Validate outbox record", "  return false;", "}"),',
        'eStarter: lines("function validateOutboxRecord(record) {", "  // Validate outbox record", "  return false;", "}"),'
    ),
    (
        'aStarter: lines("function auditOrderEngineSla(metrics: { relayLatencyMs: number; throughput: number; dlqIsolationPct: number }): { pass: boolean; grade: string } {", "  // Audit SLA metrics", "  return { pass: false, grade: \'FAIL\' };", "}"),',
        'aStarter: lines("function auditOrderEngineSla(metrics) {", "  // Audit SLA metrics", "  return { pass: false, grade: \'FAIL\' };", "}"),'
    )
]

for orig, repl in replacements:
    assert orig in text, f"Could not find:\n{orig}"
    text = text.replace(orig, repl)

with open('src/lib/data/nodeWeb30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("All 10 starters fixed in nodeWeb30DayData.ts!")
