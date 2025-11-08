/**
 * Crowd Level Prediction Utility
 * 
 * Provides crowd level predictions for locations based on dates and AI analysis
 */

import { getOpenAIClient } from './openai';

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface CrowdLevelPrediction {
  level: CrowdLevel;
  confidence: 'high' | 'medium' | 'low';
  reasoning?: string;
  factors?: string[];
}

/**
 * Check if a date is a US holiday
 */
function isUSHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay();

  // New Year's Day
  if (month === 1 && day === 1) return true;
  
  // Martin Luther King Jr. Day (third Monday in January)
  if (month === 1 && dayOfWeek === 1 && day > 14 && day < 22) return true;
  
  // Presidents' Day (third Monday in February)
  if (month === 2 && dayOfWeek === 1 && day > 14 && day < 22) return true;
  
  // Memorial Day (last Monday in May)
  if (month === 5 && dayOfWeek === 1 && day > 24) return true;
  
  // Independence Day
  if (month === 7 && day === 4) return true;
  
  // Labor Day (first Monday in September)
  if (month === 9 && dayOfWeek === 1 && day < 8) return true;
  
  // Columbus Day (second Monday in October)
  if (month === 10 && dayOfWeek === 1 && day > 7 && day < 15) return true;
  
  // Veterans Day
  if (month === 11 && day === 11) return true;
  
  // Thanksgiving (fourth Thursday in November)
  if (month === 11 && dayOfWeek === 4 && day > 21 && day < 29) return true;
  
  // Christmas
  if (month === 12 && day === 25) return true;

  // Check for holiday weekends (Friday before or Monday after)
  const dayBefore = new Date(date);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + 1);
  
  if (isUSHoliday(dayBefore) || isUSHoliday(dayAfter)) return true;

  return false;
}

/**
 * Get season based on date
 */
function getSeason(date: Date): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = date.getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

/**
 * Predict crowd level using heuristics
 */
function predictCrowdLevelHeuristic(
  location: string,
  date: Date
): CrowdLevelPrediction {
  const factors: string[] = [];
  let score = 0; // 0 = low, 1 = moderate, 2 = high, 3 = very high

  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = isUSHoliday(date);
  const season = getSeason(date);
  const month = date.getMonth() + 1;

  // Weekend factor
  if (isWeekend) {
    score += 1;
    factors.push('Weekend');
  }

  // Holiday factor
  if (isHoliday) {
    score += 2;
    factors.push('Holiday');
  }

  // Summer season (peak travel season)
  if (season === 'summer') {
    score += 1;
    factors.push('Summer season');
  }

  // Spring break (March-April)
  if ((month === 3 || month === 4) && !isWeekend) {
    score += 0.5;
    factors.push('Spring break season');
  }

  // Holiday season (December)
  if (month === 12) {
    score += 1;
    factors.push('Holiday season');
  }

  // National parks are typically busier in summer
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('national park') || lowerLocation.includes('np')) {
    if (season === 'summer') {
      score += 1;
      factors.push('National park peak season');
    }
    if (isWeekend && season === 'summer') {
      score += 0.5;
    }
  }

  // Determine level based on score
  let level: CrowdLevel;
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let reasoning: string;

  if (score >= 4) {
    level = 'very_high';
    reasoning = 'Expect very high crowds due to peak conditions';
  } else if (score >= 2.5) {
    level = 'high';
    reasoning = 'Expect high crowds';
  } else if (score >= 1) {
    level = 'moderate';
    reasoning = 'Expect moderate crowds';
  } else {
    level = 'low';
    reasoning = 'Expect lower crowds';
  }

  // Increase confidence if multiple factors align
  if (factors.length >= 3) {
    confidence = 'high';
  } else if (factors.length >= 2) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    level,
    confidence,
    reasoning,
    factors,
  };
}

/**
 * Predict crowd level using AI (OpenAI)
 */
export async function predictCrowdLevelAI(
  location: string,
  date: Date
): Promise<CrowdLevelPrediction | null> {
  try {
    const openai = getOpenAIClient();

    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      weekday: 'long',
    });

    const season = getSeason(date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = isUSHoliday(date);

    const prompt = `You are a travel expert with knowledge of crowd patterns at popular destinations.

Location: ${location}
Date: ${dateStr}
Season: ${season}
Weekend: ${isWeekend ? 'Yes' : 'No'}
Holiday: ${isHoliday ? 'Yes' : 'No'}

Based on this information, predict the expected crowd level at this location on this date.

Consider:
- Typical seasonal patterns for this type of location
- Weekend vs weekday patterns
- Holiday periods
- Location-specific factors (e.g., national parks are busier in summer, beaches in summer, ski resorts in winter)

Respond in JSON format with this structure:
{
  "level": "low" | "moderate" | "high" | "very_high",
  "confidence": "high" | "medium" | "low",
  "reasoning": "Brief explanation (1-2 sentences)",
  "factors": ["factor1", "factor2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent predictions
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          level: parsed.level || 'moderate',
          confidence: parsed.confidence || 'medium',
          reasoning: parsed.reasoning,
          factors: parsed.factors || [],
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
    }

    return null;
  } catch (error) {
    console.error('Error predicting crowd level with AI:', error);
    return null;
  }
}

/**
 * Predict crowd level (uses AI if available, falls back to heuristics)
 */
export async function predictCrowdLevel(
  location: string,
  date: Date,
  useAI: boolean = true
): Promise<CrowdLevelPrediction> {
  // Try AI prediction first (for premium users or if enabled)
  if (useAI) {
    const aiPrediction = await predictCrowdLevelAI(location, date);
    if (aiPrediction) {
      return aiPrediction;
    }
  }

  // Fall back to heuristic prediction
  return predictCrowdLevelHeuristic(location, date);
}

/**
 * Get crowd level display info
 */
export function getCrowdLevelDisplay(level: CrowdLevel): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  switch (level) {
    case 'very_high':
      return {
        label: 'Very High',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: '🔴',
      };
    case 'high':
      return {
        label: 'High',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: '🟠',
      };
    case 'moderate':
      return {
        label: 'Moderate',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: '🟡',
      };
    case 'low':
    default:
      return {
        label: 'Low',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: '🟢',
      };
  }
}

