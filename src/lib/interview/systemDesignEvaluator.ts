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

export function evaluateSystemTopology(
  snapshot: SystemTopologySnapshot,
  topic: string = 'Distributed Architecture',
  domainStream: 'tech' | 'non_tech' = 'tech'
): ArchitectureEvaluationResult {
  let score = 50;
  const strengths: string[] = [];
  const bottlenecks: string[] = [];
  const recommendations: string[] = [];

  if (domainStream === 'non_tech') {
    const hasAudience = snapshot.nodes.some(n => n.type.toLowerCase().includes('audience') || n.type.toLowerCase().includes('segment'));
    const hasFunnel = snapshot.nodes.some(n => n.type.toLowerCase().includes('funnel') || n.type.toLowerCase().includes('landing'));
    const hasCheckout = snapshot.nodes.some(n => n.type.toLowerCase().includes('checkout') || n.type.toLowerCase().includes('payment'));
    const hasRetention = snapshot.nodes.some(n => n.type.toLowerCase().includes('retention') || n.type.toLowerCase().includes('crm'));

    if (hasAudience) { score += 12; strengths.push('Clear target customer segmentation defined'); }
    else { bottlenecks.push('Missing initial target market / customer segment'); recommendations.push('Define explicit target customer segment node'); }

    if (hasFunnel) { score += 12; strengths.push('Conversion funnel & landing sequence established'); }
    else { bottlenecks.push('No conversion funnel between customer acquisition and checkout'); recommendations.push('Add landing page or conversion funnel'); }

    if (hasCheckout) { score += 14; strengths.push('Monetization & checkout mechanics articulated'); }
    else { bottlenecks.push('Missing explicit monetization / checkout step'); recommendations.push('Add checkout engine or revenue capture mechanism'); }

    if (hasRetention) { score += 12; strengths.push('Customer retention loop / LTV multiplier incorporated'); }
    else { recommendations.push('Add retention loop or CRM node to maximize customer lifetime value'); }
  } else {
    if (snapshot.hasLoadBalancer) {
      score += 12;
      strengths.push('Traffic distribution enabled via Load Balancer');
    } else {
      bottlenecks.push('Single point of failure: Client directly connects to backend without Load Balancer');
      recommendations.push('Introduce a Load Balancer or API Gateway to decouple clients from app servers');
    }

    if (snapshot.hasCachingLayer) {
      score += 14;
      strengths.push('Low-latency data retrieval with in-memory caching layer');
    } else {
      bottlenecks.push('Database bottleneck: High read throughput directly hits primary database');
      recommendations.push('Add a Redis / Memcached layer in front of the database for hot reads');
    }

    if (snapshot.hasDatabase) {
      score += 10;
      strengths.push('Persistent storage layer specified');
    } else {
      bottlenecks.push('No persistent database configured');
      recommendations.push('Add a Relational or NoSQL database for persistence');
    }

    if (snapshot.hasQueue) {
      score += 10;
      strengths.push('Asynchronous decoupling via message queue / event bus');
    } else {
      recommendations.push('Consider adding Kafka or a Queue for heavy asynchronous background jobs');
    }

    if (snapshot.isFullyConnected) {
      score += 8;
      strengths.push('End-to-end connected network topology');
    } else {
      bottlenecks.push('Disconnected nodes: Certain components lack directed connection arrows');
      recommendations.push('Ensure every node has ingress and egress links');
    }
  }

  const finalScore = Math.max(25, Math.min(98, score));
  const grade: ArchitectureEvaluationResult['grade'] = 
    finalScore >= 90 ? 'A+' :
    finalScore >= 80 ? 'A' :
    finalScore >= 70 ? 'B' :
    finalScore >= 55 ? 'C' : 'Needs Work';

  const spokenFeedback = finalScore >= 80
    ? `Impressive system design for ${topic}! Your topology effectively decouples the client tier, utilizes distributed components, and addresses high-availability requirements.`
    : `Good start on designing ${topic}. To make this production-ready, pay close attention to ${bottlenecks[0] || 'component decoupling'} and optimize for high throughput.`;

  return {
    score: finalScore,
    grade,
    scalabilityRating: Math.round(finalScore * 0.95),
    reliabilityRating: Math.round(finalScore * 0.90),
    strengths: strengths.length > 0 ? strengths : ['Basic topology established'],
    bottlenecks: bottlenecks.length > 0 ? bottlenecks : ['No critical single points of failure found'],
    recommendations: recommendations.length > 0 ? recommendations : ['Architecture meets baseline requirements'],
    summary: `System architecture scored ${finalScore}/100 (${grade}) for ${topic}. ${strengths.length} strengths identified.`,
    spokenFeedback
  };
}
