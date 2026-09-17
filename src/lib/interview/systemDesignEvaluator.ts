import { SystemTopologySnapshot } from '@/components/interview/SystemDesignWhiteboard';

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

  if (/ecommerce|e-commerce|checkout|payment|bank|order|ledger|inventory|booking/.test(lower)) {
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
    return {
      score: 0,
      grade: 'Needs Work',
      scalabilityRating: 0,
      reliabilityRating: 0,
      strengths: [],
      bottlenecks: ['Blank Whiteboard: No architecture components have been placed.'],
      recommendations: [
        `Add client ingress, compute microservices, and storage layers from the palette to satisfy requirements for ${topic}.`
      ],
      summary: `System architecture is unattempted (0/100) for ${topic}. The whiteboard is blank.`,
      spokenFeedback: `It looks like the whiteboard is currently blank for ${topic}. Start by placing your entrypoint client, then attach compute services and persistence layers.`
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
    // Non-tech business workflow evaluation
    const hasAudience = nodes.some(n => /audience|segment|cohort|customer/i.test(n.type + ' ' + n.label));
    const hasFunnel = nodes.some(n => /funnel|landing|ad|campaign|traffic/i.test(n.type + ' ' + n.label));
    const hasCheckout = nodes.some(n => /checkout|payment|billing|monetization/i.test(n.type + ' ' + n.label));
    const hasFulfillment = nodes.some(n => /logistics|supplier|crm|support|fulfillment/i.test(n.type + ' ' + n.label));
    const hasRetention = nodes.some(n => /retention|loop|crm|lms|nurture/i.test(n.type + ' ' + n.label));

    // Foundational Components (30 pts)
    if (hasAudience) { foundationalScore += 10; strengths.push('Target market segmentation specified'); }
    else { bottlenecks.push('Missing initial target market or user cohort'); recommendations.push('Define explicit target audience node'); }

    if (hasFunnel) { foundationalScore += 10; strengths.push('Inbound acquisition funnel established'); }
    else { bottlenecks.push('No conversion funnel between customer acquisition and checkout'); recommendations.push('Add landing page or conversion funnel'); }

    if (hasCheckout) { foundationalScore += 10; strengths.push('Revenue capture and checkout mechanism defined'); }
    else { bottlenecks.push('Missing explicit monetization / checkout step'); recommendations.push('Add checkout engine or revenue capture mechanism'); }

    // Problem-specific fit (35 pts)
    const lowerTopic = topic.toLowerCase();
    if (/retention|subscription|lifecycle/i.test(lowerTopic)) {
      if (hasRetention) { problemFitScore += 25; strengths.push('Customer retention loop integrated for recurring lifecycle value'); }
      else { bottlenecks.push('Missing retention loop in subscription lifecycle flow'); recommendations.push('Add retention loop or automated email nurture node'); }
      if (hasFulfillment) problemFitScore += 10;
    } else if (/supply|logistics|fulfillment|ops/i.test(lowerTopic)) {
      if (hasFulfillment) { problemFitScore += 25; strengths.push('Fulfillment logistics and supplier networks established'); }
      else { bottlenecks.push('Missing fulfillment logistics node for operational delivery'); recommendations.push('Add logistics hub or supplier node'); }
      if (hasRetention) problemFitScore += 10;
    } else {
      if (hasRetention) { problemFitScore += 18; strengths.push('Post-purchase retention loop included'); }
      if (hasFulfillment) { problemFitScore += 17; strengths.push('Fulfillment pipeline connected'); }
    }

    // Connectivity (25 pts)
    const linkCount = rawLinks.length;
    if (linkCount >= nodes.length - 1 && linkCount > 0) {
      topologyScore += 25;
      strengths.push('Cohesive end-to-end customer journey pipeline');
    } else if (linkCount > 0) {
      topologyScore += Math.round((linkCount / Math.max(1, nodes.length)) * 25);
      bottlenecks.push('Fragmented workflow: Some stages lack conversion handover arrows');
      recommendations.push('Connect all stages from audience down to fulfillment');
    } else {
      bottlenecks.push('Disconnected business nodes: No conversion handovers drawn');
      recommendations.push('Toggle Connection Mode to link customer stages');
    }

    // Decoupling & Growth Levers (10 pts)
    if (nodes.length >= 4) decouplingScore += 5;
    if (hasRetention && hasAudience) decouplingScore += 5;

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
  const hasLB = Boolean(snapshot?.hasLoadBalancer) || nodes.some(n => /load balancer|alb|nginx|gateway/i.test(n.type + ' ' + n.label));
  const hasCache = Boolean(snapshot?.hasCachingLayer) || nodes.some(n => /redis|cache/i.test(n.type + ' ' + n.label));
  const hasQueue = Boolean(snapshot?.hasQueue) || nodes.some(n => /kafka|queue/i.test(n.type + ' ' + n.label));
  const hasDB = Boolean(snapshot?.hasDatabase) || nodes.some(n => /db|postgres|sql/i.test(n.type + ' ' + n.label));
  const hasCDN = nodes.some(n => /cdn|cloudflare/i.test(n.type + ' ' + n.label));

  const scalabilityRating = nodes.length === 0 ? 0 : Math.min(98, Math.round(
    (hasLB || hasCDN ? 38 : 12) +
    (hasCache ? 32 : 10) +
    (hasQueue ? 25 : 8) +
    (finalScore >= 75 ? 5 : 0)
  ));

  const reliabilityRating = nodes.length === 0 ? 0 : Math.min(98, Math.round(
    (hasDB ? 40 : 10) +
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
