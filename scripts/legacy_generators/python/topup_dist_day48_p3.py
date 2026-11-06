# scripts/topup_dist_day48_p3.py

with open("scripts/create_dist_day48_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how `read_uncommitted` returns all 3 records'
extra = '''    "To understand the low-level serialization of control markers, consider how the broker stores records on disk. In Apache Kafka record batch format (introduced in message format version two), every record batch contains an internal boolean attribute flag indicating whether it contains standard application data or a Control Batch. When the Transaction Coordinator writes a Commit Marker or Abort Marker, the batch attribute is set to control, and the payload contains a specialized schema identifying the coordinator epoch and marker type.",
    "When a `read_committed` consumer parses incoming batches over the network socket, its fetcher inspects the batch attribute header. If the batch is a control batch, the consumer client never passes the control marker up to the user-level message listener callback; instead, it updates its internal transaction state table, moving the corresponding transaction ID from the active set to either the committed or aborted set.",
    "Furthermore, the Last Stable Offset (LSO) imposes a crucial design requirement: long-running or hanging transactions must be strictly prevented. If an uncommitted transaction remains open on a partition for hours, the LSO cannot advance past that transaction first offset! Downstream `read_committed` consumers are blocked from reading any subsequent records published after that point, creating artificial consumer lag. To prevent this, brokers enforce `transaction.max.timeout.ms` (typically fifteen minutes), automatically aborting any abandoned transaction that exceeds the threshold.",
    "Notice how `read_uncommitted` returns all 3 records'''

content = content.replace(target, extra)

with open("scripts/create_dist_day48_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 3 of Day 48 successfully!")
