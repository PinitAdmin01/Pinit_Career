import type { SystemTopologySnapshot } from '../../components/interview/SystemDesignWhiteboard.js';

export interface ArchitectureEvaluationResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Work';
  scalabilityRating: number;
  reliabilityRating: number;
  strengths: string[];
  bottlenecks: string[];
  recommendations: string[];
  summary: string;
  spokenFeedback: string;
}

type TechArchetype =
  | 'realtime_streaming'
  | 'high_read_cache'
  | 'event_pipeline'
  | 'media_cdn'
  | 'transactional_acid'
  | 'iot_embedded_edge'
  | 'commerce_double_entry_ledger'
  | 'vector_search_rag'
  | 'low_latency_matching_exchange'
  | 'cybersecurity_zero_trust_mesh'
  | 'video_streaming_webrtc'
  | 'general_distributed';

interface RequirementRule {
  key: string;
  label: string;
  weight: number;
  matches: (n: { type: string; label: string; category?: string }) => boolean;
  bottleneckIfMissing: string;
  recommendationIfMissing: string;
}

function detectTechArchetype(topic: string): {
  archetype: TechArchetype;
  requirements: RequirementRule[];
} {
  const lower = topic.toLowerCase();

  if (/chat|message|messaging|notification|pubsub|pub-sub|websocket|socket|realtime|real-time/.test(lower)) {
    return {
      archetype: 'realtime_streaming',
      requirements: [
        {
          key: 'queue',
          label: 'Message Broker / Event Stream (Kafka / Queue)',
          weight: 12,
          matches: n => /kafka|queue|stream|event|pubsub|broker/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing message broker or event queue: Real-time fan-out will block synchronous compute nodes.',
          recommendationIfMissing: 'Add Kafka or a Message Queue to decouple real-time message broadcasting and notification fan-out.'
        },
        {
          key: 'cache',
          label: 'In-Memory State & Presence Cache (Redis)',
          weight: 10,
          matches: n => /redis|cache|memory|presence/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No low-latency session/presence cache: User presence and active socket lookups will overwhelm primary storage.',
          recommendationIfMissing: 'Deploy Redis for real-time connection state, transient presence tracking, and recent message caching.'
        },
        {
          key: 'gateway',
          label: 'API Gateway / WebSocket Ingress',
          weight: 8,
          matches: n => /gateway|load balancer|alb|ingress|proxy|cloudflare/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Direct client connection without gateway: Socket connection management and TLS termination are unmanaged.',
          recommendationIfMissing: 'Add an API Gateway or Load Balancer for WebSocket upgrade handling and traffic distribution.'
        },
        {
          key: 'database',
          label: 'Persistent Message Archive Database',
          weight: 8,
          matches: n => /db|postgres|sql|mongo|storage/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing persistent database: Historical chat records and user profiles cannot be reliably stored.',
          recommendationIfMissing: 'Attach a persistent Relational or Document database for durable message history.'
        }
      ]
    };
  }

  if (/video|media|asset|image|transcode|upload/.test(lower)) {
    return {
      archetype: 'media_cdn',
      requirements: [
        {
          key: 'cdn',
          label: 'Content Delivery Network (CDN / Cloudflare)',
          weight: 12,
          matches: n => /cdn|cloudflare|edge|cloudfront/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing Edge CDN: Media assets will be fetched directly from origin servers, creating bandwidth bottlenecks.',
          recommendationIfMissing: 'Place a CDN at the edge to cache and stream static video and heavy media files.'
        },
        {
          key: 'blob',
          label: 'Object Storage (S3 / Blob Storage)',
          weight: 12,
          matches: n => /blob|s3|storage|bucket|object/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing Object Storage: Video assets and heavy binaries cannot be durably stored in relational tables.',
          recommendationIfMissing: 'Add S3 / Blob Storage dedicated to raw uploads and transcoded chunks.'
        },
        {
          key: 'worker',
          label: 'Asynchronous Processing Worker (Transcoding / Encoding)',
          weight: 8,
          matches: n => /worker|cron|compute|transcode|process/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Synchronous media processing: Uploads will hang if video encoding runs directly inside request handlers.',
          recommendationIfMissing: 'Decouple video processing and thumbnail generation into an asynchronous Worker pipeline.'
        },
        {
          key: 'database',
          label: 'Metadata Database',
          weight: 6,
          matches: n => /db|postgres|sql/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No metadata storage: Video titles, views, and creator accounts cannot be persisted.',
          recommendationIfMissing: 'Add Postgres for relational user and catalog metadata.'
        }
      ]
    };
  }

  if (/data|analytics|pipeline|etl|warehouse|ingest|batch|log/.test(lower)) {
    return {
      archetype: 'event_pipeline',
      requirements: [
        {
          key: 'queue',
          label: 'Stream Ingestion (Kafka / Event Bus)',
          weight: 12,
          matches: n => /kafka|queue|stream|event|kinesis/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No ingestion buffer: Spikes in event telemetry will drop data without an upstream event bus.',
          recommendationIfMissing: 'Add Kafka to buffer high-velocity ingestion events.'
        },
        {
          key: 'worker',
          label: 'Batch / Stream Compute Worker',
          weight: 10,
          matches: n => /worker|cron|spark|compute|microservice/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing transformation worker: Raw ingestion data cannot be aggregated or parsed.',
          recommendationIfMissing: 'Introduce compute workers for stream aggregation and cleaning.'
        },
        {
          key: 'storage',
          label: 'Analytical Database or Data Lake',
          weight: 10,
          matches: n => /db|postgres|s3|blob|lake|warehouse/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No sink storage: Transformed events lack an analytics sink.',
          recommendationIfMissing: 'Store historical analytics in a Data Lake or columnar warehouse.'
        },
        {
          key: 'client',
          label: 'Data Source / Client Ingress',
          weight: 6,
          matches: n => /client|app|gateway|source/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No ingestion source or client defined.',
          recommendationIfMissing: 'Define explicit event producer or client source.'
        }
      ]
    };
  }

  if (/ledger|double[-_ ]entry|reconciliation|accounting|journal|balance[-_ ]sheet|fiscal/i.test(lower)) {
    return {
      archetype: 'commerce_double_entry_ledger',
      requirements: [
        {
          key: 'immutable_ledger',
          label: 'Immutable Financial Ledger (PostgreSQL Double-Entry DB)',
          weight: 12,
          matches: n => /ledger|postgres|db|sql|immutable|journal/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing immutable double-entry ledger: Financial transactions risk non-deterministic balance drift and audit failure.',
          recommendationIfMissing: 'Implement an append-only double-entry ledger table in PostgreSQL with strict Dr = Cr invariant constraints.'
        },
        {
          key: 'reconciliation_worker',
          label: 'Asynchronous Reconciliation Worker / Audit Job',
          weight: 10,
          matches: n => /worker|audit|reconciliation|cron|compute|service/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No asynchronous reconciliation worker: Settlement discrepancies and payment gateway drift cannot be detected or healed.',
          recommendationIfMissing: 'Add an automated Reconciliation Worker to compare ledger journal entries with payment gateway settlements.'
        },
        {
          key: 'idempotency_cache',
          label: 'Idempotency Key & Distributed Lock (Redis)',
          weight: 10,
          matches: n => /redis|cache|lock|idempotent/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No distributed lock or idempotency store: Network retries risk duplicate credit/debit transaction execution.',
          recommendationIfMissing: 'Deploy Redis for distributed lock acquisition and transaction idempotency key deduplication.'
        },
        {
          key: 'audit_storage',
          label: 'Tamper-Evident Audit Log Archive (S3 / Cold Storage)',
          weight: 8,
          matches: n => /s3|blob|audit|cold|lake|storage/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No immutable audit archive: Regulatory financial audit trails cannot be verified independently of the transactional database.',
          recommendationIfMissing: 'Stream signed ledger event logs into write-once Object Storage (S3 / Blob) for regulatory compliance.'
        }
      ]
    };
  }

  if (/iot|embedded|sensor|telemetry|firmware|device|mqtt|ble|hardware|gateway[-_ ]edge/i.test(lower)) {
    return {
      archetype: 'iot_embedded_edge',
      requirements: [
        {
          key: 'edge_gateway',
          label: 'IoT Edge Gateway / Ingestion Controller (MQTT / EMQX)',
          weight: 12,
          matches: n => /edge|gateway|broker|mqtt|device|controller/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing Edge Gateway: Constrained IoT devices cannot open direct connections to internal cloud services without a protocol gateway.',
          recommendationIfMissing: 'Deploy an IoT Edge Gateway or MQTT broker (e.g. EMQX, AWS IoT Core) for lightweight telemetry ingestion.'
        },
        {
          key: 'local_buffer',
          label: 'Local Storage / Flash Buffer / Redis Cache',
          weight: 10,
          matches: n => /buffer|cache|flash|redis|memory|local/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No local buffer or transient cache: Intermittent network drops in edge environments will lead to lost sensor telemetry.',
          recommendationIfMissing: 'Introduce a local buffer or Redis cache to spool metrics offline during network partitions.'
        },
        {
          key: 'stream_broker',
          label: 'Telemetry Event Bus (Kafka / Message Queue)',
          weight: 10,
          matches: n => /kafka|queue|stream|event|pubsub/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Unbuffered edge streaming: High-frequency sensor bursts will overload backend analytics workers.',
          recommendationIfMissing: 'Add Kafka or a Message Queue to buffer high-frequency device telemetry streams.'
        },
        {
          key: 'tsdb_storage',
          label: 'Time-Series Database / Data Lake (TimescaleDB / InfluxDB)',
          weight: 8,
          matches: n => /db|postgres|timescale|influx|lake|storage|s3/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing persistent time-series storage: Historical sensor telemetry and device state cannot be analyzed.',
          recommendationIfMissing: 'Attach a Time-Series Database (TimescaleDB / InfluxDB) or cold object storage for long-term telemetry retention.'
        }
      ]
    };
  }

  if (/vector|rag|embedding|semantic|llm|ai[-_ ]search|retrieval|pinecone|milvus|qdrant|chroma/i.test(lower)) {
    return {
      archetype: 'vector_search_rag',
      requirements: [
        {
          key: 'vector_db',
          label: 'Vector Database / Index (pgvector / Pinecone / Milvus)',
          weight: 12,
          matches: n => /vector|pgvector|pinecone|milvus|qdrant|chroma|ann/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing Vector Database: Semantic vector embeddings cannot be indexed or retrieved with Approximate Nearest Neighbors (ANN).',
          recommendationIfMissing: 'Deploy a dedicated Vector Database or pgvector index for fast high-dimensional cosine similarity lookups.'
        },
        {
          key: 'embedding_worker',
          label: 'Asynchronous Embedding Generator & Chunking Worker',
          weight: 10,
          matches: n => /worker|embedding|llm|inference|chunking|cron|compute/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Synchronous embedding generation: Large document ingestion will block user requests while calling embedding models.',
          recommendationIfMissing: 'Add an asynchronous Embedding Worker to chunk documents and generate vector representations off the main request thread.'
        },
        {
          key: 'document_store',
          label: 'Raw Document Object Storage (S3 / Blob Storage)',
          weight: 8,
          matches: n => /s3|blob|storage|bucket|object/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing raw document storage: Original source documents and chunks cannot be retrieved for RAG context window assembly.',
          recommendationIfMissing: 'Store full document bodies in S3 or Blob Storage, saving vector databases for vector IDs and metadata.'
        },
        {
          key: 'gateway',
          label: 'API Gateway / LLM Guardrail Ingress',
          weight: 8,
          matches: n => /gateway|load balancer|alb|ingress|proxy|guardrail/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Unprotected inference endpoint: Rate limiting and token budget throttling are unmanaged.',
          recommendationIfMissing: 'Place an API Gateway at ingress to enforce prompt token budgets, rate limits, and safety filters.'
        }
      ]
    };
  }

  if (/trading|exchange|matching|orderbook|order[-_ ]book|quant|disruptor|low[-_ ]latency|fix|hft|financial[-_ ]market/i.test(lower)) {
    return {
      archetype: 'low_latency_matching_exchange',
      requirements: [
        {
          key: 'matching_engine',
          label: 'In-Memory Order Matching Engine (Deterministic FIFO / LMAX)',
          weight: 12,
          matches: n => /matching|engine|orderbook|lmax|disruptor|core/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing in-memory matching engine: Database transactions are too slow for microsecond order book matching.',
          recommendationIfMissing: 'Deploy a single-threaded in-memory Matching Engine with deterministic sequential order book execution.'
        },
        {
          key: 'ring_buffer',
          label: 'Lock-Free Memory Ring Buffer / Event Journal (LMAX Disruptor)',
          weight: 10,
          matches: n => /disruptor|ring|buffer|journal|queue|memory|kafka/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Lock contention bottleneck: Multi-threaded locks will cause latency jitter and thread preemption.',
          recommendationIfMissing: 'Utilize an LMAX Disruptor or lock-free circular ring buffer for zero-allocation inter-thread message passing.'
        },
        {
          key: 'market_data_feed',
          label: 'Market Data UDP/Multicast Distribution Gateway',
          weight: 8,
          matches: n => /feed|broadcast|multicast|udp|websocket|gateway|market/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No market data feed distribution: Market depth and trade executions cannot be broadcast to participants in real time.',
          recommendationIfMissing: 'Add a Market Data gateway broadcasting level-2 order book updates over low-latency streams.'
        },
        {
          key: 'settlement_db',
          label: 'Durable Post-Trade Settlement & Audit Database (PostgreSQL)',
          weight: 8,
          matches: n => /db|postgres|sql|settlement|audit|ledger/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No post-trade persistence: Trade fills risk data loss upon in-memory engine crash.',
          recommendationIfMissing: 'Asynchronously journal executed trades to a durable PostgreSQL database for clearing and regulatory audit.'
        }
      ]
    };
  }

  if (/zero[- ]?trust|security|cyber|auth|identity|oauth|token|kms|vault|firewall|defense|siem|pki|bastion|mtls/i.test(lower)) {
    return {
      archetype: 'cybersecurity_zero_trust_mesh',
      requirements: [
        {
          key: 'waf_shield',
          label: 'WAF & DDoS Edge Shield (Cloudflare / API Shield)',
          weight: 12,
          matches: n => /waf|shield|firewall|cloudflare|ddos|ingress|guard/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Unshielded edge perimeter: Ingress lacks automated Web Application Firewall (WAF) filtering and volumetric DDoS mitigation.',
          recommendationIfMissing: 'Deploy an edge WAF or API Shield (e.g. Cloudflare / AWS WAF) to filter malicious payloads, SQLi, and volumetric floods.'
        },
        {
          key: 'idp_gateway',
          label: 'Identity Provider & OAuth2 / OIDC Auth Gateway',
          weight: 10,
          matches: n => /auth|idp|oidc|oauth|identity|gateway|proxy|keycloak/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing centralized identity plane: Microservices cannot verify cryptographic JWT tokens or enforce RBAC/ABAC policies.',
          recommendationIfMissing: 'Deploy a dedicated Identity Provider (OIDC/Keycloak) with an Auth Gateway validating mTLS and signed claims.'
        },
        {
          key: 'kms_vault',
          label: 'Hardware Security Module (HSM) / Secret Vault (HashiCorp Vault / KMS)',
          weight: 10,
          matches: n => /vault|kms|hsm|secret|key|crypto/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Unsecured secrets management: Private cryptographic keys and service credentials risk plaintext exposure.',
          recommendationIfMissing: 'Integrate HashiCorp Vault or Cloud KMS for envelope encryption, automated secret rotation, and dynamic credentials.'
        },
        {
          key: 'siem_audit',
          label: 'Immutable SIEM Audit Log & Security Stream (Kafka / Splunk)',
          weight: 8,
          matches: n => /siem|audit|splunk|log|kafka|queue|stream|storage|s3/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No immutable security audit pipeline: Zero-Trust compliance requires non-repudiable logging of all authorization attempts.',
          recommendationIfMissing: 'Stream structured security audit logs into an immutable SIEM pipeline (Kafka / S3) for continuous anomaly detection.'
        }
      ]
    };
  }

  if (/webrtc|video[-_ ]conferenc|zoom|sfu|livestream|video[-_ ]stream|video[-_ ]call|broadcasting|media[-_ ]server/i.test(lower)) {
    return {
      archetype: 'video_streaming_webrtc',
      requirements: [
        {
          key: 'sfu_media',
          label: 'WebRTC SFU / Media Gateway (LiveKit / Mediasoup)',
          weight: 12,
          matches: n => /media|webrtc|sfu|gateway|stream|relay/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing WebRTC SFU: Mesh peer-to-peer topologies collapse client upstream bandwidth beyond 4 participants.',
          recommendationIfMissing: 'Deploy a Selective Forwarding Unit (SFU like LiveKit or Mediasoup) to receive one video stream and fan out to subscribers.'
        },
        {
          key: 'turn_stun',
          label: 'NAT Traversal Relay (STUN / TURN Server)',
          weight: 10,
          matches: n => /turn|stun|relay|gateway|load balancer|alb/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No STUN/TURN relay: Clients behind symmetric enterprise NATs or corporate firewalls will experience black screens and connection failures.',
          recommendationIfMissing: 'Deploy globally distributed TURN/STUN relays (coturn) to guarantee UDP/TCP fallback connection traversal.'
        },
        {
          key: 'presence_signaling',
          label: 'WebSocket Signaling & Presence State Cache (Redis)',
          weight: 10,
          matches: n => /redis|cache|presence|signaling|memory|queue/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No distributed signaling cache: Multi-node room coordination and SDP offer/answer exchanges will become desynchronized.',
          recommendationIfMissing: 'Use Redis Pub/Sub for sub-millisecond SDP negotiation signaling and participant room state synchronization.'
        },
        {
          key: 'transcoding_storage',
          label: 'Adaptive Bitrate Transcoder & Recording Storage (S3)',
          weight: 8,
          matches: n => /worker|compute|s3|blob|storage|transcod|recording/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No archival or recording storage: Room video recordings cannot be composited or stored durably.',
          recommendationIfMissing: 'Attach an asynchronous Transcoding Worker and Object Storage (S3) for server-side recording and playback.'
        }
      ]
    };
  }

  if (/ecommerce|e-commerce|checkout|payment|bank|order|inventory|booking/.test(lower)) {
    return {
      archetype: 'transactional_acid',
      requirements: [
        {
          key: 'database',
          label: 'ACID Relational Database (PostgreSQL)',
          weight: 12,
          matches: n => /postgres|db|sql|relational/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Lack of transactional database: Financial orders and inventory require ACID compliance to prevent double-spending.',
          recommendationIfMissing: 'Utilize a primary relational database (Postgres) with transaction boundaries for order integrity.'
        },
        {
          key: 'compute',
          label: 'Core Business Service (Order / Payment Microservice)',
          weight: 10,
          matches: n => /microservice|server|compute|service/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No business compute layer: Order validation and pricing logic cannot be executed.',
          recommendationIfMissing: 'Add a microservice to execute checkout validation and payment capture.'
        },
        {
          key: 'queue',
          label: 'Asynchronous Order Fulfillment Queue',
          weight: 8,
          matches: n => /queue|kafka|worker/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Synchronous third-party coupling: Payment webhooks and fulfillment run synchronously, creating checkout timeouts.',
          recommendationIfMissing: 'Decouple inventory reservation and email receipts into a message queue.'
        },
        {
          key: 'gateway',
          label: 'API Gateway / Load Balancer',
          weight: 8,
          matches: n => /gateway|load balancer|alb|proxy/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Clients directly target compute: Rate limiting and auth token validation are unhandled.',
          recommendationIfMissing: 'Add an API Gateway to handle authentication, rate limiting, and SSL termination.'
        }
      ]
    };
  }

  if (/url|shortener|rate limit|limiter|cache|feed|catalog|leaderboard|read-heavy/.test(lower)) {
    return {
      archetype: 'high_read_cache',
      requirements: [
        {
          key: 'cache',
          label: 'High-Throughput Caching Layer (Redis)',
          weight: 14,
          matches: n => /redis|cache|memcached/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Missing in-memory cache: High-frequency read queries will choke the database under peak traffic.',
          recommendationIfMissing: 'Add a Redis cache layer in front of the database to serve hot reads with sub-millisecond latency.'
        },
        {
          key: 'loadbalancer',
          label: 'Load Balancer / Traffic Dispatcher',
          weight: 10,
          matches: n => /load balancer|alb|nginx|gateway/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Single point of failure: Incoming traffic cannot be horizontally distributed across compute nodes.',
          recommendationIfMissing: 'Place an ALB or Load Balancer in front of compute nodes.'
        },
        {
          key: 'compute',
          label: 'Hashing / Routing Compute Microservice',
          weight: 8,
          matches: n => /microservice|server|compute/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'No compute engine to handle redirection, encoding, and validation.',
          recommendationIfMissing: 'Add application servers to resolve keys and handle redirects.'
        },
        {
          key: 'database',
          label: 'Durable Relational / Key-Value Database',
          weight: 6,
          matches: n => /db|postgres|sql|mongo/i.test(n.type + ' ' + n.label),
          bottleneckIfMissing: 'Cache without backing store: Data will be lost upon Redis restart.',
          recommendationIfMissing: 'Back the cache with a persistent database store.'
        }
      ]
    };
  }

  // Default: General Distributed Architecture
  return {
    archetype: 'general_distributed',
    requirements: [
      {
        key: 'loadbalancer',
        label: 'Traffic Distribution (Load Balancer / Gateway)',
        weight: 10,
        matches: n => /load balancer|alb|gateway|proxy|cloudflare|cdn/i.test(n.type + ' ' + n.label),
        bottleneckIfMissing: 'Direct client access: Compute tier lacks horizontal traffic distribution and health-checking.',
        recommendationIfMissing: 'Introduce a Load Balancer or API Gateway to decouple clients from backend app servers.'
      },
      {
        key: 'compute',
        label: 'Core Compute / Microservice Layer',
        weight: 10,
        matches: n => /microservice|server|compute|worker/i.test(n.type + ' ' + n.label),
        bottleneckIfMissing: 'Missing application compute layer.',
        recommendationIfMissing: 'Deploy a compute service or microservice tier to execute domain logic.'
      },
      {
        key: 'database',
        label: 'Persistent Storage Layer (Postgres DB)',
        weight: 10,
        matches: n => /db|postgres|sql|mongo|storage|s3/i.test(n.type + ' ' + n.label),
        bottleneckIfMissing: 'Ephemeral architecture: State will be wiped on server recycling without durable persistence.',
        recommendationIfMissing: 'Attach a persistent database tier (Postgres DB or NoSQL).'
      },
      {
        key: 'cache_or_queue',
        label: 'Low-Latency Cache or Asynchronous Queue',
        weight: 8,
        matches: n => /redis|cache|kafka|queue/i.test(n.type + ' ' + n.label),
        bottleneckIfMissing: 'Tightly coupled synchronous tiering: Database reads and slow jobs directly impact request latency.',
        recommendationIfMissing: 'Introduce Redis for hot read caching or Kafka for asynchronous background jobs.'
      }
    ]
  };
}

export function evaluateSystemTopology(
  snapshot: SystemTopologySnapshot,
  topic: string = 'Distributed Architecture',
  domainStream: 'tech' | 'non_tech' = 'tech'
): ArchitectureEvaluationResult {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
  const rawLinks = Array.isArray(snapshot?.links) ? snapshot.links : [];

  // Edge case 1: Canvas is completely empty
  if (nodes.length === 0) {
    const isNonTechEmpty = domainStream === 'non_tech';
    return {
      score: 0,
      grade: 'Needs Work',
      scalabilityRating: 0,
      reliabilityRating: 0,
      strengths: [],
      bottlenecks: [
        isNonTechEmpty
          ? 'Blank Canvas: No business workflow stages have been placed.'
          : 'Blank Whiteboard: No architecture components have been placed.'
      ],
      recommendations: [
        isNonTechEmpty
          ? `Add audience, acquisition funnel, checkout, fulfillment, and retention stages from the palette for ${topic}.`
          : `Add client ingress, compute microservices, and storage layers from the palette to satisfy requirements for ${topic}.`
      ],
      summary: isNonTechEmpty
        ? `Business workflow is unattempted (0/100) for ${topic}. The canvas is blank.`
        : `System architecture is unattempted (0/100) for ${topic}. The whiteboard is blank.`,
      spokenFeedback: isNonTechEmpty
        ? `It looks like the workflow canvas is currently blank for ${topic}. Start by placing your Target Audience and acquisition stage, then connect checkout, fulfillment, and retention.`
        : `It looks like the whiteboard is currently blank for ${topic}. Start by placing your entrypoint client, then attach compute services and persistence layers.`
    };
  }

  const strengths: string[] = [];
  const bottlenecks: string[] = [];
  const recommendations: string[] = [];

  let foundationalScore = 0;
  let problemFitScore = 0;
  let topologyScore = 0;
  let decouplingScore = 0;

  if (domainStream === 'non_tech') {
    // Non-tech business & finance/audit workflow evaluation with real directed-graph & stage-order validation
    const classifyBusinessStage = (n: { type: string; label: string }): number => {
      const text = `${n.type} ${n.label}`.toLowerCase();
      // Stage 0: Entry / Intake (Target Market OR Invoice/Voucher/KYC Intake)
      if (/audience|segment|cohort|customer|invoice|voucher|intake|kyc/.test(text)) return 0;
      // Stage 1: Validation / Acquisition (Ad Campaign / Landing Page OR 3-Way Match / Audit / Underwriting)
      if (/ad\s*campaign|campaign|landing|funnel|traffic|seo|social|3-way|match|maker|verify|underwrit/.test(text)) return 1;
      // Stage 2: Transaction / Tax / Checkout (Checkout / Billing OR GST / Tax Engine)
      if (/checkout|payment|billing|monetization|order\s*oms|gst|tax\s*engine|tds/.test(text)) return 2;
      // Stage 3: Core Operations / Ledger (Logistics / Supplier / Fulfillment OR General Ledger Dr=Cr)
      if (/logistics|supplier|fulfillment|warehouse|inventory|delivery|general\s*ledger|dr=cr|double-entry/.test(text)) return 3;
      // Stage 4: Post-Transaction Reconciliation / Reporting / Retention (CRM / Retention OR Treasury / Bank Recon / Ind AS / IFRS Reporting)
      if (/crm|support|retention|loop|nurture|treasury|bank\s*recon|financial\s*reporting|ind\s*as|ifrs|ebitda|audit\s*trail|close\s*cycle/.test(text)) return 4;
      return 2;
    };

    const hasAudience = nodes.some(n => classifyBusinessStage(n) === 0);
    const hasFunnel = nodes.some(n => classifyBusinessStage(n) === 1);
    const hasCheckout = nodes.some(n => classifyBusinessStage(n) === 2);
    const hasFulfillment = nodes.some(n => classifyBusinessStage(n) === 3);
    const hasRetention = nodes.some(n => classifyBusinessStage(n) === 4);

    // 1. Foundational Business Stages (20 pts — placing nodes alone never earns an A)
    if (hasAudience) { foundationalScore += 7; strengths.push('Target market segmentation defined'); }
    else { bottlenecks.push('Missing initial target audience or customer cohort'); recommendations.push('Add a Target Audience stage to anchor your funnel'); }

    if (hasFunnel) { foundationalScore += 6; strengths.push('Inbound acquisition funnel established'); }
    else { bottlenecks.push('Missing acquisition or landing stage before conversion'); recommendations.push('Add an Ad Campaign or Landing Page stage'); }

    if (hasCheckout) { foundationalScore += 7; strengths.push('Revenue capture and checkout stage defined'); }
    else { bottlenecks.push('Missing explicit checkout / revenue capture step'); recommendations.push('Add a Checkout Engine or Billing stage'); }

    // 2. Domain-Specific Business Fit (20 pts)
    const lowerTopic = topic.toLowerCase();
    if (/retention|subscription|lifecycle/i.test(lowerTopic)) {
      if (hasRetention) { problemFitScore += 14; strengths.push('Customer retention loop integrated for recurring lifecycle value'); }
      else { bottlenecks.push('Missing retention loop in subscription lifecycle flow'); recommendations.push('Add a Retention Loop or CRM nurture stage'); }
      if (hasFulfillment) { problemFitScore += 6; strengths.push('Operational fulfillment connected'); }
    } else if (/supply|logistics|fulfillment|ops/i.test(lowerTopic)) {
      if (hasFulfillment) { problemFitScore += 14; strengths.push('Fulfillment logistics and supplier network established'); }
      else { bottlenecks.push('Missing fulfillment logistics stage for operational delivery'); recommendations.push('Add Logistics Hub or Supplier Network'); }
      if (hasRetention) { problemFitScore += 6; strengths.push('Post-delivery CRM/retention tracking included'); }
    } else {
      if (hasRetention) { problemFitScore += 10; strengths.push('Post-purchase CRM & retention loop included'); }
      else { bottlenecks.push('No post-purchase CRM or retention loop to protect LTV'); recommendations.push('Add CRM / Support or Retention Loop after fulfillment'); }
      if (hasFulfillment) { problemFitScore += 10; strengths.push('Fulfillment and supplier operations included'); }
      else { bottlenecks.push('No fulfillment or delivery operations stage'); recommendations.push('Add Logistics Hub or Supplier Network to fulfill orders'); }
    }

    // 3. Real Directed Graph Connectivity & Funnel Flow Logic (45 pts)
    const linkCount = rawLinks.length;
    let flowAccuracyRatio = 0;
    let illogicalJumpLinks = 0;
    let connectivityRatio = 0;

    if (linkCount === 0) {
      bottlenecks.push('Disconnected workflow: No handover arrows drawn between business stages.');
      recommendations.push('Toggle Connect mode and draw directional arrows from Audience → Acquisition → Checkout → Fulfillment → Retention.');
    } else {
      const nodeById = new Map(nodes.map(n => [n.id, n]));
      const nodeByType = new Map(nodes.map(n => [n.type.toLowerCase(), n]));
      const connectedIds = new Set<string>();
      let validLogicalLinks = 0;
      const badFlowExamples: string[] = [];

      for (const l of rawLinks as any[]) {
        const fromNode = (l.from && nodeById.get(l.from)) || (l.fromType && nodeByType.get(String(l.fromType).toLowerCase()));
        const toNode = (l.to && nodeById.get(l.to)) || (l.toType && nodeByType.get(String(l.toType).toLowerCase()));
        if (fromNode) connectedIds.add(fromNode.id);
        if (toNode) connectedIds.add(toNode.id);
        if (!fromNode || !toNode) continue;

        const fromStage = classifyBusinessStage(fromNode);
        const toStage = classifyBusinessStage(toNode);

        // Valid flows:
        // - Forward step within 1 stage (e.g., Audience(0)->Ad/Landing(1)->Checkout(2)->Logistics(3)->CRM/Retention(4))
        // - Within same stage (e.g., Ad Campaign(1)->Landing Page(1), Supplier(3)->Logistics(3), CRM(4)->Retention(4))
        // - Checkout(2) directly to CRM/Retention(4) for digital/service delivery
        // - Valid retention loop back: Retention/CRM(4) -> Audience(0) or Acquisition(1)
        const isValidStep =
          (toStage >= fromStage && toStage - fromStage <= 1) ||
          (fromStage === 2 && toStage === 4) ||
          (fromStage === 4 && (toStage === 0 || toStage === 1));

        if (isValidStep) {
          validLogicalLinks += 1;
        } else {
          illogicalJumpLinks += 1;
          if (badFlowExamples.length < 2) {
            badFlowExamples.push(`${fromNode.label} → ${toNode.label}`);
          }
        }
      }

      connectivityRatio = nodes.length > 0 ? connectedIds.size / nodes.length : 0;
      flowAccuracyRatio = (validLogicalLinks + illogicalJumpLinks) > 0
        ? validLogicalLinks / (validLogicalLinks + illogicalJumpLinks)
        : 0;

      // Connectivity points are gated by flow validity so spaghetti links cannot farm full connectivity credit
      const connectPts = Math.round(connectivityRatio * (5 + 10 * flowAccuracyRatio));
      const orderPts = Math.round(flowAccuracyRatio * 30);
      topologyScore += connectPts + orderPts;

      if (connectivityRatio < 1) {
        const orphanCount = nodes.length - connectedIds.size;
        bottlenecks.push(`${orphanCount} placed stage${orphanCount === 1 ? '' : 's'} left disconnected from the workflow.`);
        recommendations.push('Connect every placed business stage so there are no orphaned steps.');
      }

      if (illogicalJumpLinks > 0) {
        bottlenecks.push(`Illogical stage handovers detected (${badFlowExamples.join(', ')}) — stages skip required funnel or checkout steps.`);
        recommendations.push('Route flows in sequence: Target Audience → Ad Campaign → Landing Page → Checkout → Fulfillment → CRM/Retention.');
      } else if (connectivityRatio === 1 && validLogicalLinks >= Math.max(2, nodes.length - 1)) {
        strengths.push('Cohesive, logically sequenced end-to-end customer & operational workflow');
      }
    }

    // 4. Closed-Loop Growth & Retention Integrity (13 pts — requires valid sequencing!)
    if (flowAccuracyRatio >= 0.7 && nodes.length >= 4 && hasAudience && hasCheckout) decouplingScore += 6;
    if (flowAccuracyRatio >= 0.7 && hasRetention && hasAudience && rawLinks.length >= 3) decouplingScore += 7;

    const spaghettiPenalty = illogicalJumpLinks > 0 ? Math.min(20, illogicalJumpLinks * 4) : 0;
    let rawTotal = foundationalScore + problemFitScore + topologyScore + decouplingScore - spaghettiPenalty;
    // Cap score strictly if half or more of drawn links violate logical business-stage sequencing
    if (linkCount > 0 && flowAccuracyRatio < 0.5) {
      rawTotal = Math.min(rawTotal, 54);
    }
    const finalScore = Math.max(0, Math.min(98, Math.round(rawTotal)));
    const grade: ArchitectureEvaluationResult['grade'] =
      finalScore >= 88 ? 'A+' :
      finalScore >= 75 ? 'A' :
      finalScore >= 60 ? 'B' :
      finalScore >= 40 ? 'C' : 'Needs Work';

    const flowFactor = linkCount === 0 ? 0.45 : (0.35 + 0.65 * flowAccuracyRatio);
    const growthLeverageRating = Math.min(98, Math.round(
      ((hasAudience ? 25 : 0) +
      (hasFunnel ? 25 : 0) +
      (hasCheckout ? 25 : 0) +
      (hasRetention ? 23 : 0)) * flowFactor
    ));
    const opsContinuityRating = Math.min(98, Math.round(
      ((hasFulfillment ? 35 : 0) +
      (hasRetention ? 30 : 0) +
      Math.min(33, Math.round((topologyScore / 45) * 33))) * flowFactor
    ));

    const spokenFeedback = finalScore >= 80
      ? `Strong business workflow for ${topic}! Your journey cleanly connects customer acquisition, conversion, operational fulfillment, and post-purchase retention.`
      : finalScore >= 55
      ? `Workable initial business workflow for ${topic}, scoring ${finalScore}/100. To strengthen commercial execution, address: ${bottlenecks[0] || 'stage sequencing and conversion handovers'}.`
      : `Your business workflow for ${topic} needs clearer funnel sequencing (${finalScore}/100). Focus first on: ${bottlenecks[0] || 'connecting audience, acquisition, checkout, and fulfillment in order'}.`;

    return {
      score: finalScore,
      grade,
      scalabilityRating: growthLeverageRating,
      reliabilityRating: opsContinuityRating,
      strengths: strengths.length > 0 ? strengths : ['Initial business stages placed'],
      bottlenecks: bottlenecks.length > 0 ? bottlenecks : ['No major workflow gaps detected'],
      recommendations: recommendations.length > 0 ? recommendations : ['Workflow covers core commercial stages cleanly'],
      summary: `Business workflow scored ${finalScore}/100 (${grade}) for ${topic}. ${strengths.length} strengths and ${bottlenecks.length} bottleneck${bottlenecks.length === 1 ? '' : 's'} identified.`,
      spokenFeedback
    };
  } else {
    // Tech system architecture evaluation
    const hasClient = nodes.some(n => /client|mobile|web|frontend|app/i.test(n.type + ' ' + n.label));
    const hasCompute = nodes.some(n => /microservice|server|compute|worker|api/i.test(n.type + ' ' + n.label));
    const hasStorage = nodes.some(n => /db|postgres|sql|mongo|storage|s3|blob/i.test(n.type + ' ' + n.label));
    const hasLB = Boolean(snapshot?.hasLoadBalancer) || nodes.some(n => /load balancer|alb|nginx|gateway/i.test(n.type + ' ' + n.label));
    const hasCache = Boolean(snapshot?.hasCachingLayer) || nodes.some(n => /redis|cache|memcached/i.test(n.type + ' ' + n.label));
    const hasQueue = Boolean(snapshot?.hasQueue) || nodes.some(n => /kafka|queue|stream|broker/i.test(n.type + ' ' + n.label));
    const hasCDN = nodes.some(n => /cdn|cloudflare|edge/i.test(n.type + ' ' + n.label));

    // 1. Foundational Architecture (0-30 pts)
    if (hasClient) { foundationalScore += 10; strengths.push('Client entrypoint established'); }
    else { bottlenecks.push('Missing client ingress: Architecture lacks a defined consumer / client application.'); recommendations.push('Add a Client App node.'); }

    if (hasCompute) { foundationalScore += 10; strengths.push('Application compute service tier active'); }
    else { bottlenecks.push('Missing compute tier: No backend services to execute business logic.'); recommendations.push('Add a Microservice or Worker node.'); }

    if (hasStorage) { foundationalScore += 10; strengths.push('Durable storage tier configured'); }
    else { bottlenecks.push('Missing persistence tier: No database or object storage configured.'); recommendations.push('Add Postgres DB or S3 Blob Storage.'); }

    // 2. Problem-Specific Requirements (0-38 pts)
    const { requirements } = detectTechArchetype(topic);
    for (const req of requirements) {
      const isPresent = nodes.some(req.matches) ||
        (req.key === 'loadbalancer' && Boolean(snapshot?.hasLoadBalancer)) ||
        (req.key === 'cache' && Boolean(snapshot?.hasCachingLayer)) ||
        (req.key === 'cache_or_queue' && (Boolean(snapshot?.hasCachingLayer) || Boolean(snapshot?.hasQueue))) ||
        (req.key === 'database' && Boolean(snapshot?.hasDatabase)) ||
        (req.key === 'queue' && Boolean(snapshot?.hasQueue));

      if (isPresent) {
        problemFitScore += req.weight;
        strengths.push(`${req.label} satisfies domain requirement for ${topic}`);
      } else {
        bottlenecks.push(req.bottleneckIfMissing);
        recommendations.push(req.recommendationIfMissing);
      }
    }

    // 3. Topology Connectivity & Network Flow (0-22 pts)
    const linkCount = rawLinks.length;
    if (linkCount === 0 && !snapshot?.isFullyConnected) {
      bottlenecks.push('Unconnected components: Nodes are placed on the canvas without data flow links.');
      recommendations.push('Toggle "Connect Nodes" to draw network requests between components.');
    } else {
      if (snapshot?.isFullyConnected) {
        topologyScore += 22;
        strengths.push('End-to-end network data flow mapped across tiers');
      } else {
        const nodeIds = new Set(nodes.map(n => n.id));
        const connectedNodeIds = new Set<string>();
        for (const l of rawLinks as any[]) {
          if (l.from) connectedNodeIds.add(l.from);
          if (l.to) connectedNodeIds.add(l.to);
          if (l.fromType) {
            const matchFrom = nodes.find(n => n.type === l.fromType);
            if (matchFrom) connectedNodeIds.add(matchFrom.id);
          }
          if (l.toType) {
            const matchTo = nodes.find(n => n.type === l.toType);
            if (matchTo) connectedNodeIds.add(matchTo.id);
          }
        }

        const connectionRatio = connectedNodeIds.size > 0
          ? Math.min(1.0, connectedNodeIds.size / nodes.length)
          : Math.min(1.0, (linkCount + 1) / nodes.length);

        topologyScore += Math.round(connectionRatio * 15);

        const hasFlow = (hasClient && hasCompute) || (hasCompute && hasStorage);
        if (hasFlow && linkCount >= 2) {
          topologyScore += 7;
          strengths.push('End-to-end network data flow mapped across tiers');
        } else {
          bottlenecks.push('Fragmented network flow: Data flow does not cleanly span from ingress down to storage.');
          recommendations.push('Ensure client requests route through gateway/compute before reaching database.');
        }
      }
    }

    // 4. Scale & Resilience Decoupling (0-10 pts)
    if (hasLB || hasCDN) {
      decouplingScore += 5;
      strengths.push('Client traffic decoupled via Load Balancer or Edge CDN');
    }
    if (hasCache || hasQueue) {
      decouplingScore += 5;
      strengths.push('Asynchronous decoupling or in-memory acceleration layer in place');
    }
  }

  const rawTotal = foundationalScore + problemFitScore + topologyScore + decouplingScore;
  const finalScore = Math.max(0, Math.min(98, Math.round(rawTotal)));

  const grade: ArchitectureEvaluationResult['grade'] =
    finalScore >= 88 ? 'A+' :
    finalScore >= 75 ? 'A' :
    finalScore >= 60 ? 'B' :
    finalScore >= 40 ? 'C' : 'Needs Work';

  // Dynamic Scalability & Reliability computation based on actual architectural properties
  const hasLB = Boolean(snapshot?.hasLoadBalancer) || nodes.some(n => /load balancer|alb|nginx|gateway|edge|broker/i.test(n.type + ' ' + n.label));
  const hasCache = Boolean(snapshot?.hasCachingLayer) || nodes.some(n => /redis|cache|buffer|flash/i.test(n.type + ' ' + n.label));
  const hasQueue = Boolean(snapshot?.hasQueue) || nodes.some(n => /kafka|queue|stream|worker|media|sfu|webrtc|disruptor|buffer/i.test(n.type + ' ' + n.label));
  const hasPersistentStorage = Boolean(snapshot?.hasDatabase) || nodes.some(n => /db|postgres|sql|timescale|influx|ledger|s3|blob|storage|vault/i.test(n.type + ' ' + n.label));
  const hasCDN = nodes.some(n => /cdn|cloudflare/i.test(n.type + ' ' + n.label));

  const scalabilityRating = nodes.length === 0 ? 0 : Math.min(98, Math.round(
    (hasLB || hasCDN ? 38 : 12) +
    (hasCache ? 32 : 10) +
    (hasQueue ? 25 : 8) +
    (finalScore >= 75 ? 5 : 0)
  ));

  const reliabilityRating = nodes.length === 0 ? 0 : Math.min(98, Math.round(
    (hasPersistentStorage ? 40 : 10) +
    (hasQueue ? 28 : 10) +
    (hasLB ? 22 : 8) +
    (finalScore >= 75 ? 8 : 0)
  ));

  const spokenFeedback = finalScore >= 80
    ? `Impressive system design for ${topic}! Your topology effectively decouples the client tier, utilizes distributed components, and addresses domain-specific scale requirements.`
    : finalScore >= 50
    ? `Viable initial structure for ${topic}. To achieve production resilience, resolve ${bottlenecks[0] || 'component decoupling'} and verify end-to-end data flow.`
    : `Your architecture for ${topic} needs structural refinement. Pay close attention to: ${bottlenecks[0] || 'placing core components and connecting data flows'}.`;

  return {
    score: finalScore,
    grade,
    scalabilityRating,
    reliabilityRating,
    strengths: strengths.length > 0 ? strengths : ['Basic components placed'],
    bottlenecks: bottlenecks.length > 0 ? bottlenecks : ['No critical single points of failure found'],
    recommendations: recommendations.length > 0 ? recommendations : ['Architecture meets baseline requirements'],
    summary: `System architecture scored ${finalScore}/100 (${grade}) for ${topic}. ${strengths.length} strengths identified.`,
    spokenFeedback
  };
}
