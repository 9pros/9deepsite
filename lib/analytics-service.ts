// Analytics service for tracking user behavior and website generation feedback
// This helps improve model performance by understanding user preferences

export interface GenerationEvent {
  sessionId: string;
  timestamp: Date;
  industry: string;
  prompt: string;
  model: string;
  layoutVariation: string;
  colorScheme: string;
  animationStyle: string;
  websiteQuality?: number; // 1-5 rating if user provides feedback
}

export interface UserFeedbackEvent {
  sessionId: string;
  timestamp: Date;
  action: 'regenerate' | 'publish' | 'deploy' | 'save' | 'like' | 'dislike';
  generationId: string;
  timeSpentOnSite: number; // milliseconds
  improvements?: string; // user suggestions
}

// In-memory storage for demo purposes (in production, use a database)
let generationHistory: GenerationEvent[] = [];
let feedbackHistory: UserFeedbackEvent[] = [];

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Track a website generation
export function trackGeneration(event: Omit<GenerationEvent, 'timestamp' | 'sessionId'>): string {
  const sessionId = generateSessionId();
  const generationEvent: GenerationEvent = {
    ...event,
    sessionId,
    timestamp: new Date()
  };

  generationHistory.push(generationEvent);

  // Keep only last 1000 entries to prevent memory issues
  if (generationHistory.length > 1000) {
    generationHistory = generationHistory.slice(-1000);
  }

  return sessionId;
}

// Track user feedback/actions
export function trackUserFeedback(event: Omit<UserFeedbackEvent, 'timestamp'>): void {
  const feedbackEvent: UserFeedbackEvent = {
    ...event,
    timestamp: new Date()
  };

  feedbackHistory.push(feedbackEvent);

  // Keep only last 1000 entries to prevent memory issues
  if (feedbackHistory.length > 1000) {
    feedbackHistory = feedbackHistory.slice(-1000);
  }
}

// Analyze feedback patterns to identify successful design combinations
export function analyzeSuccessPatterns(): {
  topPerformingLayouts: string[];
  topPerformingColors: string[];
  topPerformingAnimations: string[];
  industryPreferences: Record<string, any>;
  publishToRegenerateRatio: number;
} {
  // Calculate publish vs regenerate ratio
  const publishActions = feedbackHistory.filter(f => f.action === 'publish' || f.action === 'deploy');
  const regenerateActions = feedbackHistory.filter(f => f.action === 'regenerate');
  const publishToRegenerateRatio = publishActions.length / Math.max(regenerateActions.length, 1);

  // Find generations that led to positive actions (publish/deploy/save)
  const successfulSessionIds = feedbackHistory
    .filter(f => ['publish', 'deploy', 'save'].includes(f.action))
    .map(f => f.sessionId);

  const successfulGenerations = generationHistory.filter(g =>
    successfulSessionIds.includes(g.sessionId)
  );

  // Count successful layout variations
  const layoutCounts: Record<string, number> = {};
  const colorCounts: Record<string, number> = {};
  const animationCounts: Record<string, number> = {};
  const industryData: Record<string, any> = {};

  successfulGenerations.forEach(gen => {
    // Count layouts
    layoutCounts[gen.layoutVariation] = (layoutCounts[gen.layoutVariation] || 0) + 1;

    // Count colors
    colorCounts[gen.colorScheme] = (colorCounts[gen.colorScheme] || 0) + 1;

    // Count animations
    animationCounts[gen.animationStyle] = (animationCounts[gen.animationStyle] || 0) + 1;

    // Industry analysis
    if (!industryData[gen.industry]) {
      industryData[gen.industry] = {
        totalGenerations: 0,
        successfulGenerations: 0,
        topLayouts: {},
        topColors: {},
        topAnimations: {}
      };
    }
    industryData[gen.industry].successfulGenerations++;
    industryData[gen.industry].topLayouts[gen.layoutVariation] =
      (industryData[gen.industry].topLayouts[gen.layoutVariation] || 0) + 1;
    industryData[gen.industry].topColors[gen.colorScheme] =
      (industryData[gen.industry].topColors[gen.colorScheme] || 0) + 1;
    industryData[gen.industry].topAnimations[gen.animationStyle] =
      (industryData[gen.industry].topAnimations[gen.animationStyle] || 0) + 1;
  });

  // Calculate totals for industries
  generationHistory.forEach(gen => {
    if (industryData[gen.industry]) {
      industryData[gen.industry].totalGenerations++;
    }
  });

  // Sort by popularity
  const topPerformingLayouts = Object.entries(layoutCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([layout]) => layout);

  const topPerformingColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color);

  const topPerformingAnimations = Object.entries(animationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([animation]) => animation);

  return {
    topPerformingLayouts,
    topPerformingColors,
    topPerformingAnimations,
    industryPreferences: industryData,
    publishToRegenerateRatio
  };
}

// Get intelligent recommendations based on historical data
export function getRecommendations(industry: string): {
  recommendedLayout: string;
  recommendedColor: string;
  recommendedAnimation: string;
  confidence: number;
} {
  const patterns = analyzeSuccessPatterns();

  // Industry-specific recommendations if available
  const industryData = patterns.industryPreferences[industry];

  if (industryData && industryData.successfulGenerations > 3) {
    const topLayout = Object.entries(industryData.topLayouts)
      .sort((a: any, b: any) => b[1] - a[1])[0];
    const topColor = Object.entries(industryData.topColors)
      .sort((a: any, b: any) => b[1] - a[1])[0];
    const topAnimation = Object.entries(industryData.topAnimations)
      .sort((a: any, b: any) => b[1] - a[1])[0];

    return {
      recommendedLayout: topLayout?.[0] || patterns.topPerformingLayouts[0] || 'Modern minimalist with generous white space',
      recommendedColor: topColor?.[0] || patterns.topPerformingColors[0] || 'Deep navy (#1e293b) with bright blue (#3b82f6) accents',
      recommendedAnimation: topAnimation?.[0] || patterns.topPerformingAnimations[0] || 'Subtle fade-in on scroll effects',
      confidence: Math.min(industryData.successfulGenerations / 10, 1) // Max confidence of 1.0
    };
  }

  // Fall back to global recommendations
  return {
    recommendedLayout: patterns.topPerformingLayouts[0] || 'Modern minimalist with generous white space',
    recommendedColor: patterns.topPerformingColors[0] || 'Deep navy (#1e293b) with bright blue (#3b82f6) accents',
    recommendedAnimation: patterns.topPerformingAnimations[0] || 'Subtle fade-in on scroll effects',
    confidence: 0.3 // Lower confidence for global fallback
  };
}

// Export analytics data for external analysis
export function exportAnalyticsData(): {
  generations: GenerationEvent[];
  feedback: UserFeedbackEvent[];
  patterns: ReturnType<typeof analyzeSuccessPatterns>;
} {
  return {
    generations: generationHistory,
    feedback: feedbackHistory,
    patterns: analyzeSuccessPatterns()
  };
}

// Clear analytics data (for testing or privacy)
export function clearAnalyticsData(): void {
  generationHistory = [];
  feedbackHistory = [];
}