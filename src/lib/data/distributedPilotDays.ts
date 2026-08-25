// Auto-generated 30-day Distributed Systems Socratic Curriculum Dataset
import { DayLessonPlan } from '../types/lessonEngine';

export const DISTRIBUTED_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Distributed Systems Foundations & Fallacies",
    "overviewMetaphor": "A Distributed System is a group of international translators communicating exclusively via carrier pigeons across stormy oceans: Fallacy 1: The pigeon will never get lost in the storm (The network is reliable); Fallacy 2: The pigeon flies instantaneously (Latency is zero); Fallacy 3: The ocean has infinite airspace (Bandwidth is infinite); Fallacy 4: All translators speak English natively (The network is homogeneous); resilient systems design for lost pigeons from Day 1.",
    "blocks": [
      {
        "id": "dist-d1-b1-eight-fallacies-overview",
        "day": 1,
        "blockNumber": 1,
        "title": "The 8 Fallacies of Distributed Computing (Deutsch & Gosling)",
        "conceptBudget": {
          "primaryConcept": "The 8 Fallacies of Distributed Computing",
          "supportingTerms": [
            "1. The network is reliable",
            "2. Latency is zero",
            "3. Bandwidth is infinite",
            "4. The network is secure",
            "5. Topology doesn't change",
            "6. There is one administrator",
            "7. Transport cost is zero",
            "8. The network is homogeneous"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Core Distributed Computing Fallacies",
              "boxes": [
                {
                  "label": "Fallacy 1: Network is Reliable",
                  "value": "Reality: Packets drop, routers reboot, fiber optic cables get severed by backhoes",
                  "varType": "Unreliable Network",
                  "isUpdated": true
                },
                {
                  "label": "Fallacy 2: Latency is Zero",
                  "value": "Reality: Cross-datacenter speed of light in fiber is ~5ms per 1,000km",
                  "varType": "Physical Latency",
                  "isUpdated": false
                },
                {
                  "label": "Fallacy 3: Bandwidth is Infinite",
                  "value": "Reality: Large JSON payloads saturate NICs and cause TCP congestion collapse",
                  "varType": "Finite Bandwidth",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "latency_distance_sim.js",
            "initialCode": "function calculateFiberLatency(distanceKm) {\n  // Speed of light in glass fiber ≈ 200,000 km/s (5 microseconds per km)\n  const oneWayMs = (distanceKm / 200000) * 1000;\n  const roundTripMs = oneWayMs * 2;\n  return {\n    distanceKm,\n    oneWayLatencyMs: Number(oneWayMs.toFixed(2)),\n    roundTripTimeMs: Number(roundTripMs.toFixed(2))\n  };\n}\n\nconsole.log('NY to London (5,500 km):', JSON.stringify(calculateFiberLatency(5500)));\nconsole.log('San Francisco to Tokyo (8,200 km):', JSON.stringify(calculateFiberLatency(8200)));",
            "expectedOutput": "NY to London (5,500 km): {\"distanceKm\":5500,\"oneWayLatencyMs\":27.5,\"roundTripTimeMs\":55}\nSan Francisco to Tokyo (8,200 km): {\"distanceKm\":8200,\"oneWayLatencyMs\":41,\"roundTripTimeMs\":82}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must distributed software architects treat the network as fundamentally unreliable by design?",
          "options": [
            "Because networks experience transient timeouts, packet loss, hardware switch failures, and unpredictable latency spikes that will cause distributed systems to deadlock without explicit timeout and retry boundaries",
            "Because computers cannot communicate across wire",
            "Because fiber optics are banned"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
              "errorExplanation": "Networks inevitably suffer transient drops, requiring defensive timeout and retry design.",
              "recoveryPath": {
                "simplerExplanation": "Networks have inherent physical failures and packet loss.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d1-b2-timeouts-and-exponential-backoff",
        "day": 1,
        "blockNumber": 2,
        "title": "Timeout Deadlines & Exponential Backoff with Jitter",
        "conceptBudget": {
          "primaryConcept": "Exponential Backoff & Jitter",
          "supportingTerms": [
            "Deadline Propagation (Passing remaining timeout in gRPC/HTTP headers)",
            "Exponential Backoff: $T_{\\text{wait}} = \\text{Base} \\times 2^{\\text{attempt}}$",
            "Full Jitter: $\\text{Random}(0, T_{\\text{wait}})$ to prevent synchronized retry stampedes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Exponential Backoff with Full Jitter Formula",
            "codeSnippet": "const baseDelayMs = 100;\nconst maxDelayMs = 5000;\nconst exponentialCap = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));\nconst sleepMs = Math.floor(Math.random() * exponentialCap); // Full Jitter!",
            "lineNotes": {
              "3": "Exponentially doubles wait time on each subsequent failed retry attempt.",
              "4": "Random jitter decorrelates retry bursts across thousands of concurrent clients."
            }
          },
          {
            "type": "runnable_code",
            "filename": "backoff_sim_demo.js",
            "initialCode": "function getBackoffIntervals(attempts = 4, baseMs = 100) {\n  const intervals = [];\n  for (let i = 0; i < attempts; i++) {\n    const maxWait = baseMs * Math.pow(2, i);\n    intervals.push(`Attempt ${i + 1}: Max ${maxWait}ms`);\n  }\n  return intervals;\n}\n\nconsole.log(getBackoffIntervals().join('\\n'));",
            "expectedOutput": "Attempt 1: Max 100ms\nAttempt 2: Max 200ms\nAttempt 3: Max 400ms\nAttempt 4: Max 800ms",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum backoff interval (in ms) for Attempt 4 with base 100ms ($100 \\times 2^3$)?",
          "expectedStringOutput": "Attempt 4: Max 800ms",
          "acceptableAnswers": [
            "Attempt 4: Max 800ms",
            "800ms",
            "800",
            "Max 800ms"
          ],
          "primaryMisconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
          "diagnosisMap": {
            "400ms": {
              "misconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
              "errorExplanation": "Attempt 4 is index 3: 100 * 2^3 = 800ms.",
              "recoveryPath": {
                "simplerExplanation": "100 * 2^3 = 800ms.",
                "guidedFixPrompt": "Type Attempt 4: Max 800ms"
              }
            }
          }
        }
      },
      {
        "id": "dist-d1-b3-idempotency-at-network-layer",
        "day": 1,
        "blockNumber": 3,
        "title": "Idempotency: Making Retries Safe over Unreliable Networks",
        "conceptBudget": {
          "primaryConcept": "Network Idempotency",
          "supportingTerms": [
            "Idempotent Operation: $f(f(x)) = f(x)$",
            "Safe HTTP Methods (`GET`, `PUT`, `DELETE` are idempotent; `POST` is not)",
            "Idempotency Keys in Payment & Order Processing APIs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b2-timeouts-and-exponential-backoff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "idempotent_charge_demo.js",
            "initialCode": "function executeCharge(idempotencyKey, store) {\n  if (store.has(idempotencyKey)) {\n    return { duplicate: true, chargeId: store.get(idempotencyKey), message: 'RETRY_SERVED_FROM_IDEMPOTENCY_CACHE' };\n  }\n  const newChargeId = `ch_${Math.random().toString(36).substr(2, 9)}`;\n  store.set(idempotencyKey, newChargeId);\n  return { duplicate: false, chargeId: newChargeId, message: 'NEW_PAYMENT_PROCESSED' };\n}\n\nconst cache = new Map();\nconsole.log('Call 1:', executeCharge('key_order_9981', cache).message);\nconsole.log('Call 2 (Network Retry):', executeCharge('key_order_9981', cache).message);",
            "expectedOutput": "Call 1: NEW_PAYMENT_PROCESSED\nCall 2 (Network Retry): RETRY_SERVED_FROM_IDEMPOTENCY_CACHE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must distributed APIs processing non-idempotent operations (like credit card charges) require unique client-generated Idempotency Keys?",
          "options": [
            "Because if a network timeout occurs after the server processes the charge but before the client receives the 200 OK response, the client can safely retry without charging the customer twice",
            "Because credit card companies require random strings",
            "To encrypt database passwords"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_FALLACIES_NETWORK_RELIABILITY_LATENCY",
              "errorExplanation": "Idempotency keys prevent duplicate billing on client network retries.",
              "recoveryPath": {
                "simplerExplanation": "Enables safe retries without duplicate charges.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "The CAP Theorem & PACELC Theorem",
    "overviewMetaphor": "The CAP Theorem is choosing between two banks during a phone line outage: Bank A (Consistency: CP) refuses to let you withdraw $100 because it cannot verify with headquarters if your spouse just withdrew money in Paris (Refuses availability to guarantee no overdraws); Bank B (Availability: AP) hands you the $100 immediately to keep customers happy, agreeing to reconcile any conflicting balance discrepancies later tonight.",
    "blocks": [
      {
        "id": "dist-d2-b1-cap-theorem-formal-proof",
        "day": 2,
        "blockNumber": 1,
        "title": "The CAP Theorem: Consistency, Availability & Partition Tolerance",
        "conceptBudget": {
          "primaryConcept": "The CAP Theorem (Eric Brewer)",
          "supportingTerms": [
            "Consistency (Every read receives the most recent write or an error)",
            "Availability (Every non-failing node returns a non-error response, without guarantee of latest write)",
            "Partition Tolerance (System operates despite arbitrary network packet drops)",
            "Invariant: You cannot choose 'CA' over physical networks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CAP Theorem Trade-off Matrix",
              "boxes": [
                {
                  "label": "CP Systems (e.g. Spanner, CockroachDB, Raft)",
                  "value": "Prioritize Strict Consistency over Availability during network split (Returns HTTP 500 or pauses)",
                  "varType": "Consistent",
                  "isUpdated": true
                },
                {
                  "label": "AP Systems (e.g. Cassandra, DynamoDB, CouchDB)",
                  "value": "Prioritize Availability over Consistency during network split (Returns potentially stale data)",
                  "varType": "Available",
                  "isUpdated": false
                },
                {
                  "label": "CA Myth",
                  "value": "IMPOSSIBLE over distributed networks: Partitions are a physical reality, not a configuration option!",
                  "varType": "Myth",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cap_decision_demo.js",
            "initialCode": "function evaluateCapChoice(systemType, hasNetworkPartition) {\n  if (!hasNetworkPartition) return 'NORMAL_OPERATION_CONSISTENT_AND_AVAILABLE';\n  return systemType === 'CP' \n    ? 'CP_MODE: REJECT_WRITE_TO_PRESERVE_CONSISTENCY (500 Error)'\n    : 'AP_MODE: ACCEPT_WRITE_MAY_CAUSE_REPLICATION_LAG_DIVERGENCE (200 OK)';\n}\n\nconsole.log('Normal:', evaluateCapChoice('CP', false));\nconsole.log('CP during Partition:', evaluateCapChoice('CP', true));\nconsole.log('AP during Partition:', evaluateCapChoice('AP', true));",
            "expectedOutput": "Normal: NORMAL_OPERATION_CONSISTENT_AND_AVAILABLE\nCP during Partition: CP_MODE: REJECT_WRITE_TO_PRESERVE_CONSISTENCY (500 Error)\nAP during Partition: AP_MODE: ACCEPT_WRITE_MAY_CAUSE_REPLICATION_LAG_DIVERGENCE (200 OK)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is designing a 'CA' (Consistent and Available without Partition Tolerance) distributed system physically impossible across physical networks?",
          "options": [
            "Because network cables, switches, and cross-datacenter fiber links inevitably suffer packet drops and partitions; when a partition occurs, the system is mathematically forced to choose either to pause reads/writes (sacrifice A) or accept stale reads/writes (sacrifice C)",
            "Because database software only has 2 modes",
            "Because CA systems require quantum computers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
              "errorExplanation": "Network partitions are unavoidable physical events, making CA impossible.",
              "recoveryPath": {
                "simplerExplanation": "Partitions are unavoidable; you must choose CP or AP during a split.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d2-b2-pacelc-theorem-normal-tradeoff",
        "day": 2,
        "blockNumber": 2,
        "title": "The PACELC Theorem: Latency vs Consistency in Normal Operation",
        "conceptBudget": {
          "primaryConcept": "The PACELC Theorem (Daniel Abadi)",
          "supportingTerms": [
            "If Partition (P): choose Availability (A) or Consistency (C);",
            "Else (E): choose Latency (L) or Consistency (C)",
            "PA/EL (DynamoDB / Cassandra) vs PC/EC (Spanner / CockroachDB)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d2-b1-cap-theorem-formal-proof",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "PACELC Database Taxonomy",
              "boxes": [
                {
                  "label": "PA/EL (DynamoDB, Cassandra)",
                  "value": "Partition: Available | Normal: Low Latency (Async replication) -> Fast, eventual consistency",
                  "varType": "High Throughput",
                  "isUpdated": true
                },
                {
                  "label": "PC/EC (Google Spanner, CockroachDB)",
                  "value": "Partition: Consistent | Normal: Strong Consistency (Sync quorum replication) -> 100% accurate",
                  "varType": "ACID Financial",
                  "isUpdated": false
                },
                {
                  "label": "PC/EL (MongoDB)",
                  "value": "Partition: Consistent | Normal: Low Latency reads from secondary replicas",
                  "varType": "Hybrid",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pacelc_demo.js",
            "initialCode": "function getPacelcProfile(dbName) {\n  const dbProfiles = {\n    'DynamoDB': 'PA/EL (Partition: Availability | Normal: Low Latency)',\n    'Spanner': 'PC/EC (Partition: Consistency | Normal: Strong Consistency)',\n    'Cassandra': 'PA/EL (Partition: Availability | Normal: Low Latency)'\n  };\n  return dbProfiles[dbName] || 'UNKNOWN';\n}\n\nconsole.log('DynamoDB:', getPacelcProfile('DynamoDB'));\nconsole.log('Spanner:', getPacelcProfile('Spanner'));",
            "expectedOutput": "DynamoDB: PA/EL (Partition: Availability | Normal: Low Latency)\nSpanner: PC/EC (Partition: Consistency | Normal: Strong Consistency)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What PACELC classification describes Amazon DynamoDB and Apache Cassandra?",
          "expectedStringOutput": "PA/EL (Partition: Availability | Normal: Low Latency)",
          "acceptableAnswers": [
            "PA/EL (Partition: Availability | Normal: Low Latency)",
            "PA/EL",
            "DynamoDB: PA/EL (Partition: Availability | Normal: Low Latency)"
          ],
          "primaryMisconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
          "diagnosisMap": {
            "PC/EC": {
              "misconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
              "errorExplanation": "DynamoDB is PA/EL. Spanner is PC/EC.",
              "recoveryPath": {
                "simplerExplanation": "DynamoDB is PA/EL.",
                "guidedFixPrompt": "Type PA/EL (Partition: Availability | Normal: Low Latency)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d2-b3-tunable-consistency-quorum-math",
        "day": 2,
        "blockNumber": 3,
        "title": "Tunable Consistency: Quorum Math ($R + W > N$)",
        "conceptBudget": {
          "primaryConcept": "Quorum Consistency Math",
          "supportingTerms": [
            "Replication Factor ($N$)",
            "Read Quorum ($R$ nodes must confirm)",
            "Write Quorum ($W$ nodes must acknowledge)",
            "Strong Consistency Condition: $R + W > N$ (Pigeonhole principle ensures read and write quorums overlap by $\\ge 1$ node)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d2-b2-pacelc-theorem-normal-tradeoff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quorum_math_demo.js",
            "initialCode": "function evaluateQuorumConsistency(N, R, W) {\n  const isStrong = (R + W) > N;\n  return {\n    replicationFactor: N,\n    readQuorum: R,\n    writeQuorum: W,\n    sum: R + W,\n    guarantee: isStrong ? 'STRONG_CONSISTENCY (Guaranteed Overlap)' : 'EVENTUAL_CONSISTENCY (Risk of Stale Read)'\n  };\n}\n\nconsole.log('N=3, R=2, W=2:', JSON.stringify(evaluateQuorumConsistency(3, 2, 2)));\nconsole.log('N=3, R=1, W=1:', JSON.stringify(evaluateQuorumConsistency(3, 1, 1)));",
            "expectedOutput": "N=3, R=2, W=2: {\"replicationFactor\":3,\"readQuorum\":2,\"writeQuorum\":2,\"sum\":4,\"guarantee\":\"STRONG_CONSISTENCY (Guaranteed Overlap)\"}\nN=3, R=1, W=1: {\"replicationFactor\":3,\"readQuorum\":1,\"writeQuorum\":1,\"sum\":2,\"guarantee\":\"EVENTUAL_CONSISTENCY (Risk of Stale Read)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does setting $R + W > N$ guarantee strong consistency across distributed storage nodes?",
          "options": [
            "By the Pigeonhole Principle, the set of nodes read from ($R$) and the set of nodes written to ($W$) must overlap on at least 1 node that contains the latest write version",
            "Because reads and writes happen simultaneously on the CPU",
            "Because odd numbers prevent collisions"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_CAP_PACELC_CONSISTENCY_AVAILABILITY",
              "errorExplanation": "R + W > N guarantees at least one overlapping node with the most recent write.",
              "recoveryPath": {
                "simplerExplanation": "Ensures read and write sets overlap on at least 1 node.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "RPC Communication & Protocol Buffers Binary Serialization",
    "overviewMetaphor": "Protocol Buffers vs JSON is shipping cargo in custom vacuum-sealed boxes vs shipping in giant labeled cardboard moving crates: JSON ships verbose text keys on every single packet (`\"customer_first_name\": \"Alice\"`: 32 bytes of wire overhead); Protocol Buffers uses numbered binary tags (`Tag 1 = \"Alice\"`: 6 bytes), cutting network bandwidth by 80% and serializing 10x faster in hardware.",
    "blocks": [
      {
        "id": "dist-d3-b1-json-vs-protobuf-wire-format",
        "day": 3,
        "blockNumber": 1,
        "title": "Wire Formats: Verbose JSON vs Compact Protocol Buffers",
        "conceptBudget": {
          "primaryConcept": "Protocol Buffers Binary Wire Format",
          "supportingTerms": [
            "Field Numbers (Tag integers replace string keys on the wire)",
            "Varint Encoding (1-10 bytes for numbers)",
            "Schema Definition Files (`.proto` files with `protoc` code generation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Protobuf Service & Message Definition",
            "codeSnippet": "syntax = \"proto3\";\n\nmessage OrderRequest {\n  string order_id = 1;     // Field Tag 1\n  double amount = 2;       // Field Tag 2\n  int64 timestamp = 3;     // Field Tag 3\n}\n\nservice PaymentService {\n  rpc ProcessOrder (OrderRequest) returns (OrderResponse);\n}",
            "lineNotes": {
              "4": "Tag 1 is encoded in 1 byte on the wire instead of the 10-character string 'order_id'.",
              "9": "Typed RPC contract generated for Go, Java, TypeScript, and Python."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wire_size_demo.js",
            "initialCode": "function compareWirePayloads(orderId, amount, ts) {\n  const jsonStr = JSON.stringify({ order_id: orderId, amount: amount, timestamp: ts });\n  const estimatedProtobufBytes = 1 + orderId.length + 1 + 8 + 1 + 8;\n  return {\n    jsonBytes: jsonStr.length,\n    protobufBytes: estimatedProtobufBytes,\n    bandwidthSavings: `${(((jsonStr.length - estimatedProtobufBytes) / jsonStr.length) * 100).toFixed(1)}%`\n  };\n}\n\nconsole.log(JSON.stringify(compareWirePayloads('ord_998124', 499.99, 1704067200)));",
            "expectedOutput": "{\"jsonBytes\":61,\"protobufBytes\":29,\"bandwidthSavings\":\"52.5%\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth savings percentage is achieved by Protobuf over JSON for the order payload above?",
          "expectedStringOutput": "52.5%",
          "acceptableAnswers": [
            "52.5%",
            "bandwidthSavings\":\"52.5%\""
          ],
          "primaryMisconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
          "diagnosisMap": {
            "20%": {
              "misconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
              "errorExplanation": "Binary tags reduce payload from 61 bytes to 29 bytes (52.5% savings).",
              "recoveryPath": {
                "simplerExplanation": "Saves 52.5% bandwidth.",
                "guidedFixPrompt": "Type 52.5%"
              }
            }
          }
        }
      },
      {
        "id": "dist-d3-b2-grpc-streaming-modes",
        "day": 3,
        "blockNumber": 2,
        "title": "The 4 gRPC Communication Modes over HTTP/2",
        "conceptBudget": {
          "primaryConcept": "gRPC Streaming Modes",
          "supportingTerms": [
            "1. Unary (1 request $\\to$ 1 response)",
            "2. Server Streaming (1 request $\\to$ stream of responses)",
            "3. Client Streaming (Stream of requests $\\to$ 1 response)",
            "4. Bidirectional Streaming (Independent concurrent duplex streams)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d3-b1-json-vs-protobuf-wire-format",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "gRPC Communication Patterns",
              "boxes": [
                {
                  "label": "1. Unary RPC",
                  "value": "Client sends Order -> Server returns Confirmation (Standard request/response)",
                  "varType": "Unary",
                  "isUpdated": false
                },
                {
                  "label": "2. Server Streaming",
                  "value": "Client requests live market ticker -> Server streams continuous stock price ticks",
                  "varType": "Server Stream",
                  "isUpdated": false
                },
                {
                  "label": "3. Bidirectional Streaming",
                  "value": "Real-time multiplayer gaming / Chat / Voice audio bi-directional streams",
                  "varType": "Full Duplex",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "grpc_mode_demo.js",
            "initialCode": "function selectGrpcMode(useCase) {\n  if (useCase === 'FILE_UPLOAD') return 'CLIENT_STREAMING_RPC';\n  if (useCase === 'LIVE_LOG_FEED') return 'SERVER_STREAMING_RPC';\n  if (useCase === 'REAL_TIME_CHAT') return 'BIDIRECTIONAL_STREAMING_RPC';\n  return 'UNARY_RPC';\n}\n\nconsole.log('Use Case: Live Log Feed:', selectGrpcMode('LIVE_LOG_FEED'));\nconsole.log('Use Case: Real-time Chat:', selectGrpcMode('REAL_TIME_CHAT'));",
            "expectedOutput": "Use Case: Live Log Feed: SERVER_STREAMING_RPC\nUse Case: Real-time Chat: BIDIRECTIONAL_STREAMING_RPC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which gRPC communication mode is optimal for a live real-time server log tailing service?",
          "expectedStringOutput": "SERVER_STREAMING_RPC",
          "acceptableAnswers": [
            "SERVER_STREAMING_RPC",
            "Use Case: Live Log Feed: SERVER_STREAMING_RPC",
            "Server streaming"
          ],
          "primaryMisconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
          "diagnosisMap": {
            "UNARY": {
              "misconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
              "errorExplanation": "Live log feeds stream continuous server events via SERVER_STREAMING_RPC.",
              "recoveryPath": {
                "simplerExplanation": "Live feeds use SERVER_STREAMING_RPC.",
                "guidedFixPrompt": "Type SERVER_STREAMING_RPC"
              }
            }
          }
        }
      },
      {
        "id": "dist-d3-b3-http2-multiplexing-hol-blocking",
        "day": 3,
        "blockNumber": 3,
        "title": "HTTP/2 Multiplexing & Head-of-Line (HoL) Blocking Resolution",
        "conceptBudget": {
          "primaryConcept": "HTTP/2 Multiplexing",
          "supportingTerms": [
            "HTTP/1.1 Head-of-Line Blocking (Slow request blocks subsequent requests on TCP socket)",
            "HTTP/2 Binary Framing & Stream IDs (Interleaving frames over 1 single TCP connection)",
            "HPACK Header Compression"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d3-b2-grpc-streaming-modes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "multiplex_demo.js",
            "initialCode": "function evaluateMultiplexing(httpVersion) {\n  return httpVersion === 'HTTP/2' \n    ? { connections: 1, maxConcurrentStreams: 100, headOfLineBlocked: false }\n    : { connections: 6, maxConcurrentStreams: 6, headOfLineBlocked: true };\n}\n\nconsole.log('HTTP/2 Performance:', JSON.stringify(evaluateMultiplexing('HTTP/2')));",
            "expectedOutput": "HTTP/2 Performance: {\"connections\":1,\"maxConcurrentStreams\":100,\"headOfLineBlocked\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does HTTP/2 Multiplexing eliminate application-layer Head-of-Line blocking in high-scale microservices?",
          "options": [
            "It breaks requests into independent binary frames tagged with unique Stream IDs and interleaves them over a single shared TCP connection, allowing fast requests to bypass slow ones without waiting",
            "By opening 10,000 TCP sockets per second",
            "By disabling encryption"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_RPC_PROTOBUF_SERIALIZATION_MULTIPLEXING",
              "errorExplanation": "HTTP/2 binary frame interleaving prevents slow requests from blocking fast ones.",
              "recoveryPath": {
                "simplerExplanation": "Interleaves frames over 1 TCP connection with Stream IDs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Consistent Hashing & Virtual Nodes Distribution",
    "overviewMetaphor": "Consistent Hashing is a round dining table with 4 diners: standard modulo hashing ($K \\pmod N$) is asking all 4 diners to pack their bags and swap seats whenever a 5th guest arrives (99% remapping disaster!); Consistent Hashing places plates on a 360-degree circular table; when a 5th guest sits down, they only take a small slice of food from the person directly to their left, leaving the rest of the table completely undisturbed ($K/N$ key migration).",
    "blocks": [
      {
        "id": "dist-d4-b1-modulo-hashing-disaster",
        "day": 4,
        "blockNumber": 1,
        "title": "The Modulo Hashing Disaster ($K \\pmod N$) vs Hash Ring",
        "conceptBudget": {
          "primaryConcept": "Modulo Hashing Failure Mode",
          "supportingTerms": [
            "Modulo Hashing ($h(k) \\pmod N$)",
            "Scale-Out Disaster: Adding node $N \\to N+1$ remaps $\\approx \\frac{N}{N+1}$ ($90\\%+ $) of all cached keys",
            "Consistent Hash Ring: $0$ to $2^{32}-1$ integer ring",
            "Minimal migration invariant: $\\frac{K}{N}$ keys moved"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Hashing Strategy Key Migration on Scale-Out",
              "boxes": [
                {
                  "label": "1. Modulo Hashing (N=9 -> N=10)",
                  "value": "Keys Remapped: 90.0% -> Massive Cache Miss Storm hits database, causing total backend outage!",
                  "varType": "Disaster",
                  "isUpdated": false
                },
                {
                  "label": "2. Consistent Hashing (N=9 -> N=10)",
                  "value": "Keys Remapped: 10.0% ($1/N+1$) -> Smooth, negligible migration, zero database overload",
                  "varType": "Production Best Practice",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "modulo_churn_demo.js",
            "initialCode": "function calculateModuloChurn(keyCount, originalNodes, newNodes) {\n  let remapped = 0;\n  for (let k = 0; k < keyCount; k++) {\n    const nodeA = k % originalNodes;\n    const nodeB = k % newNodes;\n    if (nodeA !== nodeB) remapped++;\n  }\n  const churnPercent = (remapped / keyCount) * 100;\n  return `Modulo Churn from ${originalNodes} to ${newNodes} servers: ${churnPercent.toFixed(1)}% of keys shifted!`;\n}\n\nconsole.log(calculateModuloChurn(1000, 9, 10));",
            "expectedOutput": "Modulo Churn from 9 to 10 servers: 90.1% of keys shifted!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage of keys are disrupted and remapped when adding 1 server to a 9-server cluster using naive modulo hashing?",
          "expectedStringOutput": "Modulo Churn from 9 to 10 servers: 90.1% of keys shifted!",
          "acceptableAnswers": [
            "Modulo Churn from 9 to 10 servers: 90.1% of keys shifted!",
            "90.1%",
            "90%"
          ],
          "primaryMisconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
          "diagnosisMap": {
            "10%": {
              "misconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
              "errorExplanation": "10% is for Consistent Hashing. Modulo hashing disrupts ~90.1% of keys.",
              "recoveryPath": {
                "simplerExplanation": "Modulo hashing disrupts 90.1% of keys.",
                "guidedFixPrompt": "Type Modulo Churn from 9 to 10 servers: 90.1% of keys shifted!"
              }
            }
          }
        }
      },
      {
        "id": "dist-d4-b2-virtual-nodes-load-balancing",
        "day": 4,
        "blockNumber": 2,
        "title": "Virtual Nodes (V-Nodes): Eliminating Non-Uniform Hotspots",
        "conceptBudget": {
          "primaryConcept": "Virtual Nodes (V-Nodes)",
          "supportingTerms": [
            "Hotspot problem on sparse hash rings (One node owning 60% of ring arc)",
            "Virtual Nodes: Assigning 100-256 virtual token points per physical server",
            "Standard Deviation Variance Reduction ($< 5\\%$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d4-b1-modulo-hashing-disaster",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vnode_balance_demo.js",
            "initialCode": "function evaluateRingVariance(vnodesPerServer) {\n  if (vnodesPerServer === 1) return { variance: '45% (HIGH HOTSPOT RISK)', distribution: 'UNEVEN_CLUSTERING' };\n  if (vnodesPerServer === 100) return { variance: '3.2% (UNIFORM LOAD)', distribution: 'HIGHLY_BALANCED' };\n  return { variance: '< 1.5%', distribution: 'OPTIMAL' };\n}\n\nconsole.log('1 V-Node per Server:', JSON.stringify(evaluateRingVariance(1)));\nconsole.log('100 V-Nodes per Server:', JSON.stringify(evaluateRingVariance(100)));",
            "expectedOutput": "1 V-Node per Server: {\"variance\":\"45% (HIGH HOTSPOT RISK)\",\"distribution\":\"UNEVEN_CLUSTERING\"}\n100 V-Nodes per Server: {\"variance\":\"3.2% (UNIFORM LOAD)\",\"distribution\":\"HIGHLY_BALANCED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do production distributed datastores (like Cassandra and DynamoDB) assign 100+ Virtual Nodes (V-Nodes) to each physical machine?",
          "options": [
            "To interleave server tokens evenly across the entire 360-degree hash ring, preventing non-uniform cluster arcs and ensuring keys are distributed with less than 5% variance",
            "To multiply the CPU speed of physical machines by 100",
            "Because physical disks cannot hold more than 1 hash"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
              "errorExplanation": "V-nodes eliminate ring clustering hotspots and distribute load uniformly.",
              "recoveryPath": {
                "simplerExplanation": "Ensures uniform key distribution and eliminates hotspots.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d4-b3-binary-search-ring-lookup",
        "day": 4,
        "blockNumber": 3,
        "title": "Hash Ring Clockwise Lookup via Binary Search ($O(\\log V)$)",
        "conceptBudget": {
          "primaryConcept": "Hash Ring Binary Search",
          "supportingTerms": [
            "Sorted token array of virtual nodes",
            "Clockwise traversal: finding first node where $\\text{nodeHash} \\ge \\text{keyHash}$",
            "Wrap-around to $\\text{ring}[0]$ when $\\text{keyHash} > \\text{ring}[\\text{last}]$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d4-b2-virtual-nodes-load-balancing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ring_lookup_demo.js",
            "initialCode": "function findClockwiseNode(keyHash, ring) {\n  for (const node of ring) {\n    if (node.hash >= keyHash) return node.id;\n  }\n  return ring[0].id; // Wrap around to the start of the circle\n}\n\nconst ring = [{ hash: 100, id: 'ServerA' }, { hash: 300, id: 'ServerB' }, { hash: 700, id: 'ServerC' }];\nconsole.log('Key Hash 250 ->', findClockwiseNode(250, ring));\nconsole.log('Key Hash 800 (Wrap) ->', findClockwiseNode(800, ring));",
            "expectedOutput": "Key Hash 250 -> ServerB\nKey Hash 800 (Wrap) -> ServerA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which server ID is selected for a key with hash 800 (exceeding all node hashes in the ring)?",
          "expectedStringOutput": "ServerA",
          "acceptableAnswers": [
            "ServerA",
            "Key Hash 800 (Wrap) -> ServerA"
          ],
          "primaryMisconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
          "diagnosisMap": {
            "ServerC": {
              "misconceptionId": "MC_DIST_CONSISTENT_HASHING_VIRTUAL_NODES",
              "errorExplanation": "Hashes greater than the largest token wrap around to ring[0] (ServerA).",
              "recoveryPath": {
                "simplerExplanation": "Wraps around to ring[0] -> ServerA.",
                "guidedFixPrompt": "Type ServerA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense",
    "overviewMetaphor": "Milestone 1 — The Fortress Cache: When a flash sale goes live (100,000 customers requesting the same product ID in 1 second), if your cache key expires at that exact moment without Singleflight Mutex protection, all 100,000 requests slam straight into the PostgreSQL database simultaneously (Thundering Herd Stampede: Database CPU hits 100% and crashes); Singleflight Cache allows exactly 1 single thread to query the DB while placing the remaining 99,999 requests on a shared promise, serving all 100,000 users in 5ms.",
    "blocks": [
      {
        "id": "dist-d5-b1-caching-patterns-taxonomy",
        "day": 5,
        "blockNumber": 1,
        "title": "Caching Patterns: Cache-Aside vs Write-Through vs Write-Back",
        "conceptBudget": {
          "primaryConcept": "Distributed Caching Topologies",
          "supportingTerms": [
            "Cache-Aside (Application reads cache; on miss queries DB and populates cache)",
            "Write-Through (Application writes to cache; cache writes synchronously to DB)",
            "Write-Back / Write-Behind (Application writes to cache; cache queues async batch writes to DB; high risk of data loss on crash)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d4-b1-modulo-hashing-disaster",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Caching Pattern Comparison",
              "boxes": [
                {
                  "label": "1. Cache-Aside (Lazy Loading)",
                  "value": "Read miss queries DB -> Resilient to cache restarts, standard production choice",
                  "varType": "Standard",
                  "isUpdated": true
                },
                {
                  "label": "2. Write-Through",
                  "value": "Sync write to Cache + DB -> Zero stale cache, higher write latency",
                  "varType": "Strong Sync",
                  "isUpdated": false
                },
                {
                  "label": "3. Write-Back (Write-Behind)",
                  "value": "Async batched write to DB -> Ultra fast writes, risk of data loss if node loses power",
                  "varType": "High Speed Risk",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_aside_demo.js",
            "initialCode": "async function cacheAsideGet(key, cache, db) {\n  if (cache.has(key)) return { source: 'CACHE_HIT (0ms)', data: cache.get(key) };\n  const data = await db.query(key);\n  cache.set(key, data);\n  return { source: 'DATABASE_QUERY_AND_CACHED (25ms)', data };\n}\n\nconst mockCache = new Map();\nconst mockDb = { query: async (k) => ({ id: k, balance: 1000 }) };\n\ncacheAsideGet('acc_1', mockCache, mockDb).then(r1 => {\n  console.log('First Call:', r1.source);\n  cacheAsideGet('acc_1', mockCache, mockDb).then(r2 => {\n    console.log('Second Call:', r2.source);\n  });\n});",
            "expectedOutput": "First Call: DATABASE_QUERY_AND_CACHED (25ms)\nSecond Call: CACHE_HIT (0ms)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the data served from on the second call in the Cache-Aside flow?",
          "expectedStringOutput": "CACHE_HIT (0ms)",
          "acceptableAnswers": [
            "CACHE_HIT (0ms)",
            "CACHE_HIT",
            "Second Call: CACHE_HIT (0ms)"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_CACHING_WRITE_THROUGH_CACHE_ASIDE",
          "diagnosisMap": {
            "DATABASE": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_CACHING_WRITE_THROUGH_CACHE_ASIDE",
              "errorExplanation": "The first call cached the value, so the second call is a CACHE_HIT (0ms).",
              "recoveryPath": {
                "simplerExplanation": "Served from CACHE_HIT (0ms).",
                "guidedFixPrompt": "Type CACHE_HIT (0ms)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d5-b2-thundering-herd-singleflight",
        "day": 5,
        "blockNumber": 2,
        "title": "Singleflight Mutex: Crushing Thundering Herd Stampedes",
        "conceptBudget": {
          "primaryConcept": "Singleflight Mutex Pattern",
          "supportingTerms": [
            "Cache Stampede / Thundering Herd",
            "In-flight Promise deduplication Map (`inFlight.set(key, promise)`)",
            "Collapsing $10,000$ concurrent key misses into exactly $1$ database query"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d5-b1-caching-patterns-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Singleflight Mutex Execution Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "10,000 Concurrent Requests hit Cache Miss for 'product_99'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Request 1 acquires Singleflight Lock & initiates Database Query",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Requests 2-10,000 wait on Request 1's shared Promise (Zero DB traffic!)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Database returns data -> Broadcasts to all 10,000 requests simultaneously! (100% Protected)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "singleflight_sim.js",
            "initialCode": "class Singleflight {\n  constructor() { this.inFlight = new Map(); }\n  async do(key, fn) {\n    if (this.inFlight.has(key)) return await this.inFlight.get(key);\n    const promise = fn().finally(() => this.inFlight.delete(key));\n    this.inFlight.set(key, promise);\n    return await promise;\n  }\n}\n\nconst sf = new Singleflight();\nlet dbHits = 0;\nconst fetchDb = async () => { dbHits++; await new Promise(r => setTimeout(r, 10)); return 'DB_VALUE'; };\nPromise.all([sf.do('k1', fetchDb), sf.do('k1', fetchDb), sf.do('k1', fetchDb)]).then(res => {\n  console.log('Total DB Queries Executed:', dbHits);\n  console.log('Returned Value:', res[0]);\n});",
            "expectedOutput": "Total DB Queries Executed: 1\nReturned Value: DB_VALUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total database queries execute when 3 concurrent requests hit the Singleflight module simultaneously for key `k1`?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Total DB Queries Executed: 1"
          ],
          "primaryMisconceptionId": "MC_DIST_CACHE_INVALIDATION_STAMPEDE_THUNDERING_HERD",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DIST_CACHE_INVALIDATION_STAMPEDE_THUNDERING_HERD",
              "errorExplanation": "Singleflight shares the promise across concurrent callers, executing exactly 1 query.",
              "recoveryPath": {
                "simplerExplanation": "Singleflight executes exactly 1 query.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "dist-d5-b3-milestone1-dist-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 High-Performance Distributed Cache Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Distributed Cache Layer Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d5-b2-thundering-herd-singleflight",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_dist_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DIST_CACHE_INVALIDATION_STAMPEDE_THUNDERING_HERD",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_CACHE_INVALIDATION_STAMPEDE_THUNDERING_HERD",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Distributed Locks: Redis Redlock & Fencing Tokens",
    "overviewMetaphor": "A Distributed Lock with Fencing Tokens is a numbered coat-check ticket: Client A acquires Lock #33 to update a warehouse database; during the update, Client A suffers a 10-second JVM Garbage Collection pause; the lock TTL expires and Client B acquires Lock #34; when Client A wakes up from its GC pause and tries to write to the database using its stale Ticket #33, the storage engine rejects the write because it has already seen higher Ticket #34 (Fencing Token defense).",
    "blocks": [
      {
        "id": "dist-d6-b1-gc-pauses-lock-hazard",
        "day": 6,
        "blockNumber": 1,
        "title": "The Distributed Lock Dilemma: Garbage Collection Pauses & Split-Brain",
        "conceptBudget": {
          "primaryConcept": "The Distributed Lock Dilemma",
          "supportingTerms": [
            "Martin Kleppmann vs Salvatore Sanfilippo (Antirez) debate",
            "Process GC pause / VM hypervisor pause causes lock TTL expiration without client knowledge",
            "Unsafe overlapping writes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d5-b1-caching-patterns-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Naive Distributed Lock vs Fencing Token Lock Diff",
              "brokenCode": "// ❌ NAIVE REDIS LOCK (Vulnerable to GC pauses):\n1. Client 1 acquires 'lock:order'\n2. Client 1 enters 10s GC pause -> Redis TTL expires!\n3. Client 2 acquires 'lock:order' and writes to DB\n4. Client 1 wakes up and writes to DB -> OVERWRITES & CORRUPTS Client 2's data!",
              "fixedCode": "// ✅ FENCING TOKEN DISTRIBUTED LOCK:\n1. Client 1 acquires lock with Fencing Token = 33\n2. Client 1 pauses; Lock expires -> Client 2 acquires lock with Fencing Token = 34\n3. Client 2 writes to DB with Token 34 -> Storage records highest seen token = 34\n4. Client 1 wakes up and attempts write with Token 33 -> Storage REJECTS (33 < 34)!",
              "errorLine": 4,
              "errorReason": "Locks without monotonically increasing fencing tokens cannot protect storage writes from delayed clients.",
              "fixExplanation": "Attach monotonic fencing tokens to all storage operations."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fencing_storage_sim.js",
            "initialCode": "class FencedStorage {\n  constructor() {\n    this.highestToken = 0;\n    this.data = null;\n  }\n  write(fencingToken, value) {\n    if (fencingToken <= this.highestToken) {\n      return { success: false, error: `WRITE_REJECTED_STALE_FENCING_TOKEN (${fencingToken} <= ${this.highestToken})` };\n    }\n    this.highestToken = fencingToken;\n    this.data = value;\n    return { success: true, stored: value };\n  }\n}\n\nconst db = new FencedStorage();\nconsole.log('Client 2 writes with Token 34:', db.write(34, 'Client 2 Data').success);\nconsole.log('Delayed Client 1 writes with Token 33:', db.write(33, 'Client 1 Stale Data').error);",
            "expectedOutput": "Client 2 writes with Token 34: true\nDelayed Client 1 writes with Token 33: WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error message is returned when delayed Client 1 attempts a storage write with stale Fencing Token 33 after Token 34 has already been recorded?",
          "expectedStringOutput": "WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)",
          "acceptableAnswers": [
            "WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)",
            "WRITE_REJECTED_STALE_FENCING_TOKEN",
            "Delayed Client 1 writes with Token 33: WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
              "errorExplanation": "Stale fencing tokens (33 <= 34) are rejected by the storage layer.",
              "recoveryPath": {
                "simplerExplanation": "Stale token rejected: WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34).",
                "guidedFixPrompt": "Type WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d6-b2-redlock-multi-master-algorithm",
        "day": 6,
        "blockNumber": 2,
        "title": "The Redlock Algorithm across $N$ Independent Redis Masters",
        "conceptBudget": {
          "primaryConcept": "Redlock Algorithm",
          "supportingTerms": [
            "Acquiring lock across $N=5$ independent Redis instances sequentially",
            "Quorum condition: Lock acquired on $\\ge 3$ nodes within timeout budget",
            "Total lock validity = $\\text{TTL} - \\text{AcquisitionTime} - \\text{ClockDrift}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d6-b1-gc-pauses-lock-hazard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Redlock Quorum Validity Equation",
            "codeSnippet": "const ttlMs = 10000;\nconst acquisitionElapsedMs = 150;\nconst clockDriftMs = 50;\nconst remainingValidityMs = ttlMs - acquisitionElapsedMs - clockDriftMs; // 9,800ms validity",
            "lineNotes": {
              "4": "Subtracts acquisition time and clock drift to guarantee valid lease window."
            }
          },
          {
            "type": "runnable_code",
            "filename": "redlock_sim.js",
            "initialCode": "function evaluateRedlock(acquiredCount, totalMasters = 5, validityMs = 9800) {\n  const quorum = Math.floor(totalMasters / 2) + 1;\n  const hasQuorum = acquiredCount >= quorum;\n  return {\n    acquiredCount,\n    quorumRequired: quorum,\n    lockGranted: hasQuorum && validityMs > 0,\n    status: (hasQuorum && validityMs > 0) ? 'REDLOCK_ACQUISITION_SUCCESS' : 'REDLOCK_FAILED_RELEASE_ALL'\n  };\n}\n\nconsole.log('Acquired on 4 of 5 nodes:', evaluateRedlock(4).status);\nconsole.log('Acquired on 2 of 5 nodes:', evaluateRedlock(2).status);",
            "expectedOutput": "Acquired on 4 of 5 nodes: REDLOCK_ACQUISITION_SUCCESS\nAcquired on 2 of 5 nodes: REDLOCK_FAILED_RELEASE_ALL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when Redlock only succeeds on 2 out of 5 Redis master instances?",
          "expectedStringOutput": "REDLOCK_FAILED_RELEASE_ALL",
          "acceptableAnswers": [
            "REDLOCK_FAILED_RELEASE_ALL",
            "Acquired on 2 of 5 nodes: REDLOCK_FAILED_RELEASE_ALL"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
              "errorExplanation": "2 of 5 is less than the required quorum of 3, failing acquisition (REDLOCK_FAILED_RELEASE_ALL).",
              "recoveryPath": {
                "simplerExplanation": "Fails quorum -> REDLOCK_FAILED_RELEASE_ALL.",
                "guidedFixPrompt": "Type REDLOCK_FAILED_RELEASE_ALL"
              }
            }
          }
        }
      },
      {
        "id": "dist-d6-b3-auto-renew-heartbeat-leases",
        "day": 6,
        "blockNumber": 3,
        "title": "Auto-Renewing Heartbeat Leases (Lock Watchdogs)",
        "conceptBudget": {
          "primaryConcept": "Lock Watchdog Auto-Renewal",
          "supportingTerms": [
            "Lock Watchdog timer (Renews TTL at $\\frac{1}{3}\\text{TTL}$ intervals)",
            "Cancelling watchdog if worker crashes or finishes early",
            "Preventing premature lock release on long-running tasks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d6-b2-redlock-multi-master-algorithm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "watchdog_demo.js",
            "initialCode": "function getWatchdogInterval(ttlSec = 30) {\n  const interval = ttlSec / 3;\n  return `Renew lock lease every ${interval} seconds while worker thread is alive.`;\n}\n\nconsole.log(getWatchdogInterval(30));",
            "expectedOutput": "Renew lock lease every 10 seconds while worker thread is alive.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary role of a Lock Watchdog background thread in distributed lock frameworks (like Redisson)?",
          "options": [
            "It periodically extends the lock TTL lease while the owning worker process is actively running, preventing the lock from prematurely expiring during legitimately long computations",
            "It deletes other users' database rows",
            "It changes the server IP address"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_LOCKS_REDLOCK_TTL_LEASE",
              "errorExplanation": "Watchdogs extend leases automatically for active workers to prevent premature timeouts.",
              "recoveryPath": {
                "simplerExplanation": "Extends TTL lease periodically while worker is healthy.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Leader Election: Bully Algorithm & Raft Heartbeats",
    "overviewMetaphor": "Leader Election is a parliamentary government electing a Prime Minister: in the Bully Algorithm, the member with the highest seniority badge (Highest Node ID) shouts \"I am in charge!\" to all junior members; in Raft Randomized Heartbeat Elections, nodes sleep with random alarm clocks (150ms-300ms); the first node whose alarm goes off immediately declares candidacy and gathers quorum votes before anyone else wakes up, avoiding split-vote ties.",
    "blocks": [
      {
        "id": "dist-d7-b1-bully-algorithm-mechanics",
        "day": 7,
        "blockNumber": 1,
        "title": "The Bully Algorithm: Process ID Hierarchy & Coordinator Broadcast",
        "conceptBudget": {
          "primaryConcept": "The Bully Algorithm",
          "supportingTerms": [
            "Process ID ($P_{ID}$) Hierarchy",
            "Election Message (Sent only to processes with higher ID)",
            "OK Response (Higher process takes over election)",
            "Coordinator Broadcast Message"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d6-b1-gc-pauses-lock-hazard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bully Algorithm Message Exchange",
            "codeSnippet": "// Node 2 notices Node 5 (Leader) crashed:\n// 1. Node 2 sends ELECTION to Nodes 3, 4, 5\n// 2. Nodes 3 and 4 reply 'OK' (Node 5 is dead)\n// 3. Node 4 sends ELECTION to Node 5 -> No response\n// 4. Node 4 broadcasts: 'COORDINATOR: Node 4 is the new Leader!'",
            "lineNotes": {
              "2": "Higher nodes supersede lower nodes.",
              "5": "Highest surviving node becomes coordinator."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bully_sim_demo.js",
            "initialCode": "function electBullyLeader(activeProcesses) {\n  const maxProcess = Math.max(...activeProcesses);\n  return `Process ${maxProcess} wins Bully election and broadcasts COORDINATOR.`;\n}\n\nconsole.log(electBullyLeader([1, 2, 3, 4]));",
            "expectedOutput": "Process 4 wins Bully election and broadcasts COORDINATOR.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which process wins the Bully election among active processes `[1, 2, 3, 4]`?",
          "expectedStringOutput": "Process 4 wins Bully election and broadcasts COORDINATOR.",
          "acceptableAnswers": [
            "Process 4 wins Bully election and broadcasts COORDINATOR.",
            "Process 4",
            "4"
          ],
          "primaryMisconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
              "errorExplanation": "Bully algorithm always promotes the highest process ID (Process 4).",
              "recoveryPath": {
                "simplerExplanation": "Highest process ID wins -> Process 4.",
                "guidedFixPrompt": "Type Process 4 wins Bully election and broadcasts COORDINATOR."
              }
            }
          }
        }
      },
      {
        "id": "dist-d7-b2-raft-randomized-election-timeouts",
        "day": 7,
        "blockNumber": 2,
        "title": "Raft Randomized Election Timeouts & Split-Vote Prevention",
        "conceptBudget": {
          "primaryConcept": "Raft Randomized Election Timeouts",
          "supportingTerms": [
            "Heartbeat Interval (e.g. 50ms from Leader)",
            "Randomized Election Timeout (150ms - 300ms)",
            "RequestVote RPC with Candidate Term ($T$)",
            "Split-Vote Mitigation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d7-b1-bully-algorithm-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Raft Node State Machine Transitions",
              "boxes": [
                {
                  "label": "Follower",
                  "value": "Receives heartbeats from Leader; if timeout expires -> Transitions to Candidate",
                  "varType": "Passive",
                  "isUpdated": false
                },
                {
                  "label": "Candidate",
                  "value": "Increments Term, votes for self, sends RequestVote to all nodes; on Majority -> Transitions to Leader",
                  "varType": "Active Election",
                  "isUpdated": true
                },
                {
                  "label": "Leader",
                  "value": "Sends periodic AppendEntries heartbeats (50ms) to maintain authority",
                  "varType": "Authoritative",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "random_timeout_demo.js",
            "initialCode": "function generateElectionTimeouts(nodeCount = 3) {\n  const timeouts = [];\n  for (let i = 1; i <= nodeCount; i++) {\n    const ms = 150 + Math.floor(Math.random() * 150); // 150-300ms\n    timeouts.push(`Node ${i}: ${ms}ms`);\n  }\n  return timeouts;\n}\n\nconsole.log(generateElectionTimeouts(3).join('\\n'));",
            "expectedOutput": "Node 1: 220ms\nNode 2: 180ms\nNode 3: 290ms",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the Raft consensus algorithm randomize election timeouts between 150ms and 300ms across cluster nodes?",
          "options": [
            "To make it statistically improbable that multiple follower nodes time out simultaneously and split the vote into a deadlock, allowing one single node to time out first and gather a majority quorum",
            "Because random numbers generate cryptographic hashes",
            "Because CPUs cannot count to fixed numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
              "errorExplanation": "Randomized timeouts break symmetry and prevent split-vote deadlocks.",
              "recoveryPath": {
                "simplerExplanation": "Prevents split-vote deadlocks by desynchronizing election timeouts.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d7-b3-split-brain-majority-quorum",
        "day": 7,
        "blockNumber": 3,
        "title": "Split-Brain Defense via Strict Majority Quorum",
        "conceptBudget": {
          "primaryConcept": "Split-Brain Majority Quorum",
          "supportingTerms": [
            "Strict Majority: $\\lfloor N/2 \\rfloor + 1$",
            "Network partition dividing 5-node cluster into 3 vs 2",
            "Minority partition (2 nodes) cannot elect a leader or commit logs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d7-b2-raft-randomized-election-timeouts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "split_brain_sim.js",
            "initialCode": "function evaluatePartitionQuorum(partitionSize, totalCluster = 5) {\n  const majority = Math.floor(totalCluster / 2) + 1;\n  return partitionSize >= majority \n    ? 'MAJORITY_QUORUM: ELECT_LEADER_AND_PROCESS_WRITES'\n    : 'MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER';\n}\n\nconsole.log('Partition with 3 nodes (of 5):', evaluatePartitionQuorum(3, 5));\nconsole.log('Partition with 2 nodes (of 5):', evaluatePartitionQuorum(2, 5));",
            "expectedOutput": "Partition with 3 nodes (of 5): MAJORITY_QUORUM: ELECT_LEADER_AND_PROCESS_WRITES\nPartition with 2 nodes (of 5): MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can a minority partition of 2 nodes in a 5-node cluster elect a new leader and accept writes?",
          "expectedStringOutput": "MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER",
          "acceptableAnswers": [
            "MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER",
            "No",
            "Partition with 2 nodes (of 5): MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER"
          ],
          "primaryMisconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
          "diagnosisMap": {
            "MAJORITY": {
              "misconceptionId": "MC_DIST_LEADER_ELECTION_BULLY_RING_RAFT",
              "errorExplanation": "2 of 5 lacks majority (needs 3), remaining in MINORITY_ISOLATION.",
              "recoveryPath": {
                "simplerExplanation": "Minority is in MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER.",
                "guidedFixPrompt": "Type MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Distributed Unique ID Generation: Twitter Snowflake & ULID",
    "overviewMetaphor": "Snowflake ID Generation is minting vehicle VIN numbers at 1,000 independent car factories worldwide without a central phone line: every factory stamps a 64-bit metal plate: Part 1: The exact millisecond timestamp (ensuring all cars minted in 2026 sort after cars minted in 2025); Part 2: Factory #42's machine ID (ensuring Factory 42 never collides with Factory 99); Part 3: A local conveyor-belt sequence number (up to 4,096 cars per millisecond).",
    "blocks": [
      {
        "id": "dist-d8-b1-uuid-vs-snowflake-b-tree",
        "day": 8,
        "blockNumber": 1,
        "title": "UUIDv4 vs 64-bit Snowflake: Database B-Tree Index Fragmentation",
        "conceptBudget": {
          "primaryConcept": "Snowflake vs UUID Indexing",
          "supportingTerms": [
            "UUIDv4 (128-bit random: causes catastrophic B-Tree page splits and cache churn)",
            "Twitter Snowflake (64-bit time-ordered integer: append-only B-Tree inserts, 50% storage size)",
            "ULID (Universally Unique Lexicographically Sortable Identifier)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Primary Key Indexing Performance Comparison",
              "boxes": [
                {
                  "label": "UUIDv4 (Random 128-bit)",
                  "value": "B-Tree Inserts: Random Page Splits | Index Size: 16 bytes | Cache Miss Rate: High",
                  "varType": "Fragmented",
                  "isUpdated": false
                },
                {
                  "label": "Snowflake (Time-ordered 64-bit)",
                  "value": "B-Tree Inserts: Append-Only Right-Leaf | Index Size: 8 bytes | Cache Miss Rate: Near Zero",
                  "varType": "Optimized B-Tree",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "snowflake_layout_demo.js",
            "initialCode": "function explainSnowflakeBitLayout() {\n  return {\n    totalBits: 64,\n    layout: {\n      signBit: '1 bit (always 0 for positive numbers)',\n      timestampBits: '41 bits (Milliseconds since custom epoch = 69.7 years capacity)',\n      datacenterBits: '5 bits (32 datacenters)',\n      workerBits: '5 bits (32 worker machines per datacenter)',\n      sequenceBits: '12 bits (4,096 unique IDs per millisecond per worker)'\n    }\n  };\n}\n\nconsole.log(JSON.stringify(explainSnowflakeBitLayout()));",
            "expectedOutput": "{\"totalBits\":64,\"layout\":{\"signBit\":\"1 bit (always 0 for positive numbers)\",\"timestampBits\":\"41 bits (Milliseconds since custom epoch = 69.7 years capacity)\",\"datacenterBits\":\"5 bits (32 datacenters)\",\"workerBits\":\"5 bits (32 worker machines per datacenter)\",\"sequenceBits\":\"12 bits (4,096 unique IDs per millisecond per worker)\"}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many unique IDs can a single Snowflake worker machine generate per millisecond using its 12-bit sequence counter ($2^{12}$)?",
          "expectedStringOutput": "4096",
          "acceptableAnswers": [
            "4096",
            "4,096",
            "4096 unique IDs per millisecond per worker"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
          "diagnosisMap": {
            "1024": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
              "errorExplanation": "2^12 = 4,096 unique IDs per millisecond.",
              "recoveryPath": {
                "simplerExplanation": "2^12 = 4096.",
                "guidedFixPrompt": "Type 4096"
              }
            }
          }
        }
      },
      {
        "id": "dist-d8-b2-clock-backward-drift-handling",
        "day": 8,
        "blockNumber": 2,
        "title": "Clock Backward Drift (NTP Rewind) & Safety Guards",
        "conceptBudget": {
          "primaryConcept": "NTP Clock Backward Drift Defense",
          "supportingTerms": [
            "NTP Clock adjustments stepping backward in time",
            "Risk: Generating duplicate Snowflake IDs from a past millisecond",
            "Safety Guard: Wait / Sleep or Reject until clock catches up"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d8-b1-uuid-vs-snowflake-b-tree",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Clock Drift Safety Guard in Snowflake Generator",
            "codeSnippet": "if (currentTimestamp < lastTimestamp) {\n  const driftMs = lastTimestamp - currentTimestamp;\n  if (driftMs <= 5) {\n    // Small drift: Sleep until clock catches up\n    sleep(driftMs);\n  } else {\n    // Large drift: Throw error to prevent duplicate ID generation\n    throw new Error('CLOCK_BACKWARD_DRIFT_DETECTED');\n  }\n}",
            "lineNotes": {
              "1": "Detects if physical system clock was stepped backward by NTP.",
              "7": "Rejects ID generation to guarantee global mathematical uniqueness."
            }
          },
          {
            "type": "runnable_code",
            "filename": "clock_drift_demo.js",
            "initialCode": "function checkClockDrift(currentTs, lastTs) {\n  if (currentTs < lastTs) {\n    return { safe: false, error: 'CLOCK_BACKWARD_DRIFT_DETECTED', action: 'REJECT_OR_SLEEP' };\n  }\n  return { safe: true, action: 'GENERATE_SNOWFLAKE_ID' };\n}\n\nconsole.log('Clock advanced:', checkClockDrift(1001, 1000).action);\nconsole.log('Clock rewound by NTP:', checkClockDrift(998, 1000).action);",
            "expectedOutput": "Clock advanced: GENERATE_SNOWFLAKE_ID\nClock rewound by NTP: REJECT_OR_SLEEP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when the system clock reads 998ms after previously generating an ID at 1000ms?",
          "expectedStringOutput": "REJECT_OR_SLEEP",
          "acceptableAnswers": [
            "REJECT_OR_SLEEP",
            "Clock rewound by NTP: REJECT_OR_SLEEP"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
          "diagnosisMap": {
            "GENERATE": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
              "errorExplanation": "Clock backward drift requires REJECT_OR_SLEEP to prevent duplicate IDs.",
              "recoveryPath": {
                "simplerExplanation": "Backward drift triggers REJECT_OR_SLEEP.",
                "guidedFixPrompt": "Type REJECT_OR_SLEEP"
              }
            }
          }
        }
      },
      {
        "id": "dist-d8-b3-ulid-lexicographical-sorting",
        "day": 8,
        "blockNumber": 3,
        "title": "ULID: 128-Bit Lexicographically Sortable Crockford Base32 IDs",
        "conceptBudget": {
          "primaryConcept": "ULID Architecture",
          "supportingTerms": [
            "Crockford's Base32 encoding (Excludes I, L, O, U to avoid human reading confusion)",
            "48-bit timestamp (Millisecond precision up to year 10889 AD) + 80-bit randomness",
            "URL-safe, 26-character string"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d8-b2-clock-backward-drift-handling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ulid_demo.js",
            "initialCode": "function generateMockUlid(ts = Date.now()) {\n  const timePart = ts.toString(36).toUpperCase().padStart(10, '0');\n  const randPart = '01ARZ3NDEKTSV4RRFFQ69G5FAV'.substr(0, 16);\n  return `${timePart}${randPart}`;\n}\n\nconst ulid1 = generateMockUlid(1700000000000);\nconst ulid2 = generateMockUlid(1700000001000);\nconsole.log('ULID 1 (earlier):', ulid1);\nconsole.log('ULID 2 (later):  ', ulid2);\nconsole.log('Lexicographical sort order correct?:', ulid1 < ulid2);",
            "expectedOutput": "ULID 1 (earlier): 01IZBRN10001ARZ3NDEKTSV4RR\nULID 2 (later):   01IZBRN10W01ARZ3NDEKTSV4RR\nLexicographical sort order correct?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What makes ULIDs (Universally Unique Lexicographically Sortable Identifiers) compatible with URL routing and standard SQL string primary keys?",
          "options": [
            "They encode 48-bit timestamps and 80-bit randomness into a 26-character Crockford Base32 string that naturally sorts in chronological order when sorted as plain ASCII text",
            "Because ULIDs contain only numbers",
            "Because ULIDs are generated by DNS servers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_UNIQUE_ID_SNOWFLAKE_ULID",
              "errorExplanation": "ULIDs use Crockford Base32 to ensure alphabetical sort matches chronological time order.",
              "recoveryPath": {
                "simplerExplanation": "Sorts in chronological time order when sorted as plain text.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Consensus Protocols: Raft Log Replication & Quorum Mathematics",
    "overviewMetaphor": "Raft Consensus is a courtroom court reporter: the Judge (Leader) writes down trial testimony entry-by-entry in their official journal (Log); before an entry is officially locked into law (Committed), the Judge sends copies to 5 jury members (Followers); as soon as 3 jury members (Quorum: $N/2 + 1$) acknowledge writing the entry into their own journals, the Judge bangs the gavel, applying the entry permanently to the state machine.",
    "blocks": [
      {
        "id": "dist-d9-b1-raft-log-entry-structure",
        "day": 9,
        "blockNumber": 1,
        "title": "Raft Log Anatomy: Index, Term & State Machine Commands",
        "conceptBudget": {
          "primaryConcept": "Raft Log Entry Anatomy",
          "supportingTerms": [
            "Log Index ($1, 2, 3, \\dots$)",
            "Term Number ($T=1, T=2$)",
            "Command Payload (`SET balance=500`)",
            "Committed Index ($commitIndex$) vs Applied Index ($lastApplied$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d7-b2-raft-randomized-election-timeouts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Raft Log Entry Array",
            "codeSnippet": "const raftLog = [\n  { index: 1, term: 1, command: 'SET x = 10' },\n  { index: 2, term: 1, command: 'SET y = 20' },\n  { index: 3, term: 2, command: 'SET x = 15' } // Leader changed in Term 2\n];",
            "lineNotes": {
              "2": "Index 1 created under Leader Term 1.",
              "4": "Index 3 created under new Leader Term 2."
            }
          },
          {
            "type": "runnable_code",
            "filename": "raft_log_demo.js",
            "initialCode": "function verifyLogConsistency(followerLog, prevIndex, prevTerm) {\n  if (prevIndex === 0) return true;\n  const entry = followerLog[prevIndex - 1];\n  return Boolean(entry && entry.term === prevTerm);\n}\n\nconst log = [{ index: 1, term: 1 }, { index: 2, term: 1 }];\nconsole.log('Matches Prev (Index 2, Term 1):', verifyLogConsistency(log, 2, 1));\nconsole.log('Mismatch Prev (Index 2, Term 2):', verifyLogConsistency(log, 2, 2));",
            "expectedOutput": "Matches Prev (Index 2, Term 1): true\nMismatch Prev (Index 2, Term 2): false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does Raft accept log replication when the follower's log at `prevIndex` matches the leader's `prevTerm`?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Matches Prev (Index 2, Term 1): true"
          ],
          "primaryMisconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
              "errorExplanation": "Matching prevIndex and prevTerm confirms log continuity (true).",
              "recoveryPath": {
                "simplerExplanation": "Matching term and index returns true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "dist-d9-b2-append-entries-rpc-quorum-commit",
        "day": 9,
        "blockNumber": 2,
        "title": "AppendEntries RPC & Majority Quorum Commitment",
        "conceptBudget": {
          "primaryConcept": "Raft Quorum Commit Rule",
          "supportingTerms": [
            "AppendEntries RPC parameters (`term, leaderId, prevLogIndex, prevLogTerm, entries, leaderCommit`)",
            "Commit Condition: Replicated to $\\lfloor N/2 \\rfloor + 1$ nodes in current term",
            "Applying committed logs to state machine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d9-b1-raft-log-entry-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Raft Log Replication & Commit Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "Client sends command -> Leader appends entry to local uncommitted log",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Leader broadcasts AppendEntries RPC to all 4 Followers in parallel",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "2 of 4 Followers acknowledge -> Leader reaches Quorum (3 of 5 nodes Total)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Leader commits entry, applies to state machine, and replies 200 OK to Client!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "quorum_commit_sim.js",
            "initialCode": "function checkCommitQuorum(ackedFollowers, totalCluster = 5) {\n  const totalAcked = ackedFollowers + 1; // +1 for Leader itself\n  const quorum = Math.floor(totalCluster / 2) + 1;\n  return totalAcked >= quorum ? 'LOG_ENTRY_COMMITTED' : 'AWAITING_FURTHER_ACKS';\n}\n\nconsole.log('2 Followers Acked (of 5):', checkCommitQuorum(2, 5));\nconsole.log('1 Follower Acked (of 5):', checkCommitQuorum(1, 5));",
            "expectedOutput": "2 Followers Acked (of 5): LOG_ENTRY_COMMITTED\n1 Follower Acked (of 5): AWAITING_FURTHER_ACKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the commit status when 2 followers + 1 leader acknowledge an entry in a 5-node Raft cluster?",
          "expectedStringOutput": "LOG_ENTRY_COMMITTED",
          "acceptableAnswers": [
            "LOG_ENTRY_COMMITTED",
            "2 Followers Acked (of 5): LOG_ENTRY_COMMITTED",
            "Committed"
          ],
          "primaryMisconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
          "diagnosisMap": {
            "AWAITING": {
              "misconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
              "errorExplanation": "2 followers + 1 leader = 3 nodes, satisfying the 3/5 quorum requirement (LOG_ENTRY_COMMITTED).",
              "recoveryPath": {
                "simplerExplanation": "3 of 5 nodes = LOG_ENTRY_COMMITTED.",
                "guidedFixPrompt": "Type LOG_ENTRY_COMMITTED"
              }
            }
          }
        }
      },
      {
        "id": "dist-d9-b3-log-compaction-snapshots",
        "day": 9,
        "blockNumber": 3,
        "title": "Log Compaction & Snapshotting Memory Optimization",
        "conceptBudget": {
          "primaryConcept": "Raft Log Compaction",
          "supportingTerms": [
            "Unbounded log growth risk (Millions of entries exhausting disk)",
            "Periodic Snapshotting (Freezing state machine into checkpoint image)",
            "Discarding log entries up to $lastIncludedIndex$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d9-b2-append-entries-rpc-quorum-commit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "snapshot_demo.js",
            "initialCode": "function compactRaftLog(fullLog, snapshotIndex, snapshotState) {\n  const compacted = fullLog.filter(e => e.index > snapshotIndex);\n  return {\n    snapshotState,\n    lastIncludedIndex: snapshotIndex,\n    remainingLogLength: compacted.length\n  };\n}\n\nconst log = Array.from({ length: 1000 }, (_, i) => ({ index: i + 1, cmd: 'INC' }));\nconst res = compactRaftLog(log, 900, { counter: 900 });\nconsole.log('Compacted Log Length:', res.remainingLogLength);",
            "expectedOutput": "Compacted Log Length: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many log entries remain in the active log after snapshotting the first 900 entries of a 1,000-entry log?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "Compacted Log Length: 100",
            "100 entries"
          ],
          "primaryMisconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
          "diagnosisMap": {
            "900": {
              "misconceptionId": "MC_DIST_CONSENSUS_RAFT_LOG_REPLICATION_HEARTBEATS",
              "errorExplanation": "1000 - 900 = 100 remaining active log entries.",
              "recoveryPath": {
                "simplerExplanation": "1000 - 900 = 100.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Two-Phase Commit (2PC) vs Three-Phase Commit (3PC)",
    "overviewMetaphor": "Two-Phase Commit is an in-person wedding ceremony: Phase 1 (Prepare): The priest asks Groom and Bride \"Do you take each other?\" (Both must vote YES); Phase 2 (Commit): The priest declares \"I now pronounce you married!\"; the major flaw of 2PC is Coordinator Blocking: if the priest faints right after both voted YES before saying the magic words, Groom and Bride are stuck waiting at the altar indefinitely without knowing if they are married or free to leave.",
    "blocks": [
      {
        "id": "dist-d10-b1-2pc-prepare-commit-phases",
        "day": 10,
        "blockNumber": 1,
        "title": "Two-Phase Commit (2PC): Prepare Phase & Commit Phase",
        "conceptBudget": {
          "primaryConcept": "Two-Phase Commit Protocol",
          "supportingTerms": [
            "Coordinator Node & Participant Cohorts",
            "Phase 1: Prepare (Acquires local database row locks and writes undo/redo log)",
            "Phase 2: Global Commit (If all vote YES) / Global Abort (If any vote NO)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d9-b2-append-entries-rpc-quorum-commit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "2PC Phase Protocol Transitions",
              "boxes": [
                {
                  "label": "Phase 1: Prepare",
                  "value": "Coordinator broadcasts 'PREPARE' -> Cohorts lock resources and reply 'VOTE_COMMIT' or 'VOTE_ABORT'",
                  "varType": "Voting Phase",
                  "isUpdated": false
                },
                {
                  "label": "Phase 2: Commit / Abort",
                  "value": "If all YES -> Coordinator sends 'GLOBAL_COMMIT'; If ANY node votes NO -> Coordinator sends 'GLOBAL_ABORT'",
                  "varType": "Decision Phase",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "twopc_demo.js",
            "initialCode": "function evaluate2pcVotes(votes) {\n  const allYes = votes.every(v => v === 'YES');\n  return allYes ? 'GLOBAL_COMMIT' : 'GLOBAL_ABORT';\n}\n\nconsole.log('All Cohorts Vote YES:', evaluate2pcVotes(['YES', 'YES', 'YES']));\nconsole.log('One Cohort Votes NO:', evaluate2pcVotes(['YES', 'NO', 'YES']));",
            "expectedOutput": "All Cohorts Vote YES: GLOBAL_COMMIT\nOne Cohort Votes NO: GLOBAL_ABORT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What global action is taken in 2PC when 2 cohorts vote YES and 1 cohort votes NO?",
          "expectedStringOutput": "GLOBAL_ABORT",
          "acceptableAnswers": [
            "GLOBAL_ABORT",
            "One Cohort Votes NO: GLOBAL_ABORT",
            "Abort"
          ],
          "primaryMisconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
          "diagnosisMap": {
            "GLOBAL_COMMIT": {
              "misconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
              "errorExplanation": "2PC requires 100% unanimous agreement. Any NO vote triggers GLOBAL_ABORT.",
              "recoveryPath": {
                "simplerExplanation": "Unanimous YES required; single NO triggers GLOBAL_ABORT.",
                "guidedFixPrompt": "Type GLOBAL_ABORT"
              }
            }
          }
        }
      },
      {
        "id": "dist-d10-b2-coordinator-blocking-failure-mode",
        "day": 10,
        "blockNumber": 2,
        "title": "The Coordinator Blocking Flaw: Resource Lock Deadlocks",
        "conceptBudget": {
          "primaryConcept": "2PC Blocking Problem",
          "supportingTerms": [
            "Coordinator crash after Prepare phase",
            "Participants held in uncertain commit state holding exclusive row locks",
            "Database thread pool exhaustion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d10-b1-2pc-prepare-commit-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "2PC Coordinator Blocking Vulnerability Diff",
              "brokenCode": "// ❌ 2PC BLOCKING HAZARD:\n1. Coordinator sends 'PREPARE' -> DB1 & DB2 acquire row locks and vote YES\n2. Coordinator CRASHES before sending Phase 2 decision\n3. DB1 and DB2 are STUCK holding row locks forever, blocking all other app queries!",
              "fixedCode": "// ✅ MODERN SOLUTION (Saga Pattern or 3PC):\n// Use Sagas with independent local transactions and asynchronous compensating rollbacks,\n// completely avoiding long-lived distributed 2PC row locks!",
              "errorLine": 3,
              "errorReason": "2PC is a blocking protocol: participants cannot safely abort or commit without the coordinator.",
              "fixExplanation": "Replace distributed blocking transactions with Sagas and compensating actions."
            }
          },
          {
            "type": "runnable_code",
            "filename": "blocking_sim.js",
            "initialCode": "function evaluateCohortState(hasVotedYes, coordinatorAlive) {\n  if (hasVotedYes && !coordinatorAlive) {\n    return 'BLOCKED_HOLDING_EXCLUSIVE_ROW_LOCKS_INDEFINITELY';\n  }\n  return 'COHORT_NORMAL_EXECUTION';\n}\n\nconsole.log(evaluateCohortState(true, false));",
            "expectedOutput": "BLOCKED_HOLDING_EXCLUSIVE_ROW_LOCKS_INDEFINITELY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is traditional Two-Phase Commit (2PC) rarely used across modern cloud microservices?",
          "options": [
            "Because 2PC is a synchronous blocking protocol: if the coordinator crashes during Phase 2, all participating databases are forced to hold exclusive locks indefinitely, degrading performance and causing cluster-wide deadlocks",
            "Because 2PC only works on floppy disks",
            "Because SQL databases ban 2PC"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
              "errorExplanation": "Synchronous blocking and lock holding make 2PC brittle across microservices.",
              "recoveryPath": {
                "simplerExplanation": "Synchronous lock blocking makes 2PC fragile in microservices.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d10-b3-three-phase-commit-non-blocking",
        "day": 10,
        "blockNumber": 3,
        "title": "Three-Phase Commit (3PC): CanCommit $\\to$ PreCommit $\\to$ DoCommit",
        "conceptBudget": {
          "primaryConcept": "Three-Phase Commit (3PC)",
          "supportingTerms": [
            "Skeen's 3PC Protocol",
            "CanCommit? $\\to$ PreCommit $\\to$ DoCommit",
            "Adding timeout transitions to resolve coordinator failure in fail-stop models"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d10-b2-coordinator-blocking-failure-mode",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "three_pc_demo.js",
            "initialCode": "function explain3pcPhases() {\n  return [\n    'Phase 1: CanCommit? (Check resource availability)',\n    'Phase 2: PreCommit (Write intent to log; timeout triggers abort)',\n    'Phase 3: DoCommit (Final commit; timeout triggers auto-commit)'\n  ];\n}\n\nconsole.log(explain3pcPhases().join('\\n'));",
            "expectedOutput": "Phase 1: CanCommit? (Check resource availability)\nPhase 2: PreCommit (Write intent to log; timeout triggers abort)\nPhase 3: DoCommit (Final commit; timeout triggers auto-commit)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Phase 2 in the Three-Phase Commit protocol?",
          "expectedStringOutput": "Phase 2: PreCommit (Write intent to log; timeout triggers abort)",
          "acceptableAnswers": [
            "Phase 2: PreCommit (Write intent to log; timeout triggers abort)",
            "PreCommit",
            "Phase 2: PreCommit"
          ],
          "primaryMisconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
          "diagnosisMap": {
            "DoCommit": {
              "misconceptionId": "MC_DIST_PAXOS_TWO_PHASE_COMMIT_2PC_3PC",
              "errorExplanation": "DoCommit is Phase 3. Phase 2 is PreCommit.",
              "recoveryPath": {
                "simplerExplanation": "Phase 2 is PreCommit.",
                "guidedFixPrompt": "Type Phase 2: PreCommit (Write intent to log; timeout triggers abort)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "The Saga Pattern: Orchestration vs Choreography & Compensating Actions",
    "overviewMetaphor": "The Saga Pattern is booking a complete vacation package: Step 1: Book flight (Succeeds); Step 2: Book hotel (Succeeds); Step 3: Rent rental car (Fails: No cars available!); instead of holding a global 2PC database lock on the airline and hotel while waiting for a rental car, the Saga simply triggers backward Compensating Actions: Step 2 Undo: `cancel_hotel_booking()`; Step 1 Undo: `cancel_flight_and_refund()`; returning all microservices to a clean state.",
    "blocks": [
      {
        "id": "dist-d11-b1-saga-pattern-compensations",
        "day": 11,
        "blockNumber": 1,
        "title": "The Saga Pattern & Semantic Compensating Rollbacks",
        "conceptBudget": {
          "primaryConcept": "The Saga Pattern (Garcia-Molina & Salem)",
          "supportingTerms": [
            "Sequence of local database transactions: $T_1, T_2, \\dots, T_n$",
            "Compensating Transactions: $C_1, C_2, \\dots, C_{n-1}$ executed in reverse order on failure",
            "Eventual Consistency across microservices without 2PC locks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d10-b2-coordinator-blocking-failure-mode",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Saga Forward & Compensating Action Pairs",
            "codeSnippet": "const sagaDefinitions = [\n  { name: 'ReserveCredit', action: 'charge_user_card()', compensate: 'refund_user_card()' },\n  { name: 'ReserveInventory', action: 'decrement_stock()', compensate: 'restock_inventory()' },\n  { name: 'CreateShipment', action: 'create_fedex_label()', compensate: 'cancel_fedex_label()' }\n];",
            "lineNotes": {
              "2": "Every forward action has a matching semantic undo compensating action.",
              "4": "If CreateShipment fails, restock_inventory() and refund_user_card() execute in reverse order."
            }
          },
          {
            "type": "runnable_code",
            "filename": "saga_rollback_demo.js",
            "initialCode": "async function runSaga(steps) {\n  const executed = [];\n  for (const s of steps) {\n    if (s.shouldFail) {\n      const rollbacks = executed.reverse().map(e => `Rollback: ${e.compensate}`);\n      return { status: 'SAGA_FAILED', rollbacks };\n    }\n    executed.push(s);\n  }\n  return { status: 'SAGA_SUCCESS' };\n}\n\nconst steps = [\n  { name: 'Payment', compensate: 'refund()', shouldFail: false },\n  { name: 'Inventory', compensate: 'restock()', shouldFail: true }\n];\nrunSaga(steps).then(res => console.log(JSON.stringify(res)));",
            "expectedOutput": "{\"status\":\"SAGA_FAILED\",\"rollbacks\":[\"Rollback: refund()\"]}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which compensating rollback action is executed when Inventory reservation fails after successful Payment?",
          "expectedStringOutput": "Rollback: refund()",
          "acceptableAnswers": [
            "Rollback: refund()",
            "refund()",
            "refund"
          ],
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "restock": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "Inventory failed, so only the previously completed Payment needs rollback (Rollback: refund()).",
              "recoveryPath": {
                "simplerExplanation": "Rolls back previous successful step: Rollback: refund().",
                "guidedFixPrompt": "Type Rollback: refund()"
              }
            }
          }
        }
      },
      {
        "id": "dist-d11-b2-orchestration-vs-choreography",
        "day": 11,
        "blockNumber": 2,
        "title": "Saga Architecture: Orchestration vs Event Choreography",
        "conceptBudget": {
          "primaryConcept": "Saga Orchestration vs Choreography",
          "supportingTerms": [
            "Orchestration (Central Saga Orchestrator coordinates steps with state machine; e.g. AWS Step Functions / Temporal)",
            "Choreography (Microservices publish/subscribe domain events to Kafka topics without central coordinator)",
            "Cyclic dependency hazard in Choreography"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d11-b1-saga-pattern-compensations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Saga Architecture Trade-offs",
              "boxes": [
                {
                  "label": "1. Orchestrated Saga (Temporal / Step Functions)",
                  "value": "Central state machine | Full visibility | Easy error tracking -> Production Gold Standard for complex workflows",
                  "varType": "Orchestrated",
                  "isUpdated": true
                },
                {
                  "label": "2. Choreographed Saga (Kafka Events)",
                  "value": "Decentralized event pub/sub | High decoupling | Harder to trace end-to-end status",
                  "varType": "Choreographed",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "saga_picker_demo.js",
            "initialCode": "function selectSagaPattern(stepCount, needsAuditTrail) {\n  if (stepCount >= 4 || needsAuditTrail) {\n    return 'ORCHESTRATION_SAGA (Central State Machine with Temporal/AWS Step Functions)';\n  }\n  return 'CHOREOGRAPHY_SAGA (Decentralized Kafka Event Pub/Sub)';\n}\n\nconsole.log('6-step eCommerce Checkout with Auditing:', selectSagaPattern(6, true));\nconsole.log('2-step Simple User Notification:', selectSagaPattern(2, false));",
            "expectedOutput": "6-step eCommerce Checkout with Auditing: ORCHESTRATION_SAGA (Central State Machine with Temporal/AWS Step Functions)\n2-step Simple User Notification: CHOREOGRAPHY_SAGA (Decentralized Kafka Event Pub/Sub)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When is Orchestrated Saga preferred over Choreographed Saga in enterprise microservices?",
          "options": [
            "When the business transaction spans 4+ complex microservices and requires central state tracking, explicit rollback coordination, and full audit visibility",
            "When databases do not support SQL",
            "To disable asynchronous messaging"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "Orchestration provides clear central state management and visibility for complex flows.",
              "recoveryPath": {
                "simplerExplanation": "Provides central state machine and audit visibility.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d11-b3-pivot-vs-retriable-transactions",
        "day": 11,
        "blockNumber": 3,
        "title": "Saga Step Classification: Compensable, Pivot & Retriable Transactions",
        "conceptBudget": {
          "primaryConcept": "Saga Step Taxonomy",
          "supportingTerms": [
            "Compensable Transactions (Steps that can be rolled back before Pivot)",
            "Pivot Transaction (The point of no return: once committed, the Saga MUST proceed to completion)",
            "Retriable Transactions (Steps after Pivot that are guaranteed to succeed via retries)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d11-b2-orchestration-vs-choreography",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pivot_step_demo.js",
            "initialCode": "function classifySagaStep(stepName) {\n  if (stepName === 'ChargeCard') return 'PIVOT_TRANSACTION (Point of no return)';\n  if (stepName === 'CheckInventory') return 'COMPENSABLE_TRANSACTION';\n  return 'RETRIABLE_TRANSACTION (Send email, generate PDF)';\n}\n\nconsole.log(classifySagaStep('ChargeCard'));",
            "expectedOutput": "PIVOT_TRANSACTION (Point of no return)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What classification is assigned to the `ChargeCard` step representing the point of no return in the Saga?",
          "expectedStringOutput": "PIVOT_TRANSACTION (Point of no return)",
          "acceptableAnswers": [
            "PIVOT_TRANSACTION (Point of no return)",
            "PIVOT_TRANSACTION",
            "Pivot transaction"
          ],
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "COMPENSABLE": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "The irreversible step is classified as PIVOT_TRANSACTION (Point of no return).",
              "recoveryPath": {
                "simplerExplanation": "It is the PIVOT_TRANSACTION (Point of no return).",
                "guidedFixPrompt": "Type PIVOT_TRANSACTION (Point of no return)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing",
    "overviewMetaphor": "Kafka Partitions are multiple checkout lines at a massive wholesale store: a single checkout cashier (Single Queue) caps store throughput at 50 customers per hour; dividing the store into 12 Partitioned checkout lanes allows 12 cashiers (Consumer Group) to process 600 customers per hour in parallel; all purchases for Customer #42 always route to Lane 6 (Partition Key hashing) to guarantee strict chronological order.",
    "blocks": [
      {
        "id": "dist-d12-b1-kafka-commit-log-architecture",
        "day": 12,
        "blockNumber": 1,
        "title": "Kafka Commit Log: Topics, Partitions & Monotonic Offsets",
        "conceptBudget": {
          "primaryConcept": "Kafka Commit Log Architecture",
          "supportingTerms": [
            "Append-only sequential disk log (Sequential I/O at 600 MB/s)",
            "Partition Offsets ($0, 1, 2, \\dots, N$)",
            "Zero-Copy data transfer via OS page cache (`sendfile`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d9-b1-raft-log-entry-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Kafka Partition Message Envelope",
            "codeSnippet": "const kafkaRecord = {\n  topic: 'orders.v1',\n  partition: 2,\n  offset: 104289n,\n  key: 'user_9981',\n  value: Buffer.from(JSON.stringify({ amount: 49.99 })),\n  timestamp: 1704067200000\n};",
            "lineNotes": {
              "3": "Partition 2 contains ordered stream for keys hashing to 2.",
              "4": "Monotonic offset uniquely identifies message within partition."
            }
          },
          {
            "type": "runnable_code",
            "filename": "partition_hash_demo.js",
            "initialCode": "function calculatePartition(key, totalPartitions = 6) {\n  let hash = 0;\n  for (let i = 0; i < key.length; i++) hash = (Math.imul(31, hash) + key.charCodeAt(i)) | 0;\n  const partition = Math.abs(hash) % totalPartitions;\n  return { key, partition, totalPartitions };\n}\n\nconsole.log(JSON.stringify(calculatePartition('order_cust_101', 6)));\nconsole.log(JSON.stringify(calculatePartition('order_cust_101', 6))); // Deterministic same partition!",
            "expectedOutput": "{\"key\":\"order_cust_101\",\"partition\":4,\"totalPartitions\":6}\n{\"key\":\"order_cust_101\",\"partition\":4,\"totalPartitions\":6}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does Kafka guarantee strict message ordering ONLY within a single partition, rather than across the entire topic?",
          "options": [
            "To allow separate partitions to be read concurrently by different consumer threads in parallel without global locking, preserving total throughput while guaranteeing FIFO ordering for all records sharing the same Partition Key",
            "Because Kafka cannot sort numbers across partitions",
            "Because partitions are deleted after reading"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
              "errorExplanation": "Partition-level ordering enables massive horizontal scaling without global locking.",
              "recoveryPath": {
                "simplerExplanation": "Enables parallel scaling while keeping same-key events ordered.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d12-b2-consumer-group-rebalancing",
        "day": 12,
        "blockNumber": 2,
        "title": "Consumer Groups & Partition Rebalancing (Eager vs Cooperative Sticky)",
        "conceptBudget": {
          "primaryConcept": "Consumer Group Rebalancing",
          "supportingTerms": [
            "Consumer Group ($G_1$ sharing work)",
            "Max Active Consumers = Number of Partitions (Excess consumers sit idle)",
            "Cooperative Sticky Assignor (Incremental rebalance without stop-the-world pauses)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d12-b1-kafka-commit-log-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Partition Allocation Rules",
              "boxes": [
                {
                  "label": "Scenario A: 4 Partitions, 2 Consumers",
                  "value": "Consumer 1: P0, P1 | Consumer 2: P2, P3 -> Balanced 50/50 load",
                  "varType": "Optimal",
                  "isUpdated": false
                },
                {
                  "label": "Scenario B: 4 Partitions, 4 Consumers",
                  "value": "1 Partition per Consumer -> Maximum parallelism",
                  "varType": "Max Throughput",
                  "isUpdated": true
                },
                {
                  "label": "Scenario C: 4 Partitions, 6 Consumers",
                  "value": "4 Active Consumers | 2 IDLE Consumers (Waste of instances!)",
                  "varType": "Idle Waste",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "consumer_allocation_demo.js",
            "initialCode": "function evaluateConsumerScaling(numPartitions, numConsumers) {\n  const activeConsumers = Math.min(numPartitions, numConsumers);\n  const idleConsumers = Math.max(0, numConsumers - numPartitions);\n  return {\n    numPartitions,\n    numConsumers,\n    activeConsumers,\n    idleConsumers,\n    warning: idleConsumers > 0 ? 'EXCESS_IDLE_CONSUMERS_DETECTED' : 'OPTIMAL_ALLOCATION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateConsumerScaling(4, 6)));",
            "expectedOutput": "{\"numPartitions\":4,\"numConsumers\":6,\"activeConsumers\":4,\"idleConsumers\":2,\"warning\":\"EXCESS_IDLE_CONSUMERS_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many consumers sit idle in a consumer group with 6 instances subscribed to a topic with only 4 partitions?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "idleConsumers\":2",
            "2 idle consumers"
          ],
          "primaryMisconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
              "errorExplanation": "Kafka assigns at most 1 consumer per partition. 6 - 4 = 2 idle consumers.",
              "recoveryPath": {
                "simplerExplanation": "6 consumers on 4 partitions = 2 idle consumers.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dist-d12-b3-offset-commit-semantics-lag",
        "day": 12,
        "blockNumber": 3,
        "title": "Consumer Lag Monitoring & Offset Commit Timing",
        "conceptBudget": {
          "primaryConcept": "Consumer Lag Management",
          "supportingTerms": [
            "Consumer Lag = $\\text{LogEndOffset} - \\text{CurrentConsumerOffset}$",
            "Auto-Commit (`enable.auto.commit=true`: risk of message loss on crash)",
            "Manual Offset Commit after business logic completes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d12-b2-consumer-group-rebalancing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "consumer_lag_demo.js",
            "initialCode": "function calculateConsumerLag(logEndOffset, currentOffset) {\n  const lag = logEndOffset - currentOffset;\n  return {\n    logEndOffset,\n    currentOffset,\n    consumerLagMessages: lag,\n    healthStatus: lag > 5000 ? 'CONSUMER_FALLING_BEHIND_ALERT' : 'CONSUMER_HEALTHY'\n  };\n}\n\nconsole.log(JSON.stringify(calculateConsumerLag(100000, 99950)));\nconsole.log(JSON.stringify(calculateConsumerLag(100000, 92000)));",
            "expectedOutput": "{\"logEndOffset\":100000,\"currentOffset\":99950,\"consumerLagMessages\":50,\"healthStatus\":\"CONSUMER_HEALTHY\"}\n{\"logEndOffset\":100000,\"currentOffset\":92000,\"consumerLagMessages\":8000,\"healthStatus\":\"CONSUMER_FALLING_BEHIND_ALERT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should mission-critical financial consumers disable auto-commit (`enable.auto.commit=false`) and commit offsets manually after processing?",
          "options": [
            "Because auto-commit marks messages as processed on a fixed timer; if the consumer process crashes while processing a batch, uncompleted messages will be permanently skipped and lost",
            "Because auto-commit causes hard drive corruption",
            "Because manual commits make consumers run faster"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_EVENT_DRIVEN_KAFKA_PARTITIONS_CONSUMER_GROUPS",
              "errorExplanation": "Manual offset commits prevent message loss during mid-batch consumer crashes.",
              "recoveryPath": {
                "simplerExplanation": "Committing offsets manually prevents data loss on worker crash.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency",
    "overviewMetaphor": "Message Delivery Guarantees are delivery services with different contracts: At-Most-Once is tossing a package over the garden fence without stopping: if a dog steals it, it is gone forever (Zero duplicates, high loss); At-Least-Once is ringing the doorbell until a human answers: if the human doesn't hear the ring, the driver delivers a 2nd identical box (Guaranteed delivery, risk of duplicate boxes); Exactly-Once combines At-Least-Once with a Unique Barcode Scanner (Idempotency Key) so the customer instantly rejects the 2nd duplicate box.",
    "blocks": [
      {
        "id": "dist-d13-b1-delivery-semantics-triad",
        "day": 13,
        "blockNumber": 1,
        "title": "The Delivery Semantics Triad: At-Most-Once, At-Least-Once & Exactly-Once",
        "conceptBudget": {
          "primaryConcept": "Message Delivery Semantics",
          "supportingTerms": [
            "At-Most-Once (Commit offset before processing: zero duplicates, data loss on crash)",
            "At-Least-Once (Commit offset after processing: zero data loss, duplicate messages on retry)",
            "Effectively Exactly-Once (At-Least-Once delivery + Idempotent consumer deduplication)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d12-b3-offset-commit-semantics-lag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Message Delivery Guarantees Matrix",
              "boxes": [
                {
                  "label": "1. At-Most-Once",
                  "value": "Risk: Lost messages | Duplicate Risk: 0% -> Suitable for metric metrics, IoT sensors",
                  "varType": "Fire and Forget",
                  "isUpdated": false
                },
                {
                  "label": "2. At-Least-Once",
                  "value": "Risk: Zero loss | Duplicate Risk: High -> Standard distributed messaging protocol",
                  "varType": "Standard Delivery",
                  "isUpdated": false
                },
                {
                  "label": "3. Exactly-Once (Idempotent)",
                  "value": "Risk: Zero loss | Duplicate Risk: 0% -> Required for payments and banking",
                  "varType": "Gold Standard",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "delivery_guarantee_demo.js",
            "initialCode": "function evaluateDeliveryMode(mode) {\n  if (mode === 'AT_MOST_ONCE') return { dataLossPossible: true, duplicatesPossible: false };\n  if (mode === 'AT_LEAST_ONCE') return { dataLossPossible: false, duplicatesPossible: true };\n  return { dataLossPossible: false, duplicatesPossible: false, requiresIdempotencyStore: true };\n}\n\nconsole.log('At-Least-Once:', JSON.stringify(evaluateDeliveryMode('AT_LEAST_ONCE')));\nconsole.log('Exactly-Once:', JSON.stringify(evaluateDeliveryMode('EXACTLY_ONCE')));",
            "expectedOutput": "At-Least-Once: {\"dataLossPossible\":false,\"duplicatesPossible\":true}\nExactly-Once: {\"dataLossPossible\":false,\"duplicatesPossible\":false,\"requiresIdempotencyStore\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How is 'Effectively Exactly-Once' processing achieved in real-world distributed architectures?",
          "options": [
            "By combining At-Least-Once transport delivery with an Idempotent Consumer pattern that deduplicates incoming message IDs using atomic database transactions or Redis key stores",
            "By replacing network cables with fiber lasers",
            "By disabling message queues"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
              "errorExplanation": "Exactly-once is achieved at the application level via at-least-once transport + idempotent deduplication.",
              "recoveryPath": {
                "simplerExplanation": "Achieved via At-Least-Once transport + Idempotency deduplication.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d13-b2-transactional-outbox-pattern",
        "day": 13,
        "blockNumber": 2,
        "title": "The Transactional Outbox Pattern: Atomic DB Write + Message Publish",
        "conceptBudget": {
          "primaryConcept": "Transactional Outbox Pattern",
          "supportingTerms": [
            "Dual-Write Problem (Updating DB and publishing Kafka message in 2 non-atomic steps causes divergence)",
            "Outbox Table inside application DB",
            "Change Data Capture (CDC / Debezium) streaming outbox rows to Kafka"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d13-b1-delivery-semantics-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Transactional Outbox SQL Schema",
            "codeSnippet": "BEGIN TRANSACTION;\n  INSERT INTO orders (id, user_id, amount) VALUES ('ord_101', 'usr_5', 100.00);\n  INSERT INTO outbox_events (id, aggregate_type, payload, status) \n  VALUES ('evt_101', 'ORDER', '{\"order_id\": \"ord_101\"}', 'PENDING');\nCOMMIT; // Atomically commits business data AND event message together!",
            "lineNotes": {
              "2": "Inserts business record.",
              "3": "Inserts event record inside same ACID transaction.",
              "5": "Zero chance of publishing event if DB insert rolls back."
            }
          },
          {
            "type": "runnable_code",
            "filename": "outbox_demo.js",
            "initialCode": "function executeAtomicOutboxInsert(orderId, amount) {\n  return {\n    databaseTx: 'COMMITTED',\n    tablesUpdated: ['orders', 'outbox_events'],\n    dualWriteGuaranteed: true\n  };\n}\n\nconsole.log(JSON.stringify(executeAtomicOutboxInsert('ord_101', 100.00)));",
            "expectedOutput": "{\"databaseTx\":\"COMMITTED\",\"tablesUpdated\":[\"orders\",\"outbox_events\"],\"dualWriteGuaranteed\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Transactional Outbox pattern solve the distributed Dual-Write hazard?",
          "options": [
            "It saves both the business record and the outgoing event into the same database within a single local ACID transaction, allowing an asynchronous CDC poller (like Debezium) to publish the event to Kafka with zero dual-write failure risk",
            "It forces Kafka to manage database connections",
            "It disables database rollbacks"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
              "errorExplanation": "Transactional outbox ensures events and data persist atomically in the local DB.",
              "recoveryPath": {
                "simplerExplanation": "Persists data and event in 1 local ACID transaction.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d13-b3-idempotent-producer-kafka-seq",
        "day": 13,
        "blockNumber": 3,
        "title": "Kafka Idempotent Producer: Producer ID (PID) & Sequence Numbers",
        "conceptBudget": {
          "primaryConcept": "Kafka Idempotent Producer",
          "supportingTerms": [
            "`enable.idempotence=true`",
            "Producer ID (PID) and Monotonically incrementing Sequence Numbers",
            "Broker deduplicates retry messages automatically without application code"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d13-b2-transactional-outbox-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kafka_pid_demo.js",
            "initialCode": "function evaluateBrokerDeduplication(producerId, seqNumber, lastSeenSeq) {\n  if (seqNumber <= lastSeenSeq) {\n    return { duplicate: true, action: 'DROP_DUPLICATE_SEND_ACK_TO_PRODUCER' };\n  }\n  return { duplicate: false, action: 'APPEND_TO_LOG' };\n}\n\nconsole.log('Sequence 5 after Sequence 4:', evaluateBrokerDeduplication('pid_1', 5, 4).action);\nconsole.log('Duplicate Retry Sequence 5:', evaluateBrokerDeduplication('pid_1', 5, 5).action);",
            "expectedOutput": "Sequence 5 after Sequence 4: APPEND_TO_LOG\nDuplicate Retry Sequence 5: DROP_DUPLICATE_SEND_ACK_TO_PRODUCER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the Kafka broker when receiving a duplicate message retry with Sequence 5 when Sequence 5 was already appended?",
          "expectedStringOutput": "DROP_DUPLICATE_SEND_ACK_TO_PRODUCER",
          "acceptableAnswers": [
            "DROP_DUPLICATE_SEND_ACK_TO_PRODUCER",
            "Duplicate Retry Sequence 5: DROP_DUPLICATE_SEND_ACK_TO_PRODUCER",
            "Drop duplicate"
          ],
          "primaryMisconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
          "diagnosisMap": {
            "APPEND": {
              "misconceptionId": "MC_DIST_MESSAGE_DELIVERY_EXACTLY_ONCE_IDEMPOTENCY",
              "errorExplanation": "Duplicate sequence numbers are discarded by the broker (DROP_DUPLICATE_SEND_ACK_TO_PRODUCER).",
              "recoveryPath": {
                "simplerExplanation": "Broker discards duplicate: DROP_DUPLICATE_SEND_ACK_TO_PRODUCER.",
                "guidedFixPrompt": "Type DROP_DUPLICATE_SEND_ACK_TO_PRODUCER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling",
    "overviewMetaphor": "A Dead Letter Queue (DLQ) is a hospital emergency quarantine isolation ward: when a patient with a dangerous, unknown contagion arrives (Poison Pill: a corrupt JSON message that crashes the parser every single time), the main clinic does not shut down and let all other patients wait in the rain; after 3 failed triage attempts, the dangerous patient is moved to the Quarantine Ward (DLQ) so normal patients keep flowing smoothly.",
    "blocks": [
      {
        "id": "dist-d14-b1-poison-pill-hazard",
        "day": 14,
        "blockNumber": 1,
        "title": "The Poison Pill Dilemma & Consumer Pipeline Stalls",
        "conceptBudget": {
          "primaryConcept": "Poison Pill Isolation",
          "supportingTerms": [
            "Poison Pill message (Malformed payload causing unhandled exception and crash loop)",
            "Consumer Crash Loop (Re-fetching same corrupt message on restart forever)",
            "Dead Letter Queue (DLQ) isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d13-b1-delivery-semantics-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Consumer Crash Loop vs DLQ Isolation Diff",
              "brokenCode": "// ❌ NAIVE RETRY (Infinite Crash Loop):\n1. Consumer reads malformed message #42 -> JSON.parse() crashes with SyntaxError\n2. Consumer restarts -> re-reads offset #42 -> CRASHES AGAIN\n3. Entire queue processing is blocked for all other 100,000 customers!",
              "fixedCode": "// ✅ DEAD LETTER QUEUE (DLQ) ISOLATION:\n1. Consumer tries parsing message #42 -> Fails (Retry 1)\n2. After 3 failed attempts, route message #42 into 'orders.DLQ' topic\n3. Commit offset #42 and immediately proceed to message #43! (Zero downtime)",
              "errorLine": 2,
              "errorReason": "Failing to isolate poison pills permanently blocks queue consumer progress.",
              "fixExplanation": "Route unprocessable messages to a DLQ after max retry limit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dlq_route_demo.js",
            "initialCode": "function evaluateMessageAction(retryCount, maxRetries = 3) {\n  if (retryCount >= maxRetries) return 'ROUTE_TO_DLQ_AND_ADVANCE_OFFSET';\n  return `RETRY_WITH_BACKOFF (Attempt ${retryCount + 1} of ${maxRetries})`;\n}\n\nconsole.log('Retry 1 of 3:', evaluateMessageAction(1, 3));\nconsole.log('Retry 3 of 3:', evaluateMessageAction(3, 3));",
            "expectedOutput": "Retry 1 of 3: RETRY_WITH_BACKOFF (Attempt 2 of 3)\nRetry 3 of 3: ROUTE_TO_DLQ_AND_ADVANCE_OFFSET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken when an unprocessable message reaches its 3rd failed retry attempt?",
          "expectedStringOutput": "ROUTE_TO_DLQ_AND_ADVANCE_OFFSET",
          "acceptableAnswers": [
            "ROUTE_TO_DLQ_AND_ADVANCE_OFFSET",
            "Retry 3 of 3: ROUTE_TO_DLQ_AND_ADVANCE_OFFSET",
            "Route to DLQ"
          ],
          "primaryMisconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
          "diagnosisMap": {
            "RETRY": {
              "misconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
              "errorExplanation": "Max retries (3) triggers ROUTE_TO_DLQ_AND_ADVANCE_OFFSET.",
              "recoveryPath": {
                "simplerExplanation": "Exceeding retries routes to DLQ: ROUTE_TO_DLQ_AND_ADVANCE_OFFSET.",
                "guidedFixPrompt": "Type ROUTE_TO_DLQ_AND_ADVANCE_OFFSET"
              }
            }
          }
        }
      },
      {
        "id": "dist-d14-b2-dlq-redrive-reprocessing",
        "day": 14,
        "blockNumber": 2,
        "title": "DLQ Redrive Policies & Automated Bug-Fix Re-injection",
        "conceptBudget": {
          "primaryConcept": "DLQ Redrive Architecture",
          "supportingTerms": [
            "DLQ Redrive Policy (Reprocessing quarantined messages after bug fix release)",
            "DLQ Depth Metric Alarms (PagerDuty alert on `dlq_count > 10`)",
            "Preserving original headers and error traces"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d14-b1-poison-pill-hazard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dlq_redrive_demo.js",
            "initialCode": "function redriveDlq(dlqMessages, targetTopic) {\n  return dlqMessages.map(m => ({\n    topic: targetTopic,\n    payload: m.payload,\n    redriveCount: (m.redriveCount || 0) + 1,\n    status: 'RE_INJECTED_TO_MAIN_PIPELINE'\n  }));\n}\n\nconst quarantined = [{ payload: { orderId: 99 }, redriveCount: 0 }];\nconsole.log(JSON.stringify(redriveDlq(quarantined, 'orders.v1')));",
            "expectedOutput": "[{\"topic\":\"orders.v1\",\"payload\":{\"orderId\":99},\"redriveCount\":1,\"status\":\"RE_INJECTED_TO_MAIN_PIPELINE\"}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does a DLQ Redrive Policy allow engineering teams to recover from production microservice bugs with zero data loss?",
          "options": [
            "Once the bug is patched and deployed, engineers trigger a redrive job that reads failed messages from the DLQ topic and re-injects them back into the main pipeline for successful processing",
            "By deleting the DLQ database",
            "By resetting all customer passwords"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
              "errorExplanation": "DLQ redrive re-injects failed messages back into production once the bug is resolved.",
              "recoveryPath": {
                "simplerExplanation": "Re-injects failed messages into the pipeline after code fix.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d14-b3-dlq-header-metadata-enrichment",
        "day": 14,
        "blockNumber": 3,
        "title": "DLQ Header Metadata: Capturing Stack Traces & Origin Pods",
        "conceptBudget": {
          "primaryConcept": "DLQ Metadata Enrichment",
          "supportingTerms": [
            "Attaching error headers (`x-death-reason`, `x-failed-at`, `x-origin-pod`)",
            "Facilitating instant root cause analysis in Datadog/Kibana"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d14-b2-dlq-redrive-reprocessing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dlq_enrich_demo.js",
            "initialCode": "function enrichDlqMessage(msg, error, podName = 'order-worker-7f9') {\n  return {\n    originalPayload: msg,\n    dlqHeaders: {\n      'x-death-reason': error.message,\n      'x-death-pod': podName,\n      'x-death-time': new Date().toISOString()\n    }\n  };\n}\n\nconsole.log(JSON.stringify(enrichDlqMessage({ id: 'ord_1' }, new Error('DB_TIMEOUT'))));",
            "expectedOutput": "{\"originalPayload\":{\"id\":\"ord_1\"},\"dlqHeaders\":{\"x-death-reason\":\"DB_TIMEOUT\",\"x-death-pod\":\"order-worker-7f9\",\"x-death-time\":\"2026-08-24T17:28:00.000Z\"}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What header key captures the root failure reason in the enriched DLQ message envelope?",
          "expectedStringOutput": "x-death-reason",
          "acceptableAnswers": [
            "x-death-reason",
            "x-death-reason: DB_TIMEOUT"
          ],
          "primaryMisconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
          "diagnosisMap": {
            "error": {
              "misconceptionId": "MC_DIST_DEAD_LETTER_QUEUES_POISON_PILL_RETRY_BACKOFF",
              "errorExplanation": "The standardized header is x-death-reason.",
              "recoveryPath": {
                "simplerExplanation": "Header key is x-death-reason.",
                "guidedFixPrompt": "Type x-death-reason"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete industrial-grade event transaction engine: 1. Kafka Event arrives at consumer; 2. Idempotency Key checks Redis for previous executions (Drops duplicates); 3. Saga Orchestrator steps through Payment -> Inventory -> Shipping; 4. If Shipping fails, backward compensating rollbacks execute in reverse order; 5. Unrecoverable poison pill events route cleanly to the DLQ; 6. 100% data consistency guaranteed across all microservices.",
    "blocks": [
      {
        "id": "dist-d15-b1-event-engine-architecture",
        "day": 15,
        "blockNumber": 1,
        "title": "Event-Driven Transaction Engine Architectural Flow",
        "conceptBudget": {
          "primaryConcept": "Event-Driven Engine Architecture",
          "supportingTerms": [
            "Kafka Consumer Group",
            "Idempotency Store (Redis)",
            "Saga Orchestrator",
            "Dead Letter Queue"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d14-b1-poison-pill-hazard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Complete Event-Driven Transaction Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Kafka Event Received -> Check Idempotency Key in Redis",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "New Event -> Saga Orchestrator executes Step 1 (Payment) & Step 2 (Inventory)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Step 3 Fails -> Orchestrator triggers Backward Compensating Rollbacks!",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Event committed & recorded in DLQ -> Advances Kafka offset cleanly! (100% Resilient)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "event_engine_sim.js",
            "initialCode": "async function runEventEngine(event) {\n  return {\n    eventKey: event.idempotencyKey,\n    idempotencyStatus: 'DEDUPLICATION_PASS',\n    sagaExecuted: true,\n    compensationsTriggeredOnFailure: true,\n    status: 'EVENT_TRANSACTION_ENGINE_HEALTHY'\n  };\n}\n\nrunEventEngine({ idempotencyKey: 'tx_9981' }).then(res => {\n  console.log('Engine Status:', res.status);\n});",
            "expectedOutput": "Engine Status: EVENT_TRANSACTION_ENGINE_HEALTHY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the operational status of the event transaction engine?",
          "expectedStringOutput": "EVENT_TRANSACTION_ENGINE_HEALTHY",
          "acceptableAnswers": [
            "EVENT_TRANSACTION_ENGINE_HEALTHY",
            "Engine Status: EVENT_TRANSACTION_ENGINE_HEALTHY"
          ],
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "The engine initializes with EVENT_TRANSACTION_ENGINE_HEALTHY.",
              "recoveryPath": {
                "simplerExplanation": "Matches EVENT_TRANSACTION_ENGINE_HEALTHY.",
                "guidedFixPrompt": "Type EVENT_TRANSACTION_ENGINE_HEALTHY"
              }
            }
          }
        }
      },
      {
        "id": "dist-d15-b2-throughput-backpressure-metrics",
        "day": 15,
        "blockNumber": 2,
        "title": "Throughput, Backpressure & Consumer SLA Metrics",
        "conceptBudget": {
          "primaryConcept": "Engine Throughput Metrics",
          "supportingTerms": [
            "Target Throughput: 50,000 events/sec",
            "P99 Processing Latency: < 25ms",
            "Zero Poison Pill Deadlocks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d15-b1-event-engine-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "engine_sla_demo.js",
            "initialCode": "function auditEnginePerformance(eventsPerSec, p99Ms, dlqRate) {\n  const passed = eventsPerSec >= 50000 && p99Ms <= 25 && dlqRate < 0.1;\n  return {\n    eventsPerSec,\n    p99Ms,\n    passed,\n    grade: passed ? 'ENTERPRISE_EVENT_ENGINE_CERTIFIED' : 'SLA_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(auditEnginePerformance(65000, 18, 0.02)));",
            "expectedOutput": "{\"eventsPerSec\":65000,\"p99Ms\":18,\"passed\":true,\"grade\":\"ENTERPRISE_EVENT_ENGINE_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded to the event transaction engine meeting all throughput and latency SLAs?",
          "expectedStringOutput": "ENTERPRISE_EVENT_ENGINE_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_EVENT_ENGINE_CERTIFIED",
            "grade\":\"ENTERPRISE_EVENT_ENGINE_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "All metrics exceed targets, qualifying for ENTERPRISE_EVENT_ENGINE_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_EVENT_ENGINE_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_EVENT_ENGINE_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "dist-d15-b3-milestone2-dist-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Resilient Event-Driven Transaction Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Resilient Event Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d15-b2-throughput-backpressure-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_dist_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_SAGA_PATTERN_COMPENSATING_TRANSACTIONS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks",
    "overviewMetaphor": "Distributed Time is three wristwatch owners in different time zones without atomic clocks: Person A's watch runs 2 seconds fast; Person B's watch runs 3 seconds slow (NTP Clock Drift); if Person A says \"I sent my message at 12:00:02\" and Person B says \"I replied at 12:00:01\", physical time claims the reply happened before the question (Paradox!); Vector Clocks ignore wall clocks and track logical causality: every time you speak, you increment your own counter (`[A:1, B:0]`), guaranteeing true causal ordering.",
    "blocks": [
      {
        "id": "dist-d16-b1-ntp-drift-and-spanner-true-time",
        "day": 16,
        "blockNumber": 1,
        "title": "Physical Clock Drift, NTP Synchronization & Google Spanner TrueTime",
        "conceptBudget": {
          "primaryConcept": "Physical Clock Drift & TrueTime",
          "supportingTerms": [
            "NTP Clock Drift ($pm 100\\text{ms}$ over internet)",
            "Risk of Silent Data Overwrites in Last-Write-Wins (LWW)",
            "Google Spanner TrueTime API: $[t.\\text{earliest}, t.\\text{latest}]$ with GPS and Atomic Clocks $\\epsilon \\le 7\\text{ms}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Physical Clock Accuracy vs Atomic TrueTime",
              "boxes": [
                {
                  "label": "1. Standard NTP Clock",
                  "value": "Uncertainty Window: $\\pm 50\\text{ms}$ to $200\\text{ms}$ -> Unsafe for linearizable transaction ordering",
                  "varType": "High Drift",
                  "isUpdated": false
                },
                {
                  "label": "2. Google TrueTime (Spanner)",
                  "value": "Uncertainty Window: $\\pm 7\\text{ms}$ (Atomic Clocks + GPS) -> Enables global external consistency",
                  "varType": "Atomic Precision",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "truetime_sim_demo.js",
            "initialCode": "function evaluateTrueTimeWait(earliestMs, latestMs) {\n  const uncertainty = latestMs - earliestMs;\n  return {\n    uncertaintyWindowMs: uncertainty,\n    waitRequiredBeforeCommit: `${uncertainty} ms (Guarantees strict global ordering)`\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTrueTimeWait(1000, 1007)));",
            "expectedOutput": "{\"uncertaintyWindowMs\":7,\"waitRequiredBeforeCommit\":\"7 ms (Guarantees strict global ordering)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why cannot standard operating system physical wall clocks (like `Date.now()`) be trusted for global database transaction ordering across distributed servers?",
          "options": [
            "Because physical quartz crystal clocks drift continuously due to temperature fluctuations, and NTP network adjustments can jump the clock backward or forward unpredictably by hundreds of milliseconds",
            "Because computer clocks stop ticking at midnight",
            "Because CPU registers cannot store timestamps"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
              "errorExplanation": "Physical drift and NTP jumps make wall clocks unsafe for deterministic global ordering.",
              "recoveryPath": {
                "simplerExplanation": "Physical clocks drift and jump, causing incorrect orderings.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d16-b2-lamport-logical-timestamps",
        "day": 16,
        "blockNumber": 2,
        "title": "Lamport Timestamps: Logical Clocks & Total Ordering",
        "conceptBudget": {
          "primaryConcept": "Lamport Logical Timestamps",
          "supportingTerms": [
            "Leslie Lamport (1978) Logical Clocks",
            "Clock Advance Rule: $L_i = \\max(L_i, L_{\\text{received}}) + 1$",
            "Total Ordering with Node ID tie-breaking: $(L_i, i)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d16-b1-ntp-drift-and-spanner-true-time",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Lamport Timestamp Advance Rule",
            "codeSnippet": "function onMessageReceived(localClock, messageClock) {\n  localClock = Math.max(localClock, messageClock) + 1;\n  return localClock;\n}",
            "lineNotes": {
              "2": "Guarantees causal happens-before relationship: received events always get a strictly higher clock value than sender."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lamport_demo.js",
            "initialCode": "function processLamportEvent(localTime, incomingTime) {\n  const updated = Math.max(localTime, incomingTime || 0) + 1;\n  return updated;\n}\n\nlet n1 = 0, n2 = 0;\nn1 = processLamportEvent(n1, null); // Local event on N1 -> 1\nn2 = processLamportEvent(n2, n1);   // N2 receives message from N1 -> max(0, 1) + 1 = 2\nconsole.log('N1 Clock:', n1);\nconsole.log('N2 Clock after receive:', n2);",
            "expectedOutput": "N1 Clock: 1\nN2 Clock after receive: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Node 2's Lamport clock value after receiving a message timestamped 1 from Node 1 (when Node 2's local clock was 0)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "N2 Clock after receive: 2"
          ],
          "primaryMisconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
              "errorExplanation": "max(0, 1) + 1 = 2.",
              "recoveryPath": {
                "simplerExplanation": "max(0, 1) + 1 = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dist-d16-b3-vector-clocks-concurrent-conflicts",
        "day": 16,
        "blockNumber": 3,
        "title": "Vector Clocks: Detecting Concurrent Conflicts in Dynamo-Style Stores",
        "conceptBudget": {
          "primaryConcept": "Vector Clocks & Causality",
          "supportingTerms": [
            "Vector array $V = [v_1, v_2, \\dots, v_n]$",
            "Causality comparison: $V_A < V_B$ (A happened before B)",
            "Concurrent Conflict: $\\exists i, j \\text{ s.t. } V_A[i] > V_B[i] \\land V_A[j] < V_B[j]$ (Triggers sibling resolution)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d16-b2-lamport-logical-timestamps",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vector_clock_calc.js",
            "initialCode": "function evaluateVectorCausality(vA, vB) {\n  let aBigger = false, bBigger = false;\n  for (const k of ['N1', 'N2']) {\n    if ((vA[k] || 0) > (vB[k] || 0)) aBigger = true;\n    if ((vB[k] || 0) > (vA[k] || 0)) bBigger = true;\n  }\n  if (aBigger && !bBigger) return 'A_CAUSED_B (A happened before B)';\n  if (bBigger && !aBigger) return 'B_CAUSED_A (B happened before A)';\n  if (aBigger && bBigger) return 'CONCURRENT_CONFLICT_REQUIRES_MERGE';\n  return 'EQUAL';\n}\n\nconsole.log('v1 [N1:1, N2:0] vs v2 [N1:1, N2:1]:', evaluateVectorCausality({ N1: 1, N2: 0 }, { N1: 1, N2: 1 }));\nconsole.log('v1 [N1:2, N2:0] vs v2 [N1:1, N2:1]:', evaluateVectorCausality({ N1: 2, N2: 0 }, { N1: 1, N2: 1 }));",
            "expectedOutput": "v1 [N1:1, N2:0] vs v2 [N1:1, N2:1]: B_CAUSED_A (B happened before A)\nv1 [N1:2, N2:0] vs v2 [N1:1, N2:1]: CONCURRENT_CONFLICT_REQUIRES_MERGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What causality status is returned when comparing Vector A `[N1:2, N2:0]` with Vector B `[N1:1, N2:1]`?",
          "expectedStringOutput": "CONCURRENT_CONFLICT_REQUIRES_MERGE",
          "acceptableAnswers": [
            "CONCURRENT_CONFLICT_REQUIRES_MERGE",
            "v1 [N1:2, N2:0] vs v2 [N1:1, N2:1]: CONCURRENT_CONFLICT_REQUIRES_MERGE",
            "Concurrent conflict"
          ],
          "primaryMisconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
          "diagnosisMap": {
            "A_CAUSED_B": {
              "misconceptionId": "MC_DIST_VECTOR_CLOCKS_LAMPORT_TIMESTAMPS_CAUSALITY",
              "errorExplanation": "Neither vector dominates on all nodes, flagging a CONCURRENT_CONFLICT_REQUIRES_MERGE.",
              "recoveryPath": {
                "simplerExplanation": "Both nodes have higher numbers in different slots -> CONCURRENT_CONFLICT_REQUIRES_MERGE.",
                "guidedFixPrompt": "Type CONCURRENT_CONFLICT_REQUIRES_MERGE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set",
    "overviewMetaphor": "A CRDT is a group of friends working on an offline Google Doc on airplanes: Person A writes paragraph 3; Person B deletes paragraph 1; instead of a central server rejecting changes with merge conflicts (\"Cannot save file\"), CRDTs (Conflict-Free Replicated Data Types) use mathematical lattices (Commutative, Associative, Idempotent operations) so when all airplanes land and reconnect to Wi-Fi, their documents automatically merge into the exact same final text without human intervention.",
    "blocks": [
      {
        "id": "dist-d17-b1-crdt-mathematical-properties",
        "day": 17,
        "blockNumber": 1,
        "title": "CRDT Foundations: Commutative, Associative & Idempotent Semi-Lattices",
        "conceptBudget": {
          "primaryConcept": "CRDT Semi-Lattice Mathematics",
          "supportingTerms": [
            "Marc Shapiro et al. CRDTs",
            "Commutativity ($A \\star B = B \\star A$)",
            "Associativity ($(A \\star B) \\star C = A \\star (B \\star C)$)",
            "Idempotence ($A \\star A = A$)",
            "Guaranteed Strong Eventual Consistency (SEC)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d16-b3-vector-clocks-concurrent-conflicts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CRDT Convergence Properties",
              "boxes": [
                {
                  "label": "Commutative ($A \\star B = B \\star A$)",
                  "value": "Messages arrive out of order? -> Result is 100% identical",
                  "varType": "Order Independent",
                  "isUpdated": false
                },
                {
                  "label": "Idempotent ($A \\star A = A$)",
                  "value": "Network duplicates the message 5 times? -> Result never overcounts",
                  "varType": "Duplicate Proof",
                  "isUpdated": false
                },
                {
                  "label": "Strong Eventual Consistency",
                  "value": "Any two nodes that receive the same updates converge to the exact same state",
                  "varType": "Guaranteed Convergence",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "g_counter_demo.js",
            "initialCode": "class GCounter {\n  constructor(nodeId) { this.nodeId = nodeId; this.state = {}; }\n  inc(v = 1) { this.state[this.nodeId] = (this.state[this.nodeId] || 0) + v; }\n  value() { return Object.values(this.state).reduce((a, b) => a + b, 0); }\n  merge(other) {\n    const keys = new Set([...Object.keys(this.state), ...Object.keys(other.state)]);\n    keys.forEach(k => this.state[k] = Math.max(this.state[k] || 0, other.state[k] || 0));\n  }\n}\n\nconst a = new GCounter('A'), b = new GCounter('B');\na.inc(5);\nb.inc(3);\na.merge(b);\nb.merge(a);\nconsole.log('Node A Value:', a.value());\nconsole.log('Node B Value:', b.value());",
            "expectedOutput": "Node A Value: 8\nNode B Value: 8",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the converged value on both Node A and Node B after merging G-Counters (5 + 3)?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "Node A Value: 8",
            "Node B Value: 8"
          ],
          "primaryMisconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
              "errorExplanation": "The pairwise max merge sums all node increments: 5 + 3 = 8.",
              "recoveryPath": {
                "simplerExplanation": "5 + 3 = 8.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "dist-d17-b2-pn-counter-increments-decrements",
        "day": 17,
        "blockNumber": 2,
        "title": "PN-Counter: Supporting Both Increments & Decrements",
        "conceptBudget": {
          "primaryConcept": "PN-Counter CRDT",
          "supportingTerms": [
            "Positive G-Counter ($P$) for additions",
            "Negative G-Counter ($N$) for subtractions",
            "Total Value: $\\sum P - \\sum N$",
            "Pairwise Max merging on both $P$ and $N$ maps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d17-b1-crdt-mathematical-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PN-Counter Merge Equation",
            "codeSnippet": "this.P[node] = Math.max(this.P[node], other.P[node]);\nthis.N[node] = Math.max(this.N[node], other.N[node]);\nconst finalValue = sum(this.P) - sum(this.N);",
            "lineNotes": {
              "1": "Merges positive increment lattice.",
              "2": "Merges negative decrement lattice.",
              "3": "Calculates net balance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pn_counter_demo.js",
            "initialCode": "function evaluatePnConvergence(pA, nA, pB, nB) {\n  const mergedP = Math.max(pA, pB);\n  const mergedN = Math.max(nA, nB);\n  return `Net Converged Value: ${mergedP - mergedN}`;\n}\n\nconsole.log(evaluatePnConvergence(10, 2, 5, 4));",
            "expectedOutput": "Net Converged Value: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net converged value when merging Node 1 (P=10, N=2) and Node 2 (P=5, N=4): max(10,5) - max(2,4) = 10 - 4?",
          "expectedStringOutput": "Net Converged Value: 6",
          "acceptableAnswers": [
            "Net Converged Value: 6",
            "6"
          ],
          "primaryMisconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
          "diagnosisMap": {
            "9": {
              "misconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
              "errorExplanation": "max(10,5) - max(2,4) = 10 - 4 = 6.",
              "recoveryPath": {
                "simplerExplanation": "10 - 4 = 6.",
                "guidedFixPrompt": "Type Net Converged Value: 6"
              }
            }
          }
        }
      },
      {
        "id": "dist-d17-b3-lww-element-set-crdt",
        "day": 17,
        "blockNumber": 3,
        "title": "LWW-Element-Set (Last-Write-Wins Set) & Tombstones",
        "conceptBudget": {
          "primaryConcept": "LWW-Element-Set CRDT",
          "supportingTerms": [
            "Add Set with timestamps vs Remove Set (Tombstones)",
            "Membership condition: $\\text{item} \\in \\text{AddSet} \\land \\text{item.addTimestamp} > \\text{item.removeTimestamp}$",
            "Collaborative text editors (Figma, Notion, Automerge)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d17-b2-pn-counter-increments-decrements",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lww_set_demo.js",
            "initialCode": "function isElementInSet(addTs, removeTs) {\n  return addTs > removeTs ? 'ITEM_IS_ACTIVE_MEMBER' : 'ITEM_IS_DELETED_TOMBSTONE';\n}\n\nconsole.log('Added at 100, Removed at 90:', isElementInSet(100, 90));\nconsole.log('Added at 100, Removed at 110:', isElementInSet(100, 110));",
            "expectedOutput": "Added at 100, Removed at 90: ITEM_IS_ACTIVE_MEMBER\nAdded at 100, Removed at 110: ITEM_IS_DELETED_TOMBSTONE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does an LWW-Element-Set (Last-Write-Wins Set) resolve concurrent add and delete operations on the same item?",
          "options": [
            "It compares the timestamp of the addition against the timestamp of the removal tombstone; if the addition timestamp is higher, the item is present, otherwise it is considered deleted",
            "It permanently corrupts the database",
            "It asks the user to choose"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_CRDT_CONFLICT_FREE_REPLICATED_DATA_TYPES",
              "errorExplanation": "LWW resolves conflicts by comparing add and remove timestamps.",
              "recoveryPath": {
                "simplerExplanation": "Higher timestamp between add and remove wins.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Database Sharding Strategies: Range, Hash & Directory Sharding",
    "overviewMetaphor": "Database Sharding is organizing an international library with 10 million books: Range Sharding organizes by Author Last Name (A-E in Building 1, F-M in Building 2: simple range queries, but Building S burns down when Stephen King and Shakespeare get too popular!); Hash Sharding scrambles the book ISBN number through a blender (MD5 hash modulo 4: perfectly uniform book distribution, but range queries must scatter-gather across all buildings).",
    "blocks": [
      {
        "id": "dist-d18-b1-sharding-architectures-comparison",
        "day": 18,
        "blockNumber": 1,
        "title": "Sharding Architectures: Range vs Hash vs Directory-Based",
        "conceptBudget": {
          "primaryConcept": "Database Sharding Architectures",
          "supportingTerms": [
            "Range Sharding (Keys grouped by ranges; high hotspot risk on sequential keys)",
            "Hash Sharding (Uniform distribution; scatter-gather penalty for range queries)",
            "Directory Sharding (Lookup service mapping customer tenant IDs to specific shards)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d4-b1-modulo-hashing-disaster",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Database Sharding Comparison",
              "boxes": [
                {
                  "label": "1. Hash Sharding",
                  "value": "Routing: Hash(Key) % N | Hotspot Risk: Very Low | Range Queries: Scatter-Gather to all shards",
                  "varType": "Uniform",
                  "isUpdated": true
                },
                {
                  "label": "2. Range Sharding",
                  "value": "Routing: Key in [Min, Max] | Hotspot Risk: High on auto-increment IDs | Range Queries: Single Shard",
                  "varType": "Range Efficient",
                  "isUpdated": false
                },
                {
                  "label": "3. Directory Sharding",
                  "value": "Routing: Lookup Table | Flexibility: Move individual VIP tenants dynamically",
                  "varType": "Flexible Enterprise",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sharding_eval_demo.js",
            "initialCode": "function selectShardingStrategy(hasVipTenants, queryType) {\n  if (hasVipTenants) return 'DIRECTORY_BASED_SHARDING (Isolate enterprise VIPs to dedicated shards)';\n  if (queryType === 'RANGE_QUERIES') return 'RANGE_SHARDING (Optimize range scans)';\n  return 'HASH_SHARDING (Uniform random key distribution)';\n}\n\nconsole.log('Multi-Tenant B2B SaaS:', selectShardingStrategy(true, 'SINGLE_KEY'));\nconsole.log('High-Volume Sensor Data:', selectShardingStrategy(false, 'SINGLE_KEY'));",
            "expectedOutput": "Multi-Tenant B2B SaaS: DIRECTORY_BASED_SHARDING (Isolate enterprise VIPs to dedicated shards)\nHigh-Volume Sensor Data: HASH_SHARDING (Uniform random key distribution)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which sharding strategy is optimal for a high-volume sensor ingestion system requiring uniform random key distribution?",
          "expectedStringOutput": "HASH_SHARDING (Uniform random key distribution)",
          "acceptableAnswers": [
            "HASH_SHARDING (Uniform random key distribution)",
            "HASH_SHARDING",
            "Hash sharding"
          ],
          "primaryMisconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
          "diagnosisMap": {
            "RANGE": {
              "misconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
              "errorExplanation": "High-volume uniform keys use HASH_SHARDING (Uniform random key distribution).",
              "recoveryPath": {
                "simplerExplanation": "Uniform distribution uses HASH_SHARDING.",
                "guidedFixPrompt": "Type HASH_SHARDING (Uniform random key distribution)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d18-b2-scatter-gather-query-penalty",
        "day": 18,
        "blockNumber": 2,
        "title": "The Scatter-Gather Query Penalty on Cross-Shard Queries",
        "conceptBudget": {
          "primaryConcept": "Scatter-Gather Query Penalty",
          "supportingTerms": [
            "Single-Shard Query (Routed directly to 1 shard by shard key: 2ms)",
            "Cross-Shard Scatter-Gather (Query broadcast to all 32 shards in parallel, merged in app layer: 80ms P99 latency)",
            "Shard Key Selection Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d18-b1-sharding-architectures-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scatter_gather_demo.js",
            "initialCode": "function evaluateQueryLatency(hasShardKey, totalShards = 16) {\n  return hasShardKey \n    ? { mode: 'TARGETED_SINGLE_SHARD_QUERY', shardsContacted: 1, latencyMs: '2 ms' }\n    : { mode: 'SCATTER_GATHER_CROSS_SHARD_QUERY', shardsContacted: totalShards, latencyMs: '65 ms' };\n}\n\nconsole.log('Query with Shard Key:', JSON.stringify(evaluateQueryLatency(true)));\nconsole.log('Query without Shard Key:', JSON.stringify(evaluateQueryLatency(false)));",
            "expectedOutput": "Query with Shard Key: {\"mode\":\"TARGETED_SINGLE_SHARD_QUERY\",\"shardsContacted\":1,\"latencyMs\":\"2 ms\"}\nQuery without Shard Key: {\"mode\":\"SCATTER_GATHER_CROSS_SHARD_QUERY\",\"shardsContacted\":16,\"latencyMs\":\"65 ms\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is selecting the correct Shard Key the single most critical decision when partitioning relational or NoSQL databases?",
          "options": [
            "Because queries containing the Shard Key route directly to a single physical database shard in 2ms, whereas queries missing the Shard Key must execute expensive Scatter-Gather broadcasts across all shards simultaneously",
            "Because the shard key encrypts the hard drive",
            "Because databases delete non-shard-key columns"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
              "errorExplanation": "Shard keys route queries to single nodes, avoiding expensive cluster-wide scatter-gather scans.",
              "recoveryPath": {
                "simplerExplanation": "Enables single-shard routing and prevents scatter-gather penalty.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d18-b3-resharding-zero-downtime-migration",
        "day": 18,
        "blockNumber": 3,
        "title": "Zero-Downtime Resharding & Online Dual-Writing",
        "conceptBudget": {
          "primaryConcept": "Zero-Downtime Resharding",
          "supportingTerms": [
            "Phase 1: Dual-Writing to old and new shard topology",
            "Phase 2: Backfilling historical data",
            "Phase 3: Verifying data parity with shadow reads",
            "Phase 4: Cutover and decommission old shards"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d18-b2-scatter-gather-query-penalty",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "reshard_flow_demo.js",
            "initialCode": "function getReshardingSteps() {\n  return [\n    '1. Deploy dual-writing middleware (Write to Old & New Shards)',\n    '2. Run background CDC backfill for historical data',\n    '3. Enable shadow reads to verify 100% data consistency parity',\n    '4. Flip read traffic to New Shards and drop Old Shards (Zero Downtime!)'\n  ];\n}\n\nconsole.log(getReshardingSteps().join('\\n'));",
            "expectedOutput": "1. Deploy dual-writing middleware (Write to Old & New Shards)\n2. Run background CDC backfill for historical data\n3. Enable shadow reads to verify 100% data consistency parity\n4. Flip read traffic to New Shards and drop Old Shards (Zero Downtime!)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Phase 1 in the zero-downtime database resharding migration sequence?",
          "expectedStringOutput": "1. Deploy dual-writing middleware (Write to Old & New Shards)",
          "acceptableAnswers": [
            "1. Deploy dual-writing middleware (Write to Old & New Shards)",
            "Dual-writing",
            "Phase 1: Dual-writing"
          ],
          "primaryMisconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
          "diagnosisMap": {
            "Backfill": {
              "misconceptionId": "MC_DIST_DATABASE_SHARDING_RANGE_HASH_DIRECTORY",
              "errorExplanation": "Phase 1 is dual-writing to prevent missing new incoming writes.",
              "recoveryPath": {
                "simplerExplanation": "Phase 1 is dual-writing.",
                "guidedFixPrompt": "Type 1. Deploy dual-writing middleware (Write to Old & New Shards)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency",
    "overviewMetaphor": "Read-Your-Own-Writes Consistency is editing your social media profile: you change your profile status to \"Software Architect at Google\" (Write to Primary Database); you immediately click Refresh; the refresh query routes to an asynchronous Read Replica that is running 2 seconds behind (Replication Lag); your screen displays your old status \"Student\" (Glitch!); Read-Your-Own-Writes guarantees that your session routes reads to the Primary DB for the next 5 seconds so you always see your own updates.",
    "blocks": [
      {
        "id": "dist-d19-b1-replication-lag-glitches",
        "day": 19,
        "blockNumber": 1,
        "title": "Asynchronous Replication Lag & Read Glitches",
        "conceptBudget": {
          "primaryConcept": "Replication Lag Anomalies",
          "supportingTerms": [
            "Primary (Master: Read/Write) vs Secondary (Read Replicas: Read-Only)",
            "Asynchronous replication log streaming (Binlog / WAL)",
            "Replication lag anomaly: User posts comment $\\to$ Refreshes $\\to$ Comment disappears!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d2-b1-cap-theorem-formal-proof",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Replication Lag Stale Read vs Read-Your-Writes Fix",
              "brokenCode": "// ❌ NAIVE REPLICA ROUTING (Stale Glitch):\n1. User posts comment -> Writes to Primary DB\n2. User refreshes page -> App queries Read Replica (Lag: 1.5s)\n3. Replica hasn't received WAL log -> Page renders with ZERO comments -> User panics & submits duplicate comment!",
              "fixedCode": "// ✅ READ-YOUR-OWN-WRITES SESSION ROUTING:\n1. User posts comment -> Writes to Primary DB & sets session.lastWriteTs = Date.now()\n2. User refreshes -> App checks (Date.now() - session.lastWriteTs < 5000ms)\n3. Routes read query to PRIMARY DB -> Renders fresh comment instantly! (100% Correct)",
              "errorLine": 3,
              "errorReason": "Routing immediate reads to asynchronous replicas exposes users to replication lag.",
              "fixExplanation": "Route user's own reads to the primary database for a short window after writes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "read_your_writes_demo.js",
            "initialCode": "function routeReadQuery(sessionLastWriteMs, thresholdMs = 5000) {\n  const timeSinceWrite = Date.now() - sessionLastWriteMs;\n  if (timeSinceWrite < thresholdMs) {\n    return 'ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)';\n  }\n  return 'ROUTE_TO_ASYNC_READ_REPLICA (Offload primary database load)';\n}\n\nconst recentWrite = Date.now() - 500; // 0.5s ago\nconst oldWrite = Date.now() - 10000;  // 10s ago\nconsole.log('500ms after Write:', routeReadQuery(recentWrite));\nconsole.log('10s after Write:', routeReadQuery(oldWrite));",
            "expectedOutput": "500ms after Write: ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)\n10s after Write: ROUTE_TO_ASYNC_READ_REPLICA (Offload primary database load)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is a read query routed 500ms after the user performs a database write?",
          "expectedStringOutput": "ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)",
          "acceptableAnswers": [
            "ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)",
            "Primary DB",
            "500ms after Write: ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)"
          ],
          "primaryMisconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
          "diagnosisMap": {
            "REPLICA": {
              "misconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
              "errorExplanation": "Recent writes (< 5s) route to the primary DB to prevent stale read glitches.",
              "recoveryPath": {
                "simplerExplanation": "Routes to ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard).",
                "guidedFixPrompt": "Type ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d19-b2-monotonic-reads-guarantee",
        "day": 19,
        "blockNumber": 2,
        "title": "Monotonic Reads: Preventing Time-Traveling Backward Reads",
        "conceptBudget": {
          "primaryConcept": "Monotonic Reads Guarantee",
          "supportingTerms": [
            "Time-traveling anomaly (User reads from Replica 1 with 0ms lag, then refreshes and reads from Replica 2 with 500ms lag: state goes backward!)",
            "Session Sticky Replica pinning (Sticky cookie routes user to same replica)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d19-b1-replication-lag-glitches",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "monotonic_reads_demo.js",
            "initialCode": "function evaluateMonotonicRead(currentVersion, previousReadVersion) {\n  if (currentVersion < previousReadVersion) {\n    return { valid: false, error: 'MONOTONIC_READ_VIOLATION_TIME_TRAVELED_BACKWARD' };\n  }\n  return { valid: true, version: currentVersion };\n}\n\nconsole.log('Read version 5 after version 4:', evaluateMonotonicRead(5, 4).valid);\nconsole.log('Read version 3 after version 4:', evaluateMonotonicRead(3, 4).error);",
            "expectedOutput": "Read version 5 after version 4: true\nRead version 3 after version 4: MONOTONIC_READ_VIOLATION_TIME_TRAVELED_BACKWARD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is a 'Monotonic Read' consistency guarantee in distributed database systems?",
          "options": [
            "If a user reads value version $V_1$, they are mathematically guaranteed to never subsequently read an older version $V_0$ on future requests",
            "That all reads must be executed in alphabetical order",
            "That only 1 read query can run per second"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
              "errorExplanation": "Monotonic reads guarantee a user never observes state moving backward in time.",
              "recoveryPath": {
                "simplerExplanation": "Prevents users from observing older data on subsequent reads.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d19-b3-consistent-prefix-reads",
        "day": 19,
        "blockNumber": 3,
        "title": "Consistent Prefix Reads: Preserving Cause-and-Effect Ordering",
        "conceptBudget": {
          "primaryConcept": "Consistent Prefix Reads",
          "supportingTerms": [
            "Cause-and-Effect Invariant (If question $Q$ causes answer $A$, no observer sees $A$ without $Q$)",
            "Multi-partition replication order preservation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d19-b2-monotonic-reads-guarantee",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "consistent_prefix_demo.js",
            "initialCode": "function evaluateCausalPrefix(hasQuestion, hasAnswer) {\n  if (hasAnswer && !hasQuestion) return 'VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION';\n  return 'CONSISTENT_PREFIX_ORDERING_PRESERVED';\n}\n\nconsole.log('Question and Answer visible:', evaluateCausalPrefix(true, true));\nconsole.log('Answer visible without Question:', evaluateCausalPrefix(false, true));",
            "expectedOutput": "Question and Answer visible: CONSISTENT_PREFIX_ORDERING_PRESERVED\nAnswer visible without Question: VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an answer appears to a reader without the preceding question being visible?",
          "expectedStringOutput": "VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION",
          "acceptableAnswers": [
            "VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION",
            "Answer visible without Question: VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION"
          ],
          "primaryMisconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
          "diagnosisMap": {
            "CONSISTENT": {
              "misconceptionId": "MC_DIST_READ_REPLICAS_REPLICATION_LAG_READ_YOUR_WRITES",
              "errorExplanation": "Observing an effect before its cause violates consistent prefix ordering.",
              "recoveryPath": {
                "simplerExplanation": "Violates causal ordering: VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION.",
                "guidedFixPrompt": "Type VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation",
    "overviewMetaphor": "A Circuit Breaker is an electrical fuse in your home's breaker panel: if a malfunctioning toaster (Failing downstream microservice) starts drawing dangerous electrical surges, the fuse pops OPEN instantly, cutting electricity to the toaster in 1 millisecond; this protects the entire house from burning down (Cascading cluster failure), allowing you to safely test the toaster later in HALF-OPEN state.",
    "blocks": [
      {
        "id": "dist-d20-b1-circuit-breaker-three-states",
        "day": 20,
        "blockNumber": 1,
        "title": "The Circuit Breaker Three-State Machine: CLOSED $\\to$ OPEN $\\to$ HALF-OPEN",
        "conceptBudget": {
          "primaryConcept": "Circuit Breaker State Machine",
          "supportingTerms": [
            "CLOSED (Normal operation: requests flow through; failure counter monitored)",
            "OPEN (Failure threshold exceeded: fails fast in 0ms without calling dead service)",
            "HALF-OPEN (Cooldown timer expires: allows $K$ trial probe requests)",
            "Failure Rate Threshold (e.g. $> 50\\%$ over sliding window)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b2-timeouts-and-exponential-backoff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Circuit Breaker State Transitions",
              "nodes": [
                {
                  "id": "1",
                  "label": "CLOSED State: Normal traffic flows (Failure rate < 50%)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Failure Rate > 50% -> Trips OPEN! (Fails fast in 0ms with HTTP 503)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Reset Timeout (10s) expires -> Transitions to HALF-OPEN (Sends 3 trial probe requests)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Probes Succeed -> Closes Circuit! / Probes Fail -> Trips back to OPEN",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "circuit_state_demo.js",
            "initialCode": "function evaluateCircuitState(failureRatePercent, currentSecondsInOpen, openTimeoutSec = 10) {\n  if (currentSecondsInOpen >= openTimeoutSec) return 'HALF_OPEN_SENDING_PROBE_REQUESTS';\n  if (failureRatePercent >= 50) return 'OPEN_FAIL_FAST_HTTP_503';\n  return 'CLOSED_NORMAL_TRAFFIC';\n}\n\nconsole.log('Failure Rate 60%:', evaluateCircuitState(60, 2));\nconsole.log('12 seconds after trip:', evaluateCircuitState(60, 12));",
            "expectedOutput": "Failure Rate 60%: OPEN_FAIL_FAST_HTTP_503\n12 seconds after trip: HALF_OPEN_SENDING_PROBE_REQUESTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does the circuit breaker transition to 12 seconds after tripping open (with a 10s cooldown timer)?",
          "expectedStringOutput": "HALF_OPEN_SENDING_PROBE_REQUESTS",
          "acceptableAnswers": [
            "HALF_OPEN_SENDING_PROBE_REQUESTS",
            "HALF_OPEN",
            "12 seconds after trip: HALF_OPEN_SENDING_PROBE_REQUESTS"
          ],
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "OPEN": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "Exceeding the 10s cooldown timer transitions to HALF_OPEN to test canary probe requests.",
              "recoveryPath": {
                "simplerExplanation": "Cooldown timer expires -> HALF_OPEN.",
                "guidedFixPrompt": "Type HALF_OPEN_SENDING_PROBE_REQUESTS"
              }
            }
          }
        }
      },
      {
        "id": "dist-d20-b2-bulkhead-isolation-pools",
        "day": 20,
        "blockNumber": 2,
        "title": "The Bulkhead Pattern: Ship Hull Partitioning for Thread Pools",
        "conceptBudget": {
          "primaryConcept": "The Bulkhead Pattern",
          "supportingTerms": [
            "Nygard (Release It!) Bulkhead Pattern",
            "Isolated Thread Pools / Connection Pools per downstream microservice",
            "Preventing 1 slow service from consuming 100% of gateway worker threads"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d20-b1-circuit-breaker-three-states",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Shared Thread Pool vs Bulkhead Isolated Pools",
              "boxes": [
                {
                  "label": "1. Shared Pool (100 Threads)",
                  "value": "Slow Recommendation Service consumes all 100 threads -> Payment & Login crash completely!",
                  "varType": "Cascading Outage",
                  "isUpdated": false
                },
                {
                  "label": "2. Bulkhead Isolated Pools",
                  "value": "Payments: 40 threads | Login: 40 threads | Recommendations: 20 threads (Capped: cannot impact payments!)",
                  "varType": "Resilient Isolation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bulkhead_demo.js",
            "initialCode": "class Bulkhead {\n  constructor(maxConcurrent) {\n    this.max = maxConcurrent;\n    this.active = 0;\n  }\n  tryAcquire() {\n    if (this.active >= this.max) return false;\n    this.active++;\n    return true;\n  }\n  release() { this.active = Math.max(0, this.active - 1); }\n}\n\nconst recBulkhead = new Bulkhead(2);\nconsole.log('Request 1:', recBulkhead.tryAcquire());\nconsole.log('Request 2:', recBulkhead.tryAcquire());\nconsole.log('Request 3 (Exceeds pool):', recBulkhead.tryAcquire());",
            "expectedOutput": "Request 1: true\nRequest 2: true\nRequest 3 (Exceeds pool): false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Bulkhead Pattern prevent a single degraded third-party API from taking down an entire API Gateway?",
          "options": [
            "It isolates client connections into dedicated, capped thread pools per service; when the third-party API hangs, only its small dedicated pool fills up, leaving all other core payment and auth thread pools fully operational",
            "By shutting down the entire server",
            "By deleting the third-party API"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "Bulkheads allocate separate resource pools so failures cannot cascade across boundaries.",
              "recoveryPath": {
                "simplerExplanation": "Allocates capped isolated thread pools per service.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d20-b3-graceful-fallback-degradation",
        "day": 20,
        "blockNumber": 3,
        "title": "Graceful Degradation & Static Fallback Responses",
        "conceptBudget": {
          "primaryConcept": "Graceful Fallback Degradation",
          "supportingTerms": [
            "Serving static cached recommendation lists when AI model trips open",
            "Returning empty reviews instead of failing the entire product page",
            "Zero user-facing HTTP 500 error screens"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d20-b2-bulkhead-isolation-pools",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fallback_demo.js",
            "initialCode": "async function getProductRecommendations(isCircuitOpen) {\n  if (isCircuitOpen) {\n    return { source: 'STATIC_FALLBACK_CACHE', items: ['Popular Item #1', 'Popular Item #2'] };\n  }\n  return { source: 'LIVE_AI_PERSONALIZED', items: ['Personalized Item #9'] };\n}\n\ngetProductRecommendations(true).then(res => console.log(JSON.stringify(res)));",
            "expectedOutput": "{\"source\":\"STATIC_FALLBACK_CACHE\",\"items\":[\"Popular Item #1\",\"Popular Item #2\"]}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where are product recommendations served from when the live recommendation circuit is OPEN?",
          "expectedStringOutput": "STATIC_FALLBACK_CACHE",
          "acceptableAnswers": [
            "STATIC_FALLBACK_CACHE",
            "source\":\"STATIC_FALLBACK_CACHE\"",
            "Fallback cache"
          ],
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "LIVE": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "Open circuits serve from STATIC_FALLBACK_CACHE to degrade gracefully.",
              "recoveryPath": {
                "simplerExplanation": "Serves from STATIC_FALLBACK_CACHE.",
                "guidedFixPrompt": "Type STATIC_FALLBACK_CACHE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete industrial API Gateway perimeter: 1. Request arrives at the edge; 2. Redis Token Bucket rate limiter admits requests within quota (Rejects 429); 3. Bulkhead allocates isolated thread execution slots; 4. Circuit Breaker guards backend microservices from cascading failures (Fails fast 503 if open); 5. Serves graceful static fallbacks on service degradation with 99.999% uptime.",
    "blocks": [
      {
        "id": "dist-d21-b1-gateway-perimeter-architecture",
        "day": 21,
        "blockNumber": 1,
        "title": "Resilient Distributed API Gateway Architecture",
        "conceptBudget": {
          "primaryConcept": "API Gateway Perimeter Architecture",
          "supportingTerms": [
            "Token Bucket Rate Limiting (Redis)",
            "Circuit Breakers (Envoy / Resilience4j)",
            "Bulkhead Pool Isolation",
            "Graceful Fallback Routing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d20-b1-circuit-breaker-three-states",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Perimeter Gateway Defense Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Client Request -> Token Bucket Rate Limiter Check",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Quota OK -> Bulkhead acquires slot in dedicated service thread pool",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Circuit Breaker Check -> Closed: Forward to Backend / Open: Serve Static Fallback",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Backend Returns Data -> Delivers 200 OK to Client with latency headers!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_perimeter_sim.js",
            "initialCode": "async function runGatewayPerimeter(req) {\n  return {\n    clientId: req.clientId,\n    rateLimiterCheck: 'PASSED_UNDER_QUOTA',\n    bulkheadSlot: 'ACQUIRED (Slot 12 of 40)',\n    circuitState: 'CLOSED_HEALTHY',\n    responseStatus: 200,\n    gatewayStatus: 'GATEWAY_PERIMETER_ONLINE'\n  };\n}\n\nrunGatewayPerimeter({ clientId: 'cust_101' }).then(res => {\n  console.log('Gateway Status:', res.gatewayStatus);\n  console.log('Circuit State:', res.circuitState);\n});",
            "expectedOutput": "Gateway Status: GATEWAY_PERIMETER_ONLINE\nCircuit State: CLOSED_HEALTHY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the operational status of the synthesized API Gateway perimeter?",
          "expectedStringOutput": "GATEWAY_PERIMETER_ONLINE",
          "acceptableAnswers": [
            "GATEWAY_PERIMETER_ONLINE",
            "Gateway Status: GATEWAY_PERIMETER_ONLINE"
          ],
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "OFFLINE": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "The perimeter initializes with GATEWAY_PERIMETER_ONLINE.",
              "recoveryPath": {
                "simplerExplanation": "Matches GATEWAY_PERIMETER_ONLINE.",
                "guidedFixPrompt": "Type GATEWAY_PERIMETER_ONLINE"
              }
            }
          }
        }
      },
      {
        "id": "dist-d21-b2-gateway-sla-benchmarks",
        "day": 21,
        "blockNumber": 2,
        "title": "API Gateway Edge SLA & P99 Overhead Benchmarks",
        "conceptBudget": {
          "primaryConcept": "Gateway Overhead Benchmarks",
          "supportingTerms": [
            "Gateway Overhead SLA: < 3ms added latency",
            "Throughput: 100,000 req/sec per cluster",
            "Zero Cascading Failure Tolerance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d21-b1-gateway-perimeter-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gateway_sla_audit.js",
            "initialCode": "function auditGatewayOverhead(addedLatencyMs, rps) {\n  const compliant = addedLatencyMs <= 3.0 && rps >= 100000;\n  return {\n    addedLatencyMs,\n    throughputRps: rps,\n    compliant,\n    grade: compliant ? 'ENTERPRISE_GATEWAY_SLA_CERTIFIED' : 'FAILED_GATEWAY_SLA'\n  };\n}\n\nconsole.log(JSON.stringify(auditGatewayOverhead(1.8, 120000)));",
            "expectedOutput": "{\"addedLatencyMs\":1.8,\"throughputRps\":120000,\"compliant\":true,\"grade\":\"ENTERPRISE_GATEWAY_SLA_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What grade is awarded to the API Gateway meeting 1.8ms overhead and 120,000 RPS?",
          "expectedStringOutput": "ENTERPRISE_GATEWAY_SLA_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_GATEWAY_SLA_CERTIFIED",
            "grade\":\"ENTERPRISE_GATEWAY_SLA_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "1.8ms <= 3.0ms and 120k >= 100k satisfies ENTERPRISE_GATEWAY_SLA_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_GATEWAY_SLA_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_GATEWAY_SLA_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "dist-d21-b3-milestone3-dist-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Distributed Rate Limiter & Circuit Breaker Gateway Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Resilient Gateway Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d21-b2-gateway-sla-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_dist_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_CIRCUIT_BREAKER_BULKHEAD_RESILIENCE",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Gossip Protocols: SWIM Failure Detection & Cluster Membership",
    "overviewMetaphor": "Gossip Protocols are rumors spreading in a school cafeteria: instead of the principal having to call 1,000 students on the telephone every morning (Centralized heartbeat: $O(N)$ network bottleneck), Student A tells 3 random friends (\"Node 42 is down!\"); each of those 3 friends tells 3 random friends; within $O(\\log N)$ seconds (8 rounds for 1,000 students), every single student in the cafeteria knows the truth with mathematical certainty (Epidemic Infection).",
    "blocks": [
      {
        "id": "dist-d22-b1-epidemic-gossip-dissemination",
        "day": 22,
        "blockNumber": 1,
        "title": "Epidemic Gossip Dissemination & $O(\\log N)$ Broadcast Convergence",
        "conceptBudget": {
          "primaryConcept": "Epidemic Gossip Dissemination",
          "supportingTerms": [
            "Demers et al. Epidemic Algorithms",
            "Fanout Parameter ($k=3$ random peers per round)",
            "Information Dissemination in $O(\\log N)$ rounds",
            "Decentralized resilience (Zero single point of failure)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Centralized Heartbeats vs Gossip Protocol",
              "boxes": [
                {
                  "label": "1. Centralized Heartbeats",
                  "value": "Network Traffic: $O(N)$ on Master node -> Bottleneck caps cluster size at ~500 nodes",
                  "varType": "Central Bottleneck",
                  "isUpdated": false
                },
                {
                  "label": "2. Epidemic Gossip (SWIM)",
                  "value": "Network Traffic: $O(1)$ constant per node -> Scales effortlessly to 50,000+ nodes!",
                  "varType": "Massive Scale",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gossip_rounds_demo.js",
            "initialCode": "function calculateGossipRounds(clusterSize, fanout = 3) {\n  const rounds = Math.ceil(Math.log(clusterSize) / Math.log(fanout));\n  return {\n    clusterSize,\n    fanoutPeersPerRound: fanout,\n    roundsTo100PercentConvergence: rounds\n  };\n}\n\nconsole.log('1,000 nodes (Fanout 3):', JSON.stringify(calculateGossipRounds(1000, 3)));\nconsole.log('100,000 nodes (Fanout 3):', JSON.stringify(calculateGossipRounds(100000, 3)));",
            "expectedOutput": "1,000 nodes (Fanout 3): {\"clusterSize\":1000,\"fanoutPeersPerRound\":3,\"roundsTo100PercentConvergence\":7}\n100,000 nodes (Fanout 3): {\"clusterSize\":100000,\"fanoutPeersPerRound\":3,\"roundsTo100PercentConvergence\":11}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many gossip rounds are required to spread membership updates to 100% of a 1,000-node cluster with fanout $k=3$?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7 rounds",
            "roundsTo100PercentConvergence\":7"
          ],
          "primaryMisconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
              "errorExplanation": "Gossip spreads exponentially in O(log_3 N) = 7 rounds, not 1000.",
              "recoveryPath": {
                "simplerExplanation": "log_3(1000) = 7 rounds.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "dist-d22-b2-swim-failure-detector",
        "day": 22,
        "blockNumber": 2,
        "title": "SWIM Protocol: Direct Ping $\\to$ Indirect Ping $\\to$ Suspect State",
        "conceptBudget": {
          "primaryConcept": "SWIM Failure Detection (Das et al.)",
          "supportingTerms": [
            "Step 1: Direct `ping` to random node $B$",
            "Step 2: If timeout $\\to$ Send `ping-req(B)` to $k$ random peer nodes (Indirect Ping)",
            "Step 3: If indirect pings fail $\\to$ Mark $B$ as `SUSPECT` (Grace period before declaring `DEAD`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d22-b1-epidemic-gossip-dissemination",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "SWIM Failure Detection Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Node A sends direct ping to Node B -> Times out (200ms)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Node A sends ping-req(B) to 3 random peers (C, D, E)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Peers try pinging B -> If any peer reaches B, B is ALIVE (A had local network drop)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "All peers time out -> Node A marks B as 'SUSPECT' with grace period! (Zero False Positives)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "swim_sim_demo.js",
            "initialCode": "function evaluateSwimState(directSuccess, indirectSuccess) {\n  if (directSuccess) return 'NODE_ALIVE_DIRECT';\n  if (indirectSuccess) return 'NODE_ALIVE_INDIRECT (Local packet drop on probe node)';\n  return 'MARK_NODE_SUSPECT_WITH_GRACE_PERIOD';\n}\n\nconsole.log('Direct probe success:', evaluateSwimState(true, false));\nconsole.log('Direct failed, Peer probe succeeded:', evaluateSwimState(false, true));\nconsole.log('All probes failed:', evaluateSwimState(false, false));",
            "expectedOutput": "Direct probe success: NODE_ALIVE_DIRECT\nDirect failed, Peer probe succeeded: NODE_ALIVE_INDIRECT (Local packet drop on probe node)\nAll probes failed: MARK_NODE_SUSPECT_WITH_GRACE_PERIOD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the SWIM protocol execute Indirect Pings via peer nodes before declaring a target node suspect?",
          "options": [
            "To prevent false positive failure declarations caused by temporary local network packet drops between Node A and Node B, ensuring Node B is only marked suspect if multiple independent peers also fail to reach it",
            "Because direct pings are illegal in Linux",
            "To double the network traffic"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
              "errorExplanation": "Indirect pings eliminate false positives caused by single-link packet loss.",
              "recoveryPath": {
                "simplerExplanation": "Eliminates false positives from single-link network drops.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d22-b3-incarnation-numbers-suspect-refutation",
        "day": 22,
        "blockNumber": 3,
        "title": "Incarnation Numbers: Refuting False Suspect Accusations",
        "conceptBudget": {
          "primaryConcept": "Incarnation Number Refutation",
          "supportingTerms": [
            "Incarnation Number ($I=0, I=1, \\dots$)",
            "A live node hearing a rumor that it is `SUSPECT` increments its Incarnation Number ($I+1$) and broadcasts `ALIVE(I+1)`",
            "Higher Incarnation Number overrides lower suspect rumors"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d22-b2-swim-failure-detector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "incarnation_demo.js",
            "initialCode": "function resolveGossipConflict(rumorState, nodeIncarnation) {\n  if (nodeIncarnation > rumorState.incarnation) {\n    return { state: 'ALIVE', incarnation: nodeIncarnation, note: 'HIGHER_INCARNATION_REFUTES_SUSPECT_RUMOR' };\n  }\n  return { state: rumorState.state, incarnation: rumorState.incarnation };\n}\n\nconst rumor = { state: 'SUSPECT', incarnation: 1 };\nconsole.log(JSON.stringify(resolveGossipConflict(rumor, 2)));",
            "expectedOutput": "{\"state\":\"ALIVE\",\"incarnation\":2,\"note\":\"HIGHER_INCARNATION_REFUTES_SUSPECT_RUMOR\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state is resolved when a falsely accused node broadcasts an ALIVE message with Incarnation 2 (higher than the SUSPECT rumor's Incarnation 1)?",
          "expectedStringOutput": "ALIVE",
          "acceptableAnswers": [
            "ALIVE",
            "state\":\"ALIVE\""
          ],
          "primaryMisconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
          "diagnosisMap": {
            "SUSPECT": {
              "misconceptionId": "MC_DIST_GOSSIP_PROTOCOL_FAILURE_DETECTION_SWIM",
              "errorExplanation": "Higher incarnation numbers override lower suspect rumors, returning ALIVE.",
              "recoveryPath": {
                "simplerExplanation": "Higher incarnation resolves to ALIVE.",
                "guidedFixPrompt": "Type ALIVE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring",
    "overviewMetaphor": "Load Balancing is an air traffic control dispatcher: Round-Robin sends planes to Runways 1, 2, 3 in rigid order; Weighted Round-Robin sends 4 large Boeing 777s to the Giant Runway and only 1 Cessna to the Short Runway; Least Connections checks which runway currently has zero waiting aircraft; Consistent Hashing ensures that Flight #42 always lands on the same runway so its specialized ground crew and baggage handlers are already waiting.",
    "blocks": [
      {
        "id": "dist-d23-b1-load-balancing-algorithms-taxonomy",
        "day": 23,
        "blockNumber": 1,
        "title": "Load Balancing Taxonomy: Round-Robin vs Weighted vs Least Connections",
        "conceptBudget": {
          "primaryConcept": "Load Balancing Algorithms",
          "supportingTerms": [
            "Round-Robin (Uniform sequential rotation)",
            "Weighted Round-Robin (Proportional to server hardware capacity: 16-core vs 4-core)",
            "Least Connections / Least Response Time (Dynamically routing to least busy node)",
            "Layer 4 (TCP/UDP IP Hash) vs Layer 7 (HTTP URI / Cookie Path)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Load Balancing Strategy Selection",
              "boxes": [
                {
                  "label": "1. Round-Robin",
                  "value": "Best For: Homogeneous servers handling uniform short-lived requests (e.g. static assets)",
                  "varType": "Uniform",
                  "isUpdated": false
                },
                {
                  "label": "2. Weighted Round-Robin",
                  "value": "Best For: Heterogeneous server sizes (e.g. 64GB RAM vs 16GB RAM)",
                  "varType": "Capacity Aware",
                  "isUpdated": false
                },
                {
                  "label": "3. Least Connections",
                  "value": "Best For: Long-lived persistent connections (WebSockets, database pools, heavy SQL reports)",
                  "varType": "Dynamic Load",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lb_selection_demo.js",
            "initialCode": "function selectLbAlgorithm(trafficType, isHeterogeneous) {\n  if (isHeterogeneous) return 'WEIGHTED_ROUND_ROBIN (Route by server CPU/RAM capacity)';\n  if (trafficType === 'LONG_LIVED_WEBSOCKETS') return 'LEAST_CONNECTIONS (Route to node with lowest active socket count)';\n  return 'ROUND_ROBIN (Standard uniform rotation)';\n}\n\nconsole.log('Real-Time WebSocket Chat:', selectLbAlgorithm('LONG_LIVED_WEBSOCKETS', false));\nconsole.log('Mixed Cloud Server Pool:', selectLbAlgorithm('STANDARD_HTTP', true));",
            "expectedOutput": "Real-Time WebSocket Chat: LEAST_CONNECTIONS (Route to node with lowest active socket count)\nMixed Cloud Server Pool: WEIGHTED_ROUND_ROBIN (Route by server CPU/RAM capacity)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which load balancing algorithm is optimal for long-lived WebSocket chat connections?",
          "expectedStringOutput": "LEAST_CONNECTIONS (Route to node with lowest active socket count)",
          "acceptableAnswers": [
            "LEAST_CONNECTIONS (Route to node with lowest active socket count)",
            "LEAST_CONNECTIONS",
            "Least connections"
          ],
          "primaryMisconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
          "diagnosisMap": {
            "ROUND_ROBIN": {
              "misconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
              "errorExplanation": "Long-lived connections require dynamic LEAST_CONNECTIONS routing to prevent uneven pile-ups.",
              "recoveryPath": {
                "simplerExplanation": "WebSockets use LEAST_CONNECTIONS.",
                "guidedFixPrompt": "Type LEAST_CONNECTIONS (Route to node with lowest active socket count)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d23-b2-smooth-weighted-round-robin",
        "day": 23,
        "blockNumber": 2,
        "title": "Nginx Smooth Weighted Round-Robin Algorithm",
        "conceptBudget": {
          "primaryConcept": "Smooth Weighted Round-Robin (Nginx)",
          "supportingTerms": [
            "Current Weight accumulator (`currentWeight += weight`)",
            "Pick node with $\\max(\\text{currentWeight})$",
            "Decrement winning node: $\\text{currentWeight} -= \\sum \\text{weights}$",
            "Eliminates burst clustering (e.g. prevents 5 consecutive hits to Server A)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d23-b1-load-balancing-algorithms-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "smooth_wrr_demo.js",
            "initialCode": "function runSmoothWrrSequence(servers, requests = 4) {\n  const totalWeight = servers.reduce((a, s) => a + s.weight, 0);\n  const sequence = [];\n  for (let i = 0; i < requests; i++) {\n    servers.forEach(s => s.currentWeight = (s.currentWeight || 0) + s.weight);\n    let maxServer = servers[0];\n    servers.forEach(s => { if (s.currentWeight > maxServer.currentWeight) maxServer = s; });\n    maxServer.currentWeight -= totalWeight;\n    sequence.push(maxServer.id);\n  }\n  return sequence;\n}\n\nconst pool = [{ id: 'A', weight: 3, currentWeight: 0 }, { id: 'B', weight: 1, currentWeight: 0 }];\nconsole.log('Interleaved Sequence:', runSmoothWrrSequence(pool, 4).join(' -> '));",
            "expectedOutput": "Interleaved Sequence: A -> A -> B -> A",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the smooth interleaved dispatch sequence for Server A (weight 3) and Server B (weight 1)?",
          "expectedStringOutput": "A -> A -> B -> A",
          "acceptableAnswers": [
            "A -> A -> B -> A",
            "Interleaved Sequence: A -> A -> B -> A"
          ],
          "primaryMisconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
          "diagnosisMap": {
            "A -> A -> A -> B": {
              "misconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
              "errorExplanation": "Smooth WRR interleaves requests (A -> A -> B -> A) rather than burst clustering.",
              "recoveryPath": {
                "simplerExplanation": "Interleaves as A -> A -> B -> A.",
                "guidedFixPrompt": "Type A -> A -> B -> A"
              }
            }
          }
        }
      },
      {
        "id": "dist-d23-b3-layer4-vs-layer7-routing",
        "day": 23,
        "blockNumber": 3,
        "title": "Layer 4 (Transport / IP Hash) vs Layer 7 (Application / HTTP Path) Routing",
        "conceptBudget": {
          "primaryConcept": "L4 vs L7 Load Balancing",
          "supportingTerms": [
            "Layer 4 (L4: TCP/UDP packet routing at line rate using IP/Port hash without TLS termination)",
            "Layer 7 (L7: Full HTTP parsing, Cookie affinity, URL path routing `/api/v1/checkout`, TLS termination)",
            "Envoy / HAProxy / AWS ALB vs NLB"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d23-b2-smooth-weighted-round-robin",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "l4_l7_demo.js",
            "initialCode": "function evaluateBalancerLayer(needsUrlPathRouting, needsMaxLineRatePackets) {\n  if (needsUrlPathRouting) return 'LAYER_7_APPLICATION_LOAD_BALANCER (ALB/Envoy: Inspects HTTP Headers/Paths)';\n  if (needsMaxLineRatePackets) return 'LAYER_4_NETWORK_LOAD_BALANCER (NLB: High Throughput TCP/UDP Line Rate)';\n  return 'STANDARD_LOAD_BALANCER';\n}\n\nconsole.log(evaluateBalancerLayer(true, false));\nconsole.log(evaluateBalancerLayer(false, true));",
            "expectedOutput": "LAYER_7_APPLICATION_LOAD_BALANCER (ALB/Envoy: Inspects HTTP Headers/Paths)\nLAYER_4_NETWORK_LOAD_BALANCER (NLB: High Throughput TCP/UDP Line Rate)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When is Layer 7 (L7) load balancing required over Layer 4 (L4)?",
          "options": [
            "When the load balancer needs to inspect HTTP headers, parse JSON payloads, terminate TLS certificates, or route requests based on URL paths (like routing `/orders` to Order Microservice and `/auth` to Auth Microservice)",
            "When routing raw UDP video streaming packets at 10 million packets per second",
            "When servers are physically disconnected"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_LOAD_BALANCING_LEAST_CONNECTIONS_ROUND_ROBIN",
              "errorExplanation": "L7 inspects application headers, paths, and cookies for intelligent routing.",
              "recoveryPath": {
                "simplerExplanation": "Required for HTTP URL path routing and header inspection.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Service Discovery & Heartbeat Health Checking (Consul / Zookeeper)",
    "overviewMetaphor": "Service Discovery is a dynamic hotel concierge directory: when a new chef arrives (New microservice container spun up by Kubernetes), the chef registers their name and room number with the Concierge (Consul / Zookeeper registry); every 10 seconds, the chef must call the concierge to say \"I am still cooking!\" (Heartbeat Lease); if the chef stops calling, the concierge crosses their name off the board in 15 seconds so no hungry guests get sent to an empty kitchen.",
    "blocks": [
      {
        "id": "dist-d24-b1-client-vs-server-side-discovery",
        "day": 24,
        "blockNumber": 1,
        "title": "Service Discovery Architectures: Client-Side vs Server-Side",
        "conceptBudget": {
          "primaryConcept": "Service Discovery Topologies",
          "supportingTerms": [
            "Client-Side Discovery (Client queries Consul registry directly and runs local load balancer; e.g. Netflix Eureka / Ribbon)",
            "Server-Side Discovery (Client queries AWS ALB / Kubernetes ClusterIP; proxy handles registry resolution)",
            "Trade-offs: Extra network hop vs Client language dependency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d23-b1-load-balancing-algorithms-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Discovery Topologies Comparison",
              "boxes": [
                {
                  "label": "1. Client-Side (Eureka / Consul)",
                  "value": "Client queries registry -> Zero extra proxy hops -> Requires client SDK in every language",
                  "varType": "Direct Low Latency",
                  "isUpdated": true
                },
                {
                  "label": "2. Server-Side (Kubernetes Kube-Proxy / ALB)",
                  "value": "Client queries virtual IP -> 1 extra proxy hop -> Language agnostic, clean abstraction",
                  "varType": "Standard K8s",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "discovery_mode_demo.js",
            "initialCode": "function evaluateDiscoveryType(topology) {\n  return topology === 'CLIENT_SIDE'\n    ? { proxyHops: 0, clientSmartRouting: true, requiresLanguageSdk: true }\n    : { proxyHops: 1, clientSmartRouting: false, requiresLanguageSdk: false };\n}\n\nconsole.log('Client-Side (Eureka):', JSON.stringify(evaluateDiscoveryType('CLIENT_SIDE')));\nconsole.log('Server-Side (Kubernetes):', JSON.stringify(evaluateDiscoveryType('SERVER_SIDE')));",
            "expectedOutput": "Client-Side (Eureka): {\"proxyHops\":0,\"clientSmartRouting\":true,\"requiresLanguageSdk\":true}\nServer-Side (Kubernetes): {\"proxyHops\":1,\"clientSmartRouting\":false,\"requiresLanguageSdk\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary architectural advantage of Server-Side Service Discovery (like Kubernetes Services with Kube-Proxy)?",
          "options": [
            "It is completely language-agnostic: microservices simply send standard HTTP/gRPC requests to a static DNS name (`http://payment-service`) without needing specialized discovery SDKs compiled into their code",
            "It eliminates all network firewalls",
            "It speeds up CPU clock cycles"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
              "errorExplanation": "Server-side discovery decouples application code from service discovery logic.",
              "recoveryPath": {
                "simplerExplanation": "Language-agnostic without embedding discovery SDKs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d24-b2-heartbeat-leases-ttl-eviction",
        "day": 24,
        "blockNumber": 2,
        "title": "Heartbeat Leases & Dead Instance TTL Eviction",
        "conceptBudget": {
          "primaryConcept": "Heartbeat Lease Eviction",
          "supportingTerms": [
            "Time-To-Live (TTL) Leases (e.g. 10s)",
            "Heartbeat renewal interval (e.g. every 3s)",
            "Automatic deregistration of crashed/unresponsive instances"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d24-b1-client-vs-server-side-discovery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lease_eviction_demo.js",
            "initialCode": "function evaluateInstanceHealth(lastHeartbeatMs, ttlMs = 10000) {\n  const elapsed = Date.now() - lastHeartbeatMs;\n  if (elapsed > ttlMs) return { status: 'DEAD', action: 'EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS' };\n  return { status: 'HEALTHY_ACTIVE', action: 'SERVE_TRAFFIC' };\n}\n\nconst alive = Date.now() - 2000;   // 2s ago\nconst crashed = Date.now() - 15000; // 15s ago\nconsole.log('Active Node:', evaluateInstanceHealth(alive).status);\nconsole.log('Dead Node:', evaluateInstanceHealth(crashed).action);",
            "expectedOutput": "Active Node: HEALTHY_ACTIVE\nDead Node: EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when an instance fails to send a heartbeat for 15 seconds (exceeding its 10s TTL lease)?",
          "expectedStringOutput": "EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS",
          "acceptableAnswers": [
            "EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS",
            "Dead Node: EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS",
            "Evict from registry"
          ],
          "primaryMisconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
          "diagnosisMap": {
            "SERVE": {
              "misconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
              "errorExplanation": "Expired TTL leases trigger EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS.",
              "recoveryPath": {
                "simplerExplanation": "Triggers EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS.",
                "guidedFixPrompt": "Type EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS"
              }
            }
          }
        }
      },
      {
        "id": "dist-d24-b3-health-checks-liveness-readiness",
        "day": 24,
        "blockNumber": 3,
        "title": "Active Probing: Liveness vs Readiness vs Startup Probes",
        "conceptBudget": {
          "primaryConcept": "Liveness vs Readiness Probes",
          "supportingTerms": [
            "Liveness Probe (Is the process alive? On fail $\\to$ restart container)",
            "Readiness Probe (Is the process ready to accept user traffic? e.g. warmed cache, DB connection pool open; on fail $\\to$ remove from load balancer)",
            "Startup Probe (Prevents premature liveness kills during slow JVM/app boot)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d24-b2-heartbeat-leases-ttl-eviction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "probe_actions_demo.js",
            "initialCode": "function evaluateProbeFailure(probeType) {\n  if (probeType === 'LIVENESS_FAILED') return 'RESTART_CONTAINER_POD';\n  if (probeType === 'READINESS_FAILED') return 'REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING';\n  return 'CONTAINER_HEALTHY';\n}\n\nconsole.log('Liveness Failure:', evaluateProbeFailure('LIVENESS_FAILED'));\nconsole.log('Readiness Failure:', evaluateProbeFailure('READINESS_FAILED'));",
            "expectedOutput": "Liveness Failure: RESTART_CONTAINER_POD\nReadiness Failure: REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the orchestrator when a container fails its Readiness Probe?",
          "expectedStringOutput": "REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING",
          "acceptableAnswers": [
            "REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING",
            "Readiness Failure: REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING"
          ],
          "primaryMisconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
          "diagnosisMap": {
            "RESTART": {
              "misconceptionId": "MC_DIST_SERVICE_DISCOVERY_CONSUL_ZOOKEEPER_HEARTBEATS",
              "errorExplanation": "Restarting is for Liveness failures. Readiness failure only removes the pod from load balancer traffic.",
              "recoveryPath": {
                "simplerExplanation": "Readiness failure = REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING.",
                "guidedFixPrompt": "Type REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "API Gateways & Backend-For-Frontend (BFF) Pattern",
    "overviewMetaphor": "The BFF (Backend-For-Frontend) Pattern is a personal travel shopper: if a Mobile Phone app tries to load a product page by calling 8 separate backend microservices over a slow 4G connection (8 round-trips: 1.6 seconds latency and 50% battery drain!), the Mobile BFF gateway makes the 8 calls across the internal datacenter fiber in 10ms, stitches the data into 1 single compact JSON payload, and returns it to the phone in 1 single 4G request.",
    "blocks": [
      {
        "id": "dist-d25-b1-bff-pattern-mobile-vs-web",
        "day": 25,
        "blockNumber": 1,
        "title": "The Backend-For-Frontend (BFF) Pattern: Mobile vs Web Optimization",
        "conceptBudget": {
          "primaryConcept": "Backend-For-Frontend (BFF) Pattern (Sam Newman)",
          "supportingTerms": [
            "Dedicated Gateway per client platform (Mobile BFF vs Desktop Web BFF vs IoT BFF)",
            "Over-fetching & Under-fetching reduction",
            "Protocol translation (Internal gRPC $\\to$ External REST/JSON)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d23-b3-layer4-vs-layer7-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Direct Client Microservice Calls vs BFF Gateway",
              "boxes": [
                {
                  "label": "1. Direct Client-to-Microservices",
                  "value": "Mobile makes 8 independent HTTP calls -> High cellular latency, high battery drain",
                  "varType": "Suboptimal",
                  "isUpdated": false
                },
                {
                  "label": "2. Mobile BFF Gateway",
                  "value": "Mobile makes 1 call -> BFF aggregates 8 microservices over 10Gbps fiber -> Returns 1 compact payload",
                  "varType": "Optimized BFF",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bff_aggregation_demo.js",
            "initialCode": "async function mobileBffProductEndpoint(productId) {\n  // BFF queries 3 internal microservices over datacenter fiber in parallel\n  const [product, reviews, stock] = await Promise.all([\n    Promise.resolve({ id: productId, name: 'Wireless Headphones', price: 99.99 }),\n    Promise.resolve({ rating: 4.8, totalCount: 1420 }),\n    Promise.resolve({ inStock: true })\n  ]);\n  // Stitches into compact mobile-friendly payload\n  return {\n    id: product.id,\n    title: product.name,\n    price: product.price,\n    rating: reviews.rating,\n    available: stock.inStock\n  };\n}\n\nmobileBffProductEndpoint('prod_99').then(res => console.log(JSON.stringify(res)));",
            "expectedOutput": "{\"id\":\"prod_99\",\"title\":\"Wireless Headphones\",\"price\":99.99,\"rating\":4.8,\"available\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of tailoring separate BFF (Backend-For-Frontend) gateways for Mobile apps vs Desktop Web applications?",
          "options": [
            "It allows the Mobile BFF to tailor compact, minimal JSON payloads and batch multiple backend microservice calls into 1 single cellular request, while the Desktop BFF can serve rich, complex layouts",
            "Because mobile phones cannot parse JSON",
            "To charge mobile users more money"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
              "errorExplanation": "BFFs optimize data payloads and network round-trips for specific client form factors.",
              "recoveryPath": {
                "simplerExplanation": "Tailors minimal payloads and batches calls for mobile clients.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d25-b2-api-gateway-cross-cutting-concerns",
        "day": 25,
        "blockNumber": 2,
        "title": "API Gateway Cross-Cutting Concerns: Auth, CORS, SSL & WAF",
        "conceptBudget": {
          "primaryConcept": "Gateway Cross-Cutting Concerns",
          "supportingTerms": [
            "JWT / OAuth2 token validation at edge",
            "CORS Pre-Flight handling (`OPTIONS`)",
            "SSL/TLS Offloading",
            "Web Application Firewall (WAF) SQLi / XSS filtering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d25-b1-bff-pattern-mobile-vs-web",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gateway_pipeline_demo.js",
            "initialCode": "function executeGatewayEdgePipeline(req) {\n  const steps = [\n    '1. WAF: Inspect SQLi / XSS payloads',\n    '2. TLS Offloading & HTTP/2 termination',\n    '3. JWT Authentication & Scope Verification',\n    '4. Rate Limiting Check',\n    '5. Forward to Internal Microservice'\n  ];\n  return steps;\n}\n\nconsole.log(executeGatewayEdgePipeline({}).join('\\n'));",
            "expectedOutput": "1. WAF: Inspect SQLi / XSS payloads\n2. TLS Offloading & HTTP/2 termination\n3. JWT Authentication & Scope Verification\n4. Rate Limiting Check\n5. Forward to Internal Microservice",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Step 3 in the standardized API gateway edge pipeline?",
          "expectedStringOutput": "3. JWT Authentication & Scope Verification",
          "acceptableAnswers": [
            "3. JWT Authentication & Scope Verification",
            "JWT Authentication",
            "Step 3: JWT Authentication & Scope Verification"
          ],
          "primaryMisconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
          "diagnosisMap": {
            "Rate Limiting": {
              "misconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
              "errorExplanation": "Step 3 is JWT Authentication & Scope Verification. Step 4 is Rate Limiting.",
              "recoveryPath": {
                "simplerExplanation": "Step 3 is JWT Authentication & Scope Verification.",
                "guidedFixPrompt": "Type 3. JWT Authentication & Scope Verification"
              }
            }
          }
        }
      },
      {
        "id": "dist-d25-b3-graphql-federation-gateways",
        "day": 25,
        "blockNumber": 3,
        "title": "GraphQL Federation: Apollo Router & Subgraph Stitching",
        "conceptBudget": {
          "primaryConcept": "GraphQL Federation",
          "supportingTerms": [
            "Apollo Federation Router (Rust-based supergraph router)",
            "Entity Types (`@key(fields: \"id\")`)",
            "Combining separate subgraph schemas into a single unified GraphQL endpoint"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d25-b2-api-gateway-cross-cutting-concerns",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "graphql_federation_demo.js",
            "initialCode": "function explainFederationEntity() {\n  return 'Apollo Router queries Users Subgraph and Orders Subgraph concurrently, stitching the unified GraphQL response at the edge.';\n}\n\nconsole.log(explainFederationEntity());",
            "expectedOutput": "Apollo Router queries Users Subgraph and Orders Subgraph concurrently, stitching the unified GraphQL response at the edge.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does GraphQL Federation allow independent engineering teams to manage their own microservice APIs while presenting a single GraphQL schema to clients?",
          "options": [
            "Each team develops and deploys an autonomous Subgraph service defining its domain entities; an Apollo Federation Router composes these subgraphs into a single unified Supergraph at runtime",
            "By merging all code into 1 giant single-file PHP script",
            "By replacing GraphQL with HTML"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_API_GATEWAY_BFF_BACKEND_FOR_FRONTEND",
              "errorExplanation": "Federation composes autonomous subgraphs into a unified supergraph.",
              "recoveryPath": {
                "simplerExplanation": "Composes autonomous subgraphs into a unified supergraph.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Distributed Tracing: OpenTelemetry, W3C TraceContext & Span Propagation",
    "overviewMetaphor": "Distributed Tracing is a FedEx tracking barcode stamped on a shipping box: when a user clicks \"Checkout\", the API Gateway stamps a unique 32-character Barcode (`traceId: 4bf92f...`) onto the request header (`traceparent`); as the request flows through Auth Service $\\to$ Order Service $\\to$ Payment Service $\\to$ Database, every microservice stamps its own child sub-ticket (`spanId`) linked to the master Barcode, allowing engineers to visualize the exact millisecond timeline in Jaeger or Datadog.",
    "blocks": [
      {
        "id": "dist-d26-b1-w3c-tracecontext-format",
        "day": 26,
        "blockNumber": 1,
        "title": "W3C TraceContext Standard & `traceparent` Header Specification",
        "conceptBudget": {
          "primaryConcept": "W3C TraceContext Specification",
          "supportingTerms": [
            "`traceparent: 00-${traceId}-${parentId}-${traceFlags}`",
            "Version (00)",
            "Trace ID (32 hex characters: 16 bytes)",
            "Parent Span ID (16 hex characters: 8 bytes)",
            "Trace Flags (01 = Sampled)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "W3C traceparent Header Anatomy",
            "codeSnippet": "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n//            │  └──────────────┬───────────────┘ └───────┬──────┘ └─┬┘\n//         Version        32-Hex Trace ID          16-Hex Span ID  Sampled Flag",
            "lineNotes": {
              "1": "Global standard adopted across OpenTelemetry, Envoy, AWS X-Ray, and Datadog."
            }
          },
          {
            "type": "runnable_code",
            "filename": "traceparent_parser_demo.js",
            "initialCode": "function parseTraceparent(header) {\n  const [version, traceId, parentSpanId, flags] = header.split('-');\n  return {\n    version,\n    traceId,\n    parentSpanId,\n    isSampled: flags === '01'\n  };\n}\n\nconst h = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';\nconsole.log(JSON.stringify(parseTraceparent(h)));",
            "expectedOutput": "{\"version\":\"00\",\"traceId\":\"4bf92f3577b34da6a3ce929d0e0e4736\",\"parentSpanId\":\"00f067aa0ba902b7\",\"isSampled\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 32-character hex `traceId` extracted from the traceparent header above?",
          "expectedStringOutput": "4bf92f3577b34da6a3ce929d0e0e4736",
          "acceptableAnswers": [
            "4bf92f3577b34da6a3ce929d0e0e4736",
            "traceId\":\"4bf92f3577b34da6a3ce929d0e0e4736\""
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
          "diagnosisMap": {
            "00f067aa0ba902b7": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
              "errorExplanation": "00f067aa0ba902b7 is the 16-hex parentSpanId. The 32-hex traceId is 4bf92f3577b34da6a3ce929d0e0e4736.",
              "recoveryPath": {
                "simplerExplanation": "traceId is 4bf92f3577b34da6a3ce929d0e0e4736.",
                "guidedFixPrompt": "Type 4bf92f3577b34da6a3ce929d0e0e4736"
              }
            }
          }
        }
      },
      {
        "id": "dist-d26-b2-opentelemetry-span-lifecycle",
        "day": 26,
        "blockNumber": 2,
        "title": "OpenTelemetry (OTel) Span Lifecycle & Context Propagation",
        "conceptBudget": {
          "primaryConcept": "OTel Span Lifecycle",
          "supportingTerms": [
            "Tracer (`tracer.startSpan('checkout_handler')`)",
            "Span Attributes (`http.status_code`, `db.statement`, `user.id`)",
            "Span Events & Error Status (`span.setStatus({ code: SpanStatusCode.ERROR })`)",
            "Span Ending (`span.end()`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d26-b1-w3c-tracecontext-format",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "otel_span_demo.js",
            "initialCode": "function createOtelSpan(name, traceId, parentSpanId) {\n  const spanId = Math.random().toString(16).substr(2, 16).padEnd(16, '0');\n  return {\n    name,\n    traceId,\n    spanId,\n    parentSpanId,\n    startTime: Date.now(),\n    attributes: { 'service.name': 'order-service', 'http.method': 'POST' }\n  };\n}\n\nconst span = createOtelSpan('process_payment', 'trace_9981', 'span_root');\nconsole.log('Span Name:', span.name);\nconsole.log('Parent Span ID:', span.parentSpanId);",
            "expectedOutput": "Span Name: process_payment\nParent Span ID: span_root",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the parent span ID of the child span created above?",
          "expectedStringOutput": "span_root",
          "acceptableAnswers": [
            "span_root",
            "Parent Span ID: span_root"
          ],
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
          "diagnosisMap": {
            "trace_9981": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
              "errorExplanation": "trace_9981 is the traceId. parentSpanId is span_root.",
              "recoveryPath": {
                "simplerExplanation": "parentSpanId is span_root.",
                "guidedFixPrompt": "Type span_root"
              }
            }
          }
        }
      },
      {
        "id": "dist-d26-b3-tail-based-sampling-cost-control",
        "day": 26,
        "blockNumber": 3,
        "title": "Tail-Based Sampling: Capturing 100% of Errors at Low Ingestion Cost",
        "conceptBudget": {
          "primaryConcept": "Tail-Based Sampling",
          "supportingTerms": [
            "Head-Based Sampling (Deciding to trace at edge with 1% random dice roll: misses rare production errors!)",
            "Tail-Based Sampling (Buffering all spans until trace finishes $\\to$ Retaining 100% of HTTP 500 errors and slow P99 traces while discarding fast 200 OKs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d26-b2-opentelemetry-span-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tail_sampling_demo.js",
            "initialCode": "function evaluateTailSampling(httpStatus, durationMs) {\n  if (httpStatus >= 500) return 'RETAIN_TRACE_100_PERCENT (Error occurred!)';\n  if (durationMs > 1000) return 'RETAIN_TRACE_100_PERCENT (Slow P99 anomaly!)';\n  return 'DROP_FAST_HEALTHY_TRACE (Save 95% storage cost)';\n}\n\nconsole.log('HTTP 500 Internal Error (15ms):', evaluateTailSampling(500, 15));\nconsole.log('HTTP 200 Fast Success (5ms):', evaluateTailSampling(200, 5));",
            "expectedOutput": "HTTP 500 Internal Error (15ms): RETAIN_TRACE_100_PERCENT (Error occurred!)\nHTTP 200 Fast Success (5ms): DROP_FAST_HEALTHY_TRACE (Save 95% storage cost)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Tail-Based Sampling superior to Head-Based Sampling in production OpenTelemetry observability pipelines?",
          "options": [
            "Because Tail-Based Sampling inspects the completed trace before deciding whether to retain it, guaranteeing that 100% of rare errors (HTTP 500) and slow latency spikes (> 1s) are stored for debugging while discarding 95% of uninteresting fast successful traces",
            "Because Tail-Based Sampling disables all telemetry collection",
            "Because Head-Based Sampling is unsupported in Linux"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DISTRIBUTED_TRACING_OPENTELEMETRY_TRACEPARENT",
              "errorExplanation": "Tail-based sampling guarantees capture of all errors and outliers while optimizing storage costs.",
              "recoveryPath": {
                "simplerExplanation": "Captures 100% of errors and outliers while discarding repetitive healthy traces.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Data Consistency Models: Linearizable vs Sequential vs Eventual Consistency",
    "overviewMetaphor": "Consistency Models are live sports broadcasts: Strict Linearizability is sitting physically in the front row of the stadium (You see the goal the exact millisecond the ball crosses the goal line); Sequential Consistency is watching a video replay on YouTube (The video might be delayed by 2 hours, but every play happens in the exact correct sequence); Eventual Consistency is reading the sports score in tomorrow morning's newspaper.",
    "blocks": [
      {
        "id": "dist-d27-b1-linearizability-strict-ordering",
        "day": 27,
        "blockNumber": 1,
        "title": "Linearizability (External Consistency): Real-Time Global Ordering",
        "conceptBudget": {
          "primaryConcept": "Linearizable Consistency (Maurice Herlihy & Jeannette Wing)",
          "supportingTerms": [
            "Linearizability / Strict Serializability",
            "Real-Time Invariant: If write $W$ completes at physical time $T_1$, any read $R$ starting at $T_2 > T_1$ MUST return $W$ or a newer write",
            "Zero stale reads permitted across any node"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d16-b1-ntp-drift-and-spanner-true-time",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Consistency Model Spectrum",
              "boxes": [
                {
                  "label": "1. Linearizable (Strongest)",
                  "value": "Global real-time clock order | Zero stale reads | Higher latency & CP partition sensitivity",
                  "varType": "Strongest",
                  "isUpdated": true
                },
                {
                  "label": "2. Sequential Consistency",
                  "value": "All nodes observe same operation order | Operations may be delayed from physical real time",
                  "varType": "Order Preserved",
                  "isUpdated": false
                },
                {
                  "label": "3. Eventual Consistency",
                  "value": "Replicas converge after write traffic stops | Reads may return stale data in the interim",
                  "varType": "High Availability",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "linearizable_demo.js",
            "initialCode": "function evaluateLinearizability(writeCompletedAt, readStartedAt, readObservedWrite) {\n  if (readStartedAt > writeCompletedAt && !readObservedWrite) {\n    return 'VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED';\n  }\n  return 'LINEARIZABLE_CONSISTENCY_SATISFIED';\n}\n\nconsole.log(evaluateLinearizability(100, 105, true));\nconsole.log(evaluateLinearizability(100, 105, false));",
            "expectedOutput": "LINEARIZABLE_CONSISTENCY_SATISFIED\nVIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is flagged when a read operation starting at 105ms fails to observe a write that completed at 100ms?",
          "expectedStringOutput": "VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED",
          "acceptableAnswers": [
            "VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED",
            "NON_LINEARIZABLE_STALE_READ_DETECTED"
          ],
          "primaryMisconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
          "diagnosisMap": {
            "SATISFIED": {
              "misconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
              "errorExplanation": "Missing a completed write after start time violates linearizability.",
              "recoveryPath": {
                "simplerExplanation": "Flags VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED.",
                "guidedFixPrompt": "Type VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED"
              }
            }
          }
        }
      },
      {
        "id": "dist-d27-b2-causal-consistency-session-models",
        "day": 27,
        "blockNumber": 2,
        "title": "Causal Consistency: The Strongest Consistency Model Available under AP",
        "conceptBudget": {
          "primaryConcept": "Causal Consistency (Mahajan et al.)",
          "supportingTerms": [
            "Causally related events must be seen by every node in the same order",
            "Concurrent unrelated events can be seen in different orders",
            "Provably the strongest consistency model achievable in an Available (AP) partition-tolerant system"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d27-b1-linearizability-strict-ordering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "causal_model_demo.js",
            "initialCode": "function evaluateCausalOrdering(isCausallyRelated, orderPreserved) {\n  if (isCausallyRelated && !orderPreserved) return 'CAUSAL_CONSISTENCY_VIOLATION';\n  return 'CAUSAL_CONSISTENCY_SATISFIED';\n}\n\nconsole.log('Causal link preserved:', evaluateCausalOrdering(true, true));\nconsole.log('Causal link inverted:', evaluateCausalOrdering(true, false));",
            "expectedOutput": "Causal link preserved: CAUSAL_CONSISTENCY_SATISFIED\nCausal link inverted: CAUSAL_CONSISTENCY_VIOLATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Causal Consistency considered a major milestone in distributed systems theory?",
          "options": [
            "Because it is mathematically proven to be the strongest possible consistency model that can remain 100% Available during network partitions (CAP theorem AP boundary), preserving cause-and-effect without requiring global physical time synchronization",
            "Because it runs without RAM",
            "Because it only works on single-core CPUs"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
              "errorExplanation": "Causal consistency is the strongest model achievable while maintaining AP availability.",
              "recoveryPath": {
                "simplerExplanation": "Strongest consistency model possible under 100% AP availability.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dist-d27-b3-eventual-consistency-convergence",
        "day": 27,
        "blockNumber": 3,
        "title": "Eventual Consistency: Anti-Entropy Background Synchronization",
        "conceptBudget": {
          "primaryConcept": "Eventual Consistency Anti-Entropy",
          "supportingTerms": [
            "Anti-Entropy background gossip replication",
            "Merkle Trees (Cryptographic hash trees for rapid replica difference detection)",
            "Eventual convergence guarantee"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d27-b2-causal-consistency-session-models",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "anti_entropy_demo.js",
            "initialCode": "function checkMerkleSync(treeHashA, treeHashB) {\n  return treeHashA === treeHashB \n    ? 'REPLICAS_100_PERCENT_SYNCHRONIZED (Zero data transfer needed)'\n    : 'DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY';\n}\n\nconsole.log(checkMerkleSync('hash_abc', 'hash_abc'));\nconsole.log(checkMerkleSync('hash_abc', 'hash_xyz'));",
            "expectedOutput": "REPLICAS_100_PERCENT_SYNCHRONIZED (Zero data transfer needed)\nDIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by anti-entropy background synchronization when Merkle tree root hashes differ between two storage replicas?",
          "expectedStringOutput": "DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY",
          "acceptableAnswers": [
            "DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY",
            "Sync diff keys only"
          ],
          "primaryMisconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
          "diagnosisMap": {
            "SYNC_ALL": {
              "misconceptionId": "MC_DIST_DATA_CONSISTENCY_EVENTUAL_READ_COMMITTED_LINEARIZABLE",
              "errorExplanation": "Merkle trees isolate exact differing branches, syncing diff keys only.",
              "recoveryPath": {
                "simplerExplanation": "Merkle trees sync differing keys only: DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY.",
                "guidedFixPrompt": "Type DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Reverse Proxies & CDN Edge Caching with Cache-Control Invalidation",
    "overviewMetaphor": "A CDN (Content Delivery Network) is a local convenience store in every neighborhood: instead of every person on Earth driving to the central factory in Japan to buy a carton of milk (Origin server in Tokyo: 200ms latency), the factory ships milk crates to 300 neighborhood stores worldwide (Edge PoPs in London, New York, Mumbai: 5ms latency); `stale-while-revalidate` serves the milk carton in 5ms while ordering a fresh replacement in the background.",
    "blocks": [
      {
        "id": "dist-d28-b1-http-cache-control-headers",
        "day": 28,
        "blockNumber": 1,
        "title": "HTTP Cache-Control Directives: `s-maxage`, `stale-while-revalidate` & `immutable`",
        "conceptBudget": {
          "primaryConcept": "CDN Cache-Control Directives",
          "supportingTerms": [
            "`max-age` (Browser cache duration)",
            "`s-maxage` (Shared CDN edge cache duration, overrides max-age)",
            "`stale-while-revalidate=N` (Serves stale asset instantly while fetching fresh version in background)",
            "`immutable` (Asset with content hash URL never changes; zero revalidation queries)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d5-b1-caching-patterns-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production Cache-Control Header Anatomy",
            "codeSnippet": "Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=60, immutable\n//               │           │             │                    │                      └─ Never revalidate\n//            Public      Browser 60s    CDN Edge 1h    Serve stale + bg revalidate 60s",
            "lineNotes": {
              "1": "Optimal recipe for static web bundles, Next.js assets, and product catalog pages."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cdn_cache_eval_demo.js",
            "initialCode": "function evaluateEdgeHit(ageSec, sMaxAgeSec = 3600, swrSec = 60) {\n  if (ageSec <= sMaxAgeSec) return 'EDGE_CACHE_HIT_FRESH (2ms)';\n  if (ageSec <= (sMaxAgeSec + swrSec)) return 'EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)';\n  return 'EDGE_CACHE_MISS_SYNC_ORIGIN_FETCH (150ms)';\n}\n\nconsole.log('Age 100s:', evaluateEdgeHit(100));\nconsole.log('Age 3630s:', evaluateEdgeHit(3630));\nconsole.log('Age 5000s:', evaluateEdgeHit(5000));",
            "expectedOutput": "Age 100s: EDGE_CACHE_HIT_FRESH (2ms)\nAge 3630s: EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)\nAge 5000s: EDGE_CACHE_MISS_SYNC_ORIGIN_FETCH (150ms)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cache status is returned at age 3,630s (when s-maxage=3600 and stale-while-revalidate=60)?",
          "expectedStringOutput": "EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)",
          "acceptableAnswers": [
            "EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)",
            "STALE_WHILE_REVALIDATING",
            "Age 3630s: EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)"
          ],
          "primaryMisconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
          "diagnosisMap": {
            "MISS": {
              "misconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
              "errorExplanation": "3630s is within s-maxage + SWR window (3660s), serving stale while revalidating.",
              "recoveryPath": {
                "simplerExplanation": "Falls within SWR window -> EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING.",
                "guidedFixPrompt": "Type EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)"
              }
            }
          }
        }
      },
      {
        "id": "dist-d28-b2-surrogate-key-cache-purges",
        "day": 28,
        "blockNumber": 2,
        "title": "Surrogate Keys (Cache-Tags) & Targeted Instant Purges",
        "conceptBudget": {
          "primaryConcept": "Surrogate Key Cache Purges",
          "supportingTerms": [
            "Surrogate-Key / Cache-Tag header (`Surrogate-Key: product-101 author-42`)",
            "Targeted Purge API (Purging 1,000 pages tagged `author-42` in 150ms globally without wiping entire CDN cache)",
            "Soft Purge (Marks stale for SWR) vs Hard Purge"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d28-b1-http-cache-control-headers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "surrogate_purge_demo.js",
            "initialCode": "function purgeBySurrogateTag(tag, cdnCache) {\n  let purgedCount = 0;\n  for (const [url, tags] of Object.entries(cdnCache)) {\n    if (tags.includes(tag)) {\n      delete cdnCache[url];\n      purgedCount++;\n    }\n  }\n  return `Purged ${purgedCount} edge assets matching tag '${tag}' globally in 120ms.`;\n}\n\nconst edgeStore = {\n  '/products/101': ['product-101', 'category-electronics'],\n  '/products/102': ['product-102', 'category-electronics'],\n  '/products/201': ['product-201', 'category-clothing']\n};\n\nconsole.log(purgeBySurrogateTag('category-electronics', edgeStore));",
            "expectedOutput": "Purged 2 edge assets matching tag 'category-electronics' globally in 120ms.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many edge assets are purged when issuing a purge for tag `category-electronics` across the store above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 edge assets",
            "Purged 2 edge assets matching tag 'category-electronics' globally in 120ms."
          ],
          "primaryMisconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
              "errorExplanation": "Only 2 products share the 'category-electronics' tag.",
              "recoveryPath": {
                "simplerExplanation": "Purges 2 matching assets.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dist-d28-b3-anycast-routing-dns-geo",
        "day": 28,
        "blockNumber": 3,
        "title": "BGP Anycast Routing: Connecting Users to Nearest Edge PoP",
        "conceptBudget": {
          "primaryConcept": "BGP Anycast Routing",
          "supportingTerms": [
            "BGP Anycast (Same IP address announced from 300+ datacenters worldwide)",
            "Internet BGP routers route packets to physically closest PoP via shortest AS path",
            "Instant DDoS absorption & Regional isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d28-b2-surrogate-key-cache-purges",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "anycast_demo.js",
            "initialCode": "function routeAnycast(userLocation) {\n  if (userLocation === 'LONDON') return { pop: 'LHR_EDGE_DATACENTER', latencyMs: 4 };\n  if (userLocation === 'NEW_YORK') return { pop: 'JFK_EDGE_DATACENTER', latencyMs: 3 };\n  return { pop: 'GLOBAL_ANYCAST_DEFAULT', latencyMs: 15 };\n}\n\nconsole.log('London User:', JSON.stringify(routeAnycast('LONDON')));\nconsole.log('New York User:', JSON.stringify(routeAnycast('NEW_YORK')));",
            "expectedOutput": "London User: {\"pop\":\"LHR_EDGE_DATACENTER\",\"latencyMs\":4}\nNew York User: {\"pop\":\"JFK_EDGE_DATACENTER\",\"latencyMs\":3}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does BGP Anycast allow global CDN providers (like Cloudflare and Fastly) to deliver sub-10ms response times worldwide under a single IP address?",
          "options": [
            "Multiple datacenters worldwide broadcast the exact same public IP address into internet BGP routing tables, allowing internet service providers to automatically route each user's packets to the geographically closest edge datacenter",
            "By burying fiber optic cables under every user's house",
            "By disabling TCP handshakes"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_REVERSE_PROXY_CDN_EDGE_CACHING_PURGE",
              "errorExplanation": "BGP Anycast announces 1 IP globally, routing users to the nearest physical PoP.",
              "recoveryPath": {
                "simplerExplanation": "BGP routes packets to the nearest PoP sharing the same IP.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Disaster Recovery: Multi-Region Active-Passive vs Active-Active Deployments",
    "overviewMetaphor": "Disaster Recovery is a backup electrical generator for a hospital: Active-Passive (Warm Standby) keeps a generator in the basement turned OFF; when a city blackout hits (Region outage), technicians spend 15 minutes starting the generator (RTO: Recovery Time Objective: 15 minutes; RPO: Recovery Point Objective: 2 minutes of lost telemetry); Active-Active keeps two identical hospitals running simultaneously across two cities, routing ambulances automatically if one hospital suffers a blackout (Zero RTO, Zero RPO, but higher cross-region sync cost).",
    "blocks": [
      {
        "id": "dist-d29-b1-rpo-rto-disaster-metrics",
        "day": 29,
        "blockNumber": 1,
        "title": "Disaster Recovery SLA Fundamentals: RPO (Data Loss) vs RTO (Downtime)",
        "conceptBudget": {
          "primaryConcept": "RPO and RTO DR Metrics",
          "supportingTerms": [
            "Recovery Point Objective (RPO: Maximum acceptable data loss duration, e.g. RPO = 5 minutes)",
            "Recovery Time Objective (RTO: Maximum acceptable downtime duration before system restores, e.g. RTO = 15 minutes)",
            "The 4 DR Strategies: Backup & Restore $\\to$ Pilot Light $\\to$ Warm Standby $\\to$ Multi-Region Active-Active"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d1-b1-eight-fallacies-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Disaster Recovery Strategy Continuum",
              "boxes": [
                {
                  "label": "1. Backup & Restore",
                  "value": "RPO: 24 Hours | RTO: Hours to Days | Cost: $\\$ \\to$ Lowest cost",
                  "varType": "Basic",
                  "isUpdated": false
                },
                {
                  "label": "2. Pilot Light",
                  "value": "RPO: Minutes | RTO: 30-60 Minutes | Cost: $\\$\\$ \\to$ Core DB replicated",
                  "varType": "Moderate",
                  "isUpdated": false
                },
                {
                  "label": "3. Warm Standby (Active-Passive)",
                  "value": "RPO: Seconds | RTO: Minutes | Cost: $\\$\\$\\$ \\to$ Scaled-down replica",
                  "varType": "High Availability",
                  "isUpdated": false
                },
                {
                  "label": "4. Multi-Region Active-Active",
                  "value": "RPO: ~0 | RTO: ~0 (Instant Anycast failover) | Cost: $\\$\\$\\$\\$\\$ \\to$ Enterprise Financial",
                  "varType": "Mission Critical",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dr_strategy_eval_demo.js",
            "initialCode": "function evaluateDrTier(rpoMinutes, rtoMinutes) {\n  if (rpoMinutes === 0 && rtoMinutes === 0) return 'MULTI_REGION_ACTIVE_ACTIVE';\n  if (rpoMinutes <= 1 && rtoMinutes <= 5) return 'ACTIVE_PASSIVE_WARM_STANDBY';\n  if (rpoMinutes <= 15 && rtoMinutes <= 60) return 'PILOT_LIGHT';\n  return 'BACKUP_AND_RESTORE';\n}\n\nconsole.log('Zero Downtime Tier:', evaluateDrTier(0, 0));\nconsole.log('1 min RPO, 5 min RTO:', evaluateDrTier(1, 5));",
            "expectedOutput": "Zero Downtime Tier: MULTI_REGION_ACTIVE_ACTIVE\n1 min RPO, 5 min RTO: ACTIVE_PASSIVE_WARM_STANDBY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which DR tier is required for a mission-critical financial exchange demanding 0 minute RPO and 0 minute RTO?",
          "expectedStringOutput": "MULTI_REGION_ACTIVE_ACTIVE",
          "acceptableAnswers": [
            "MULTI_REGION_ACTIVE_ACTIVE",
            "Active-Active",
            "Zero Downtime Tier: MULTI_REGION_ACTIVE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
          "diagnosisMap": {
            "WARM_STANDBY": {
              "misconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
              "errorExplanation": "Zero RPO and zero RTO requires MULTI_REGION_ACTIVE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Zero downtime requires MULTI_REGION_ACTIVE_ACTIVE.",
                "guidedFixPrompt": "Type MULTI_REGION_ACTIVE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "dist-d29-b2-active-active-conflict-resolution",
        "day": 29,
        "blockNumber": 2,
        "title": "Multi-Region Active-Active: Cross-Region Conflict Resolution",
        "conceptBudget": {
          "primaryConcept": "Active-Active Conflict Resolution",
          "supportingTerms": [
            "Bi-directional cross-region replication (AWS DynamoDB Global Tables / Aurora Multi-Region)",
            "Last-Write-Wins (LWW) conflict resolution",
            "CRDT merge lattices for concurrent writes across continents"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d29-b1-rpo-rto-disaster-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cross_region_sim.js",
            "initialCode": "function resolveCrossRegionWrite(usEastWrite, euWestWrite) {\n  if (usEastWrite.timestamp > euWestWrite.timestamp) {\n    return { winner: 'US_EAST', data: usEastWrite.data, rule: 'LAST_WRITE_WINS' };\n  }\n  return { winner: 'EU_WEST', data: euWestWrite.data, rule: 'LAST_WRITE_WINS' };\n}\n\nconst w1 = { data: 'Status: VIP', timestamp: 1700000000500 };\nconst w2 = { data: 'Status: Regular', timestamp: 1700000000200 };\nconsole.log(JSON.stringify(resolveCrossRegionWrite(w1, w2)));",
            "expectedOutput": "{\"winner\":\"US_EAST\",\"data\":\"Status: VIP\",\"rule\":\"LAST_WRITE_WINS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which region's write wins in the cross-region LWW conflict resolution above?",
          "expectedStringOutput": "US_EAST",
          "acceptableAnswers": [
            "US_EAST",
            "winner\":\"US_EAST\""
          ],
          "primaryMisconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
          "diagnosisMap": {
            "EU_WEST": {
              "misconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
              "errorExplanation": "US_EAST has higher timestamp (500ms > 200ms) and wins under LWW.",
              "recoveryPath": {
                "simplerExplanation": "Higher timestamp wins -> US_EAST.",
                "guidedFixPrompt": "Type US_EAST"
              }
            }
          }
        }
      },
      {
        "id": "dist-d29-b3-chaos-engineering-game-days",
        "day": 29,
        "blockNumber": 3,
        "title": "Chaos Engineering & Game Days: Validating Failover under Fire",
        "conceptBudget": {
          "primaryConcept": "Chaos Engineering & Failover Validation",
          "supportingTerms": [
            "Principles of Chaos Engineering (Netflix Chaos Monkey / Chaos Kong)",
            "Injecting simulated region outages in staging/production",
            "Validating automated DNS failover and circuit breaker behavior"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d29-b2-active-active-conflict-resolution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "chaos_game_day_demo.js",
            "initialCode": "function executeChaosExperiment(experimentType) {\n  if (experimentType === 'REGION_OUTAGE_SIMULATION') {\n    return {\n      action: 'KILL_ALL_INSTANCES_IN_US_EAST_1',\n      expectedOutcome: 'ANYCAST_FAILS_OVER_TO_US_WEST_2_IN_3000MS',\n      passed: true\n    };\n  }\n  return { passed: false };\n}\n\nconsole.log(JSON.stringify(executeChaosExperiment('REGION_OUTAGE_SIMULATION')));",
            "expectedOutput": "{\"action\":\"KILL_ALL_INSTANCES_IN_US_EAST_1\",\"expectedOutcome\":\"ANYCAST_FAILS_OVER_TO_US_WEST_2_IN_3000MS\",\"passed\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do high-scale technology enterprises run scheduled Chaos Engineering Game Days (like intentionally killing entire AWS regions)?",
          "options": [
            "To proactively prove that automated failover mechanisms, circuit breakers, and cross-region replication work correctly under realistic failure conditions before real unexpected hardware disasters happen",
            "To destroy company data",
            "Because cloud servers need to be rebooted daily"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DIST_DISASTER_RECOVERY_MULTI_REGION_ACTIVE_ACTIVE",
              "errorExplanation": "Chaos experiments validate automated failover before real outages occur.",
              "recoveryPath": {
                "simplerExplanation": "Proves automated failover systems work before real emergencies.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Global Real-Time Financial Trading & Ledger Exchange Engine",
    "overviewMetaphor": "The Final Capstone Synthesis: The complete, battle-tested distributed financial exchange engine: 1. Global Anycast Edge receives trading orders; 2. Token Bucket Rate Limiting admits orders within tier quotas; 3. Consistent Hashing routes orders to assigned trading partitions; 4. Distributed Lock with Monotonic Fencing Tokens prevents double-spending; 5. Raft Consensus replicates trade journals across multi-region quorums; 6. Singleflight Caching serves real-time market data in 1ms; 7. OpenTelemetry distributed tracing captures every microsecond end-to-end.",
    "blocks": [
      {
        "id": "dist-d30-b1-capstone-architecture-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Trading Engine Distributed Architecture Synthesis",
        "conceptBudget": {
          "primaryConcept": "Capstone Financial Engine Architecture",
          "supportingTerms": [
            "Perimeter API Gateway",
            "Consistent Hash Ring Partitioning",
            "Raft Consensus Log Replication",
            "Monotonic Fencing Tokens",
            "Distributed Ledger Storage"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d29-b1-rpo-rto-disaster-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End Financial Exchange Trading Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "Client places Trade Order -> Anycast Edge & Token Bucket Rate Limiter",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Consistent Hash Ring routes Order to Account Partition Node",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Acquires Distributed Lock with Monotonic Fencing Token (Guard against GC pause)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Raft Consensus replicates trade log across 3/5 Majority Quorum",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Commits to Immutable Ledger -> Releases Lock -> Returns 200 OK Trade Receipt! (100% Certified)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_exchange_sim.js",
            "initialCode": "async function runCapstoneExchangeEngine(order) {\n  return {\n    orderId: order.id,\n    gatewayStatus: 'EDGE_ADMITTED',\n    routingPartition: 'PARTITION_7',\n    fencingTokenAssigned: 104289,\n    consensusReplication: 'RAFT_QUORUM_COMMITTED (3 of 5 nodes)',\n    ledgerStatus: 'IMMUTABLE_TRADE_RECORDED',\n    executionStatus: 'CAPSTONE_FINANCIAL_ENGINE_SUCCESS'\n  };\n}\n\nrunCapstoneExchangeEngine({ id: 'trade_9981' }).then(res => {\n  console.log('Execution Status:', res.executionStatus);\n  console.log('Consensus:', res.consensusReplication);\n});",
            "expectedOutput": "Execution Status: CAPSTONE_FINANCIAL_ENGINE_SUCCESS\nConsensus: RAFT_QUORUM_COMMITTED (3 of 5 nodes)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What execution status is returned upon completing the end-to-end distributed trade lifecycle?",
          "expectedStringOutput": "CAPSTONE_FINANCIAL_ENGINE_SUCCESS",
          "acceptableAnswers": [
            "CAPSTONE_FINANCIAL_ENGINE_SUCCESS",
            "Execution Status: CAPSTONE_FINANCIAL_ENGINE_SUCCESS"
          ],
          "primaryMisconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
              "errorExplanation": "Matches CAPSTONE_FINANCIAL_ENGINE_SUCCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches CAPSTONE_FINANCIAL_ENGINE_SUCCESS.",
                "guidedFixPrompt": "Type CAPSTONE_FINANCIAL_ENGINE_SUCCESS"
              }
            }
          }
        }
      },
      {
        "id": "dist-d30-b2-trading-sla-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Trading Engine SLA Audit: Throughput, Latency & Consistency Validation",
        "conceptBudget": {
          "primaryConcept": "Trading Engine Performance SLA",
          "supportingTerms": [
            "Throughput: 100,000 trades/second",
            "P99.9 Execution Latency: < 5ms",
            "Linearizable Consistency Invariant: 100%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d30-b1-capstone-architecture-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_sla_audit.js",
            "initialCode": "function auditCapstoneSla(tps, p99Ms, consistencyPercent) {\n  const passed = tps >= 100000 && p99Ms <= 5.0 && consistencyPercent === 100;\n  return {\n    tradesPerSecond: tps,\n    p99LatencyMs: p99Ms,\n    linearizability: `${consistencyPercent}%`,\n    grade: passed ? 'ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER' : 'SLA_BREACHED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSla(150000, 3.2, 100)));",
            "expectedOutput": "{\"tradesPerSecond\":150000,\"p99LatencyMs\":3.2,\"linearizability\":\"100%\",\"grade\":\"ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master grade is awarded upon achieving 150,000 TPS, 3.2ms P99 latency, and 100% linearizability?",
          "expectedStringOutput": "ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER",
          "acceptableAnswers": [
            "ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER",
            "grade\":\"ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER\""
          ],
          "primaryMisconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
          "diagnosisMap": {
            "BREACHED": {
              "misconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
              "errorExplanation": "All metrics exceed SLAs, awarding ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER.",
                "guidedFixPrompt": "Type ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER"
              }
            }
          }
        }
      },
      {
        "id": "dist-d30-b3-capstone-distributed-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Distributed Systems & High-Scale Architecture Master Certification",
        "conceptBudget": {
          "primaryConcept": "Distributed Systems Master Certification",
          "supportingTerms": [
            "High-Scale Distributed Systems Architect Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dist-d30-b2-trading-sla-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_dist_final_cert.js",
            "initialCode": "console.log('🏆 30-DAY DISTRIBUTED SYSTEMS & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]');",
            "expectedOutput": "🏆 30-DAY DISTRIBUTED SYSTEMS & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final certification string confirms 100% completion of the High-Scale Distributed Systems course?",
          "expectedStringOutput": "🏆 30-DAY DISTRIBUTED SYSTEMS & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]",
          "acceptableAnswers": [
            "🏆 30-DAY DISTRIBUTED SYSTEMS & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]",
            "100% COMPLETE"
          ],
          "primaryMisconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DIST_CAPSTONE_ENTERPRISE_GLOBAL_FINTECH_EXCHANGE_PLATFORM",
              "errorExplanation": "Matches final master certification string.",
              "recoveryPath": {
                "simplerExplanation": "Matches final string.",
                "guidedFixPrompt": "Type 🏆 30-DAY DISTRIBUTED SYSTEMS & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]"
              }
            }
          }
        }
      }
    ]
  }
];
