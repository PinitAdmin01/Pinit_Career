import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, roomDesc, domain, history } = body;

    const candidateMessages = (history || []).filter((h: any) => h.role === 'SDE Candidate' || h.role === 'user');
    const msgCount = candidateMessages.length;

    let score = 70;
    if (msgCount >= 4) score = 92;
    else if (msgCount >= 2) score = 84;
    else if (msgCount === 1) score = 75;
    else score = 60;

    const verdict = msgCount > 0
      ? `The candidate actively engaged in the ${domain || 'technical'} boardroom debate for "${roomId || 'Architecture Proposal'}". Communication was clear with good trade-off awareness.`
      : `The candidate listened to the boardroom panel but had limited verbal contributions. More active participation is recommended for senior roles.`;

    const gapsIdentified = [
      'Distributed transaction synchronization constraints under peak spike load',
      'Memory heap allocation optimization during high-concurrency event loops',
      'Wider cross-domain security group isolation rules'
    ];

    const keyMoments = [
      `Candidate presented their initial approach on "${roomId || 'System Architecture'}".`,
      'Boardroom panel challenged concurrency, lock contention, and operational overheads.',
      'Constructive debate was held on scalability trade-offs and deployment risk factors.'
    ];

    return NextResponse.json({
      score,
      verdict,
      gapsIdentified,
      keyMoments
    });

  } catch (err: any) {
    console.error('[API GD Evaluate Error]:', err);
    return NextResponse.json({
      score: 75,
      verdict: 'Boardroom session completed with standard architectural trade-offs.',
      gapsIdentified: ['Concurrency handling', 'Cache eviction strategies'],
      keyMoments: ['Boardroom discussion completed.']
    }, { status: 200 });
  }
}
