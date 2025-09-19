import { NextRequest, NextResponse } from 'next/server';
import {
  trackGeneration,
  trackUserFeedback,
  analyzeSuccessPatterns,
  getRecommendations,
  exportAnalyticsData
} from '@/lib/analytics-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    switch (type) {
      case 'generation':
        const sessionId = trackGeneration(data);
        return NextResponse.json({ success: true, sessionId });

      case 'feedback':
        trackUserFeedback(data);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const industry = searchParams.get('industry');

    switch (action) {
      case 'patterns':
        const patterns = analyzeSuccessPatterns();
        return NextResponse.json({ success: true, patterns });

      case 'recommendations':
        if (!industry) {
          return NextResponse.json(
            { error: 'Industry parameter required for recommendations' },
            { status: 400 }
          );
        }
        const recommendations = getRecommendations(industry);
        return NextResponse.json({ success: true, recommendations });

      case 'export':
        const analyticsData = exportAnalyticsData();
        return NextResponse.json({ success: true, data: analyticsData });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}