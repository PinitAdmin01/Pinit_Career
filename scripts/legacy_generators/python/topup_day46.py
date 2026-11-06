import sys
import pprint
sys.path.append('scripts')
from fullstack_day46_data import DAY_46

p4_topup = "In automated Kubernetes cloud deployments, fencing tokens are often combined with STONITH ('Shoot The Other Node In The Head') mechanisms implemented through cloud provider fencing APIs. When a leader promotion event occurs, the cluster management controller immediately calls the cloud infrastructure hypervisor API (such as AWS EC2 StopInstances or GCP instances/stop) to physically terminate the power supply of the failed leader. This hard physical fencing guarantees that the zombie node cannot execute any network I/O or background disk flushes, ensuring absolute mutual exclusion during catastrophic cluster partitions."

p5_topup1 = "To maintain seamless integration with enterprise developer workflows, the replication lag sentinel exports standardized Prometheus metrics, including database_replication_lag_seconds and connection_pool_active_ratio. When alerting thresholds are breached, the sentinel integrates directly with Alertmanager and PagerDuty to page on-call site reliability engineers with pre-computed diagnostic runbooks."

p5_topup2 = "Furthermore, the sentinel executes automated query throttling under high replication lag. If write volume on the primary temporarily outpaces the ability of replicas to replay WAL logs (for example, during a massive batch data migration), the sentinel automatically signals application worker pools to inject artificial backpressure delays on non-critical background jobs, allowing the read replicas to catch up before customer-facing query latencies degrade."

DAY_46['parts'][3]['say'].append(p4_topup)
DAY_46['parts'][4]['say'].append(p5_topup1)
DAY_46['parts'][4]['say'].append(p5_topup2)

with open('scripts/fullstack_day46_data.py', 'w', encoding='utf-8') as f:
    f.write('# Day 46 Fullstack JS Long Lesson Data\n')
    f.write(f'DAY_46 = {pprint.pformat(DAY_46, width=120, sort_dicts=False)}\n')

print('Topped up Day 46 parts 4 & 5!')
