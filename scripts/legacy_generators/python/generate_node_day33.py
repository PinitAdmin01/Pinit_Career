import json, subprocess

p1_say = [
    "Welcome to Day 33 of Node.js & TypeScript Backend Engineering: AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments. Over the previous two days, we mastered in-memory event loops and Apache Kafka's append-only commit logs. Today, we delve into RabbitMQ and the Advanced Message Queuing Protocol (AMQP 0-9-1)—the preeminent broker-centric queuing system in modern enterprise architectures.",
    "While Apache Kafka is optimized for high-throughput stream processing and log retention, RabbitMQ is built for complex message routing, worker task distribution, and granular per-message acknowledgments. In Kafka, consumers pull data from distributed partition logs; in RabbitMQ, the broker actively pushes messages to consumers across multiplexed AMQP channels.",
    "The AMQP 0-9-1 model introduces a profound architectural decoupling: producers *never* publish messages directly to queues. Instead, producers publish messages to an Exchange. An Exchange is an internal broker routing engine that inspects message attributes (such as the Routing Key and Headers) and evaluates Bindings—rules connecting the exchange to one or more Queues.",
    "Queues buffer messages in broker memory and on disk until consumers acknowledge them. Once a message is consumed and acknowledged, RabbitMQ removes it from the queue, freeing broker resources immediately. Both exchanges and queues can be declared as Durable (surviving broker restarts) and persistent, ensuring message survivability during catastrophic server crashes.",
    "In Part 1, we implement our `auditAmqpTopology` engine. This program validates virtual host configuration, verifies exchange durability, inspects queue bindings, and checks routing key mappings.",
    "Let us explore how our AMQP topology auditor inspects exchanges and validates queue bindings.",
    "In multi-tenant enterprise backend architectures, Virtual Hosts (vhosts) provide logical isolation within a single RabbitMQ cluster. Each vhost has its own independent namespace of exchanges, queues, bindings, and user permissions. For instance, staging and production microservices can share the same physical RabbitMQ cluster while remaining completely isolated from each other.",
    "Furthermore, RabbitMQ implements Erlang OTP actor concurrency under the hood. Every queue is an independent Erlang process with its own state and message mailbox. This guarantees that high traffic on one queue never blocks or degrades throughput on unrelated queues within the cluster.",
    "By establishing clean AMQP topologies with durable exchanges and queues, backend systems achieve robust message routing with zero risk of dropped tasks."
]

p1_code = """function auditAmqpTopology(topology) {
  const exchangeMap = new Map();
  for (const ex of topology.exchanges) {
    exchangeMap.set(ex.name, { type: ex.type, durable: ex.durable, boundQueues: [] });
  }

  for (const b of topology.bindings) {
    if (exchangeMap.has(b.exchange)) {
      exchangeMap.get(b.exchange).boundQueues.push({ queue: b.queue, routingKey: b.routingKey });
    }
  }

  return {
    virtualHost: topology.vhost,
    totalExchanges: topology.exchanges.length,
    totalQueues: topology.queues.length,
    bindingsCount: topology.bindings.length,
    exchangeMap: Object.fromEntries(exchangeMap)
  };
}

const rabbitConfig = {
  vhost: '/production',
  exchanges: [
    { name: 'orders.direct', type: 'direct', durable: true },
    { name: 'events.topic', type: 'topic', durable: true }
  ],
  queues: [
    { name: 'payment.process', durable: true },
    { name: 'inventory.reserve', durable: true }
  ],
  bindings: [
    { exchange: 'orders.direct', queue: 'payment.process', routingKey: 'order.created' },
    { exchange: 'orders.direct', queue: 'inventory.reserve', routingKey: 'order.created' }
  ]
};

const topologyReport = auditAmqpTopology(rabbitConfig);
console.log('Virtual Host:', topologyReport.virtualHost);
console.log('Total Exchanges:', topologyReport.totalExchanges);
console.log('Total Queues:', topologyReport.totalQueues);
console.log('Bindings Count:', topologyReport.bindingsCount);
console.log('Orders Direct Bound Queues:', topologyReport.exchangeMap['orders.direct'].boundQueues.length);"""

p2_say = [
    "Having established the core AMQP topology, Part 2 explores RabbitMQ's most powerful feature: Advanced Routing Patterns via Direct, Fanout, Topic, and Headers Exchanges.",
    "RabbitMQ provides four primary exchange types, each executing a distinct routing algorithm: First, the Direct Exchange routes messages based on exact string equality between the message's routing key and the binding key configured on the queue. If an order service publishes with routing key `order.created`, only queues bound with exact key `order.created` receive the message.",
    "Second, the Fanout Exchange completely ignores routing keys, broadcasting every incoming message indiscriminately to all bound queues. Fanout exchanges are ideal for broadcast telemetry, live cache invalidation beacons, and pub-sub notifications where multiple independent microservices must receive identical copies of every event.",
    "Third, the Topic Exchange provides sophisticated pattern matching by evaluating dot-delimited words in the routing key using two wildcard tokens: the asterisk (`*`) which matches *exactly one word*, and the hash (`#`) which matches *zero or more words*. For example, a binding of `order.*.europe` matches `order.created.europe` and `order.cancelled.europe`, while `telemetry.#` matches `telemetry`, `telemetry.gps`, and `telemetry.gps.altitude.speed`.",
    "In Part 2, our `matchAmqpTopicRouting` engine implements the full AMQP topic wildcard matching algorithm. Let us observe how it evaluates dot-delimited tokens with single and multi-word wildcards.",
    "Topic exchanges enable highly sophisticated, dynamic publish-subscribe topologies without modifying producer code. For example, a payment audit service can subscribe to `payment.#` to capture all payment events globally, while a localized tax computation service subscribes only to `payment.*.eu` to process European transactions.",
    "Fourth, the Headers Exchange routes messages based on multiple message header attributes and logical matching rules (`x-match: all` or `x-match: any`), enabling complex multi-criteria routing without packing metadata into routing key strings.",
    "By selecting the optimal exchange type for each business domain, backend architects create elegant, decoupled communication topologies across hundreds of microservices."
]

p2_code = """function matchAmqpTopicRouting(bindingPattern, routingKey) {
  const patternParts = bindingPattern.split('.');
  const keyParts = routingKey.split('.');

  let p = 0;
  let k = 0;

  while (p < patternParts.length && k < keyParts.length) {
    const pToken = patternParts[p];
    if (pToken === '#') {
      if (p === patternParts.length - 1) return true;
      p++;
      const nextPToken = patternParts[p];
      while (k < keyParts.length && keyParts[k] !== nextPToken) {
        k++;
      }
    } else if (pToken === '*' || pToken === keyParts[k]) {
      p++;
      k++;
    } else {
      return false;
    }
  }

  while (p < patternParts.length && patternParts[p] === '#') p++;
  return p === patternParts.length && k === keyParts.length;
}

const test1 = matchAmqpTopicRouting('order.*.processed', 'order.eu.processed');
const test2 = matchAmqpTopicRouting('order.*.processed', 'order.eu.west.processed');
const test3 = matchAmqpTopicRouting('telemetry.#', 'telemetry.sensor.v1.temp');

console.log('Single Star Match (*):', test1);
console.log('Multi Segment Star (*):', test2);
console.log('Hash Multi Match (#):', test3);"""

p3_say = [
    "In high-throughput message processing, an unconstrained consumer can easily crash due to memory exhaustion. In Part 3, we master Consumer Prefetch Limits and Channel Quality of Service (QoS) Backpressure.",
    "Because RabbitMQ is a push-based message broker, if a producer suddenly publishes 100,000 tasks to a queue, RabbitMQ will greedily push all 100,000 messages over the TCP connection to connected Node.js consumers by default. If each task allocates an in-memory database connection or image buffer, the consumer's V8 heap rapidly exhausts, triggering an Out-Of-Memory fatal crash.",
    "To prevent consumer overload, AMQP provides Channel Quality of Service (QoS) via the `basic.qos(prefetchCount)` command. Prefetch Count specifies the maximum number of unacknowledged messages that RabbitMQ will push to a consumer over an AMQP channel at any single moment.",
    "When a consumer sets `prefetch: 5`, RabbitMQ pushes up to 5 messages and then pauses dispatching to that consumer. Only when the consumer acknowledges (`basic.ack`) or rejects (`basic.nack`) an in-flight message does RabbitMQ push the next queued message. This creates an automatic, hardware-aligned Backpressure mechanism.",
    "In Part 3, we implement our `simulatePrefetchBackpressure` scheduler. This engine models broker queue dispatching under strict prefetch limits, proving that excess messages remain safely buffered in the broker.",
    "In production Node.js engineering, selecting the optimal prefetch count is a crucial performance tuning task. If prefetch is set to 1, the consumer operates in strict sequential lock-step, wasting network latency waiting for the broker to transmit each subsequent message. Conversely, setting prefetch to 1,000 risks consumer memory exhaustion during slow downstream processing.",
    "For typical I/O-bound microservices, a prefetch count between 20 and 100 balances high throughput with safe memory consumption.",
    "Furthermore, prefetch limits enable Fair Dispatching across heterogeneous worker instances: fast workers process and acknowledge messages quickly, receiving more work from the broker, while slow workers process at their own pace without being overwhelmed.",
    "Mastering prefetch QoS backpressure ensures your consumer services remain rock-solid and responsive under intense traffic spikes."
]

p3_code = """function simulatePrefetchBackpressure(prefetchLimit, incomingBatch) {
  const unacknowledged = [];
  const processed = [];
  const queuedOnBroker = [];

  for (const msg of incomingBatch) {
    if (unacknowledged.length < prefetchLimit) {
      unacknowledged.push(msg.id);
      processed.push(`DISPATCHED:${msg.id}`);
    } else {
      queuedOnBroker.push(msg.id);
    }
  }

  return {
    prefetchLimit,
    activeInFlight: unacknowledged.length,
    queuedOnBrokerCount: queuedOnBroker.length,
    processedCount: processed.length
  };
}

const batch = [
  { id: 'msg_1' }, { id: 'msg_2' }, { id: 'msg_3' },
  { id: 'msg_4' }, { id: 'msg_5' }, { id: 'msg_6' }
];

const qos = simulatePrefetchBackpressure(3, batch);
console.log('Prefetch QoS Limit:', qos.prefetchLimit);
console.log('Active In-Flight Messages:', qos.activeInFlight);
console.log('Messages Held in Broker Queue:', qos.queuedOnBrokerCount);
console.log('Immediate Dispatches:', qos.processedCount);"""

p4_say = [
    "What happens when a background worker encounters an unrecoverable bug or database connection failure while processing a message? In Part 4, we master Message Acknowledgments, Negative Acknowledgments, and Dead-Letter Exchanges (DLX).",
    "Under AMQP explicit acknowledgment rules, when a consumer finishes processing a task, it emits `basic.ack(deliveryTag)`. This instructs the broker that the message was handled successfully and can be safely purged from the queue. If the consumer crashes or its connection drops before acknowledging, RabbitMQ detects the channel closure and re-queues the message automatically for another worker.",
    "However, if a worker encounters an error during processing, it can emit `basic.nack(deliveryTag, multiple, requeue)`: setting `requeue: true` returns the message to the front of the queue. But if the error is caused by a permanent bug (a 'Poison Pill' message), requeueing immediately causes an infinite crash loop, consuming 100% CPU and halting the entire consumer fleet.",
    "To handle persistent failures gracefully, enterprise architectures deploy Dead-Letter Exchanges (DLX). When a queue is declared with the `x-dead-letter-exchange` argument, messages that are rejected with `requeue: false`, or messages that exceed their configured Time-To-Live (TTL), are automatically rerouted by RabbitMQ to the dead-letter exchange, which routes them to a Dead-Letter Queue (DLQ).",
    "In Part 4, our `evaluateAmqpAckWithDlx` engine simulates acknowledgment outcomes, exponential retry counting, and automatic dead-letter diversion.",
    "In production microservices, dead-letter queues are monitored with automated alerts. When messages enter a DLQ, SRE teams inspect the payloads, diagnose the underlying bug, patch the application code, and replay the dead-lettered messages using RabbitMQ's Shovel plugin.",
    "Furthermore, architectures implement Retry Queues with Exponential Backoff by chaining dead-letter exchanges with queue message TTLs, allowing transient failures to retry after 5 seconds, 30 seconds, and 5 minutes before final dead-lettering.",
    "This robust error-handling topology guarantees that transient network errors are resolved automatically while permanent poison pill messages are quarantined safely without disrupting normal business operations."
]

p4_code = """function evaluateAmqpAckWithDlx(action, maxRetries = 3) {
  let outcome = 'UNKNOWN';
  let targetQueue = action.queue;
  let retryCount = action.retryCount || 0;

  if (action.status === 'SUCCESS') {
    outcome = 'ACK';
  } else if (action.status === 'TEMPORARY_ERROR') {
    if (retryCount < maxRetries) {
      outcome = 'NACK_REQUEUE';
      retryCount++;
    } else {
      outcome = 'NACK_DEAD_LETTER';
      targetQueue = 'dlx.orders.failed';
    }
  } else if (action.status === 'FATAL_CORRUPTION') {
    outcome = 'REJECT_DEAD_LETTER';
    targetQueue = 'dlx.orders.failed';
  }

  return {
    actionOutcome: outcome,
    targetQueue,
    finalRetryCount: retryCount,
    isDeadLettered: targetQueue.startsWith('dlx.')
  };
}

const success = evaluateAmqpAckWithDlx({ queue: 'orders.queue', status: 'SUCCESS', retryCount: 0 });
const retry = evaluateAmqpAckWithDlx({ queue: 'orders.queue', status: 'TEMPORARY_ERROR', retryCount: 1 });
const deadLetter = evaluateAmqpAckWithDlx({ queue: 'orders.queue', status: 'TEMPORARY_ERROR', retryCount: 3 });

console.log('Success Action:', success.actionOutcome);
console.log('Temporary Error Action:', retry.actionOutcome);
console.log('Exhausted Retries Action:', deadLetter.actionOutcome);
console.log('Dead Letter Target:', deadLetter.targetQueue);
console.log('Is Dead Lettered:', deadLetter.isDeadLettered);"""

p5_say = [
    "We conclude Day 33 with Part 5: The Resilient Notification Microservice Pipeline. In modern cloud applications, sending emails, SMS alerts, and mobile push notifications must be completely decoupled from core user transactions.",
    "If a customer signs up or completes a purchase, the web application must not block waiting for third-party email APIs (such as SendGrid or SES) to respond. Third-party network APIs frequently experience 500ms to 2-second latencies or temporary throttling.",
    "Instead, the primary application publishes a notification event to a Topic Exchange (`notifications.topic`) with a routing key like `notify.EMAIL.HIGH`. A dedicated fleet of Notification Consumer Workers consumes messages under a prefetch limit of 50, dispatches payloads to external providers with retry handling, and emits AMQP acknowledgments upon successful transmission.",
    "In Part 5, we implement our `simulateNotificationPipeline` engine. This program validates the entire AMQP notification flow: routing through topic exchanges, calculating channel-specific delivery latencies, and verifying explicit acknowledgment.",
    "Let us explore how our notification pipeline handles multi-channel delivery and validates execution steps.",
    "Notice how topic routing keys allow granular filtering: high-priority security notifications (such as two-factor authentication codes) route to dedicated high-speed queues processed by prioritized worker pools, while bulk promotional emails route to lower-priority queues with stricter rate limits.",
    "Furthermore, if the external email provider becomes unavailable, unacknowledged messages remain safely buffered in RabbitMQ, waiting for provider recovery without losing a single customer email.",
    "Congratulations on mastering Day 33! You have conquered the AMQP model, RabbitMQ exchange routing, prefetch backpressure controls, explicit acknowledgments, dead-letter exchanges, and resilient notification pipelines.",
    "Tomorrow in Day 34, we master Redis Streams and Consumer Groups, analyzing high-throughput in-memory streaming, Pending Acknowledgment Lists (PEL), and consumer claiming!"
]

p5_code = """function simulateNotificationPipeline(notificationRequest) {
  const timeline = [];
  timeline.push(`INGEST: Request received for ${notificationRequest.recipient}`);

  const routingKey = `notify.${notificationRequest.channel}.${notificationRequest.priority}`;
  timeline.push(`ROUTE: Exchange 'notifications.topic' via '${routingKey}'`);

  let latencyMs = 0;
  if (notificationRequest.channel === 'EMAIL') latencyMs = 4.2;
  else if (notificationRequest.channel === 'SMS') latencyMs = 2.1;
  else latencyMs = 1.0;

  timeline.push(`DELIVER: ${notificationRequest.channel} provider dispatched in ${latencyMs}ms`);
  timeline.push(`ACK: Message acknowledged on AMQP channel`);

  return {
    recipient: notificationRequest.recipient,
    routingKey,
    deliveryLatencyMs: latencyMs,
    completed: true,
    steps: timeline
  };
}

const notification = simulateNotificationPipeline({
  recipient: 'user@enterprise.com',
  channel: 'EMAIL',
  priority: 'HIGH'
});

console.log('Recipient:', notification.recipient);
console.log('Routing Key Used:', notification.routingKey);
console.log('Delivery Latency:', notification.deliveryLatencyMs + 'ms');
console.log('Notification Completed:', notification.completed);
console.log('Pipeline Steps:', notification.steps.length);"""

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    return res.stdout.strip()

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "AMQP Model & RabbitMQ Topology: Exchanges, Queues & Bindings",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "In the AMQP 0-9-1 architecture, do producers publish messages directly to queues?",
            "options": [
                "No, producers publish exclusively to Exchanges, which evaluate bindings to route messages to queues",
                "Yes, producers always write directly to queue memory buffers",
                "Producers only write to operating system log files",
                "Messages are stored in web browser cookies before reaching queues"
            ],
            "answer": 0,
            "why": "AMQP strictly decouples producers from queues; producers publish messages to an Exchange, which routes messages to bound queues based on bindings and routing keys."
        }
    },
    {
        "title": "Routing Patterns: Direct, Fanout & Topic Wildcard Matching",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "What is the difference between '*' and '#' wildcard tokens in RabbitMQ Topic Exchanges?",
            "options": [
                "'*' matches exactly one dot-delimited word, while '#' matches zero or more words",
                "'*' matches all words in the message, while '#' matches numbers only",
                "'*' is used for fanout exchanges, while '#' is used for direct exchanges",
                "Both tokens are identical and interchangeable"
            ],
            "answer": 0,
            "why": "In AMQP topic routing keys, '*' matches exactly one word between dots, whereas '#' matches zero, one, or multiple consecutive words."
        }
    },
    {
        "title": "Consumer Prefetch Limits & Channel Flow Control (QoS Backpressure)",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "Why is setting an appropriate prefetch count (Channel QoS) critical for Node.js consumer stability?",
            "options": [
                "It caps the number of unacknowledged in-flight messages pushed to the consumer, preventing V8 heap memory exhaustion under heavy load",
                "It increases the CPU clock speed of the underlying server",
                "It forces all messages to be encrypted with 4096-bit RSA keys",
                "It automatically converts asynchronous callbacks into synchronous loops"
            ],
            "answer": 0,
            "why": "Prefetch limits prevent RabbitMQ from pushing unbounded messages to the consumer, maintaining hardware-aligned backpressure and preventing out-of-memory crashes."
        }
    },
    {
        "title": "Message Acknowledgments & Dead-Letter Exchanges (DLX / DLQ)",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "What is the primary role of a Dead-Letter Exchange (DLX) in RabbitMQ?",
            "options": [
                "To capture, quarantine, and route failed or un-processable poison pill messages without crashing worker fleets or blocking normal queue processing",
                "To delete all messages from queues when disk storage reaches 50%",
                "To broadcast marketing emails to unsubscribed users",
                "To restart the RabbitMQ broker cluster every morning"
            ],
            "answer": 0,
            "why": "A Dead-Letter Exchange quarantines rejected or expired messages into a dedicated DLQ, preventing poison pills from triggering infinite retry loops."
        }
    },
    {
        "title": "Resilient Microservice Queue Pipeline: Transactional Email & Notification Worker",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "Why are third-party notification APIs (such as email and SMS) decoupled using message queues rather than called synchronously in HTTP requests?",
            "options": [
                "To eliminate user-perceived latency and ensure reliability, allowing the HTTP request to finish in under 5ms while background workers handle network retries",
                "Because third-party APIs cannot be invoked from JavaScript code",
                "To prevent web browsers from caching static HTML files",
                "Because message queues are required by credit card payment processors"
            ],
            "answer": 0,
            "why": "Queue decoupling isolates customer checkout requests from external network latency and temporary provider outages, ensuring sub-5ms response times."
        }
    }
]

day33 = {
    "day": 33,
    "title": "AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments",
    "goal": "Master broker-centric message queuing with RabbitMQ and AMQP 0-9-1 in Node.js: analyze exchange types (Direct, Fanout, Topic, Headers), queue bindings and routing keys, prefetch count backpressure, explicit acknowledgments (ACK/NACK), and Dead-Letter Exchanges (DLX).",
    "minutes": 38,
    "recap": "Yesterday in Day 32, we mastered distributed message streaming with Apache Kafka, focusing on log partitions, consumer groups, and offset commit semantics. Today, we contrast log streaming with broker-centric AMQP push routing in RabbitMQ.",
    "parts": parts,
    "summary": [
        "AMQP 0-9-1 decouples producers from queues via Exchanges, which evaluate bindings and routing keys to distribute messages.",
        "RabbitMQ provides Direct (exact match), Fanout (broadcast), Topic (wildcard pattern matching), and Headers routing algorithms.",
        "Channel QoS prefetch limits enforce consumer backpressure, preventing unconstrained message pushes and V8 heap exhaustion.",
        "Explicit message acknowledgments (ACK/NACK) paired with Dead-Letter Exchanges (DLX) quarantine poison pill messages safely.",
        "Asynchronous notification pipelines isolate user-facing HTTP gateways from slow third-party API latencies."
    ],
    "projectStep": {
        "title": "Implement AMQP Topology Router & Dead-Letter Pipeline Simulator",
        "steps": [
            "Execute auditAmqpTopology to verify virtual host configuration, exchange durability, and queue binding maps.",
            "Run matchAmqpTopicRouting to test single-word (*) and multi-word (#) topic wildcard matching algorithms.",
            "Simulate channel QoS backpressure with simulatePrefetchBackpressure, verifying broker queuing thresholds.",
            "Test acknowledgment outcomes with evaluateAmqpAckWithDlx, observing retry limits and automated dead-letter routing.",
            "Run simulateNotificationPipeline to validate end-to-end asynchronous email delivery and AMQP channel acknowledgment."
        ]
    }
}

total_words = 0
for i, p in enumerate(day33['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 33 Part {i+1}: {wc} words")
print(f"Total Day 33 Words: {total_words}")

with open('scripts/node_day33.json', 'w', encoding='utf-8') as f:
    json.dump(day33, f, indent=2)

print("Generated scripts/node_day33.json successfully!")
