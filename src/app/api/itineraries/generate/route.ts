/**
 * Generate Itinerary API Route
 * 
 * Creates a personalized itinerary using OpenAI API
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOpenAIClient } from '@/lib/openai';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

interface GenerateItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number | null;
  interests: string[];
  difficulty: string;
  budget: string;
  budgetRange: string;
  groupSize: string;
  travelingWith: string[];
  title: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    let body: GenerateItineraryRequest;
    
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check user's subscription status for itinerary limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscriptionStatus: true,
        _count: { 
          select: { 
            itineraries: {
              where: {
                isPreset: false, // Don't count preset itineraries
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check itinerary limit for free users
    const isPremium = user.subscriptionStatus === 'active';
    const itineraryCount = user._count.itineraries;
    
    if (!isPremium && itineraryCount >= 3) {
      return NextResponse.json(
        { 
          error: 'Free plan limit reached. Upgrade to Premium for unlimited itineraries.',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Calculate duration if not provided
    const duration = body.duration || Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Validate duration
    if (duration < 1 || duration > 365) {
      return NextResponse.json(
        { error: 'Trip duration must be between 1 and 365 days' },
        { status: 400 }
      );
    }

    // Build the prompt for OpenAI
    const prompt = buildItineraryPrompt(body, duration);

    // Call OpenAI API with error handling
    let itineraryContent: string;
    try {
      const openai = getOpenAIClient();
      const model = isPremium ? 'gpt-4' : 'gpt-3.5-turbo'; // Premium users get GPT-4
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an expert travel guide and itinerary planner. Create detailed, practical, and engaging travel itineraries. 

Format your response as follows:
- Use clear day-by-day sections (Day 1, Day 2, etc.)
- For each day, list activities with:
  * Activity name/title
  * Brief description
  * Recommended time (if applicable)
  * Location (if specific)
- Include practical tips and recommendations
- Make it engaging and tailored to the user's interests

Use markdown formatting with clear headings for each day.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      itineraryContent = completion.choices[0]?.message?.content || '';

      if (!itineraryContent || itineraryContent.trim().length === 0) {
        throw new Error('OpenAI returned empty response');
      }
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      
      // Handle specific OpenAI errors
      if (openaiError instanceof OpenAI.APIError) {
        if (openaiError.status === 429) {
          return NextResponse.json(
            { error: 'AI service is temporarily unavailable. Please try again in a few moments.' },
            { status: 503 }
          );
        }
        if (openaiError.status === 401) {
          return NextResponse.json(
            { error: 'AI service configuration error. Please contact support.' },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { error: `AI service error: ${openaiError.message}` },
          { status: 500 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { error: 'Failed to generate itinerary. Please try again.' },
        { status: 500 }
      );
    }

    // Generate a title if not provided
    const title = body.title || `Trip to ${body.destination}`;

    // Parse budget if provided
    const budget = body.budget ? parseFloat(body.budget) : null;
    const budgetCurrency = 'USD'; // Default to USD, can be made configurable later

    // Validate budget if provided
    if (budget !== null && (isNaN(budget) || budget < 0)) {
      return NextResponse.json(
        { error: 'Invalid budget amount' },
        { status: 400 }
      );
    }

    // Parse itinerary content into items
    let itineraryItems;
    try {
      itineraryItems = parseItineraryContent(itineraryContent, startDate);
    } catch (parseError) {
      console.error('Error parsing itinerary content:', parseError);
      // Continue with empty items array - better than failing completely
      itineraryItems = [];
    }

    // Save itinerary to database
    try {
      const itinerary = await prisma.itinerary.create({
        data: {
          userId,
          title,
          destination: body.destination,
          description: body.description || itineraryContent.substring(0, 500), // Use first 500 chars as description
          startDate: startDate,
          endDate: endDate,
          budget: budget,
          budgetCurrency: budgetCurrency,
          isPublic: false,
          isPreset: false,
          items: {
            create: itineraryItems,
          },
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json({
        success: true,
        itinerary: {
          id: itinerary.id,
          title: itinerary.title,
          destination: itinerary.destination,
        },
      });
    } catch (dbError: any) {
      console.error('Database error creating itinerary:', dbError);
      return NextResponse.json(
        { error: 'Failed to save itinerary. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error generating itinerary:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Build the prompt for OpenAI based on user inputs
 */
function buildItineraryPrompt(data: GenerateItineraryRequest, duration: number): string {
  const interestsText = data.interests.length > 0
    ? data.interests.join(', ')
    : 'general sightseeing and exploration';

  const difficultyText = data.difficulty
    ? `Difficulty level: ${data.difficulty}`
    : '';

  const budgetText = data.budget
    ? `Budget: $${data.budget}`
    : data.budgetRange
    ? `Budget range: ${data.budgetRange}`
    : '';

  const groupSizeText = data.groupSize || '';
  const travelingWithText = data.travelingWith.length > 0
    ? `Traveling with: ${data.travelingWith.join(', ')}`
    : '';

  const startDateFormatted = new Date(data.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const endDateFormatted = new Date(data.endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `Create a detailed ${duration}-day travel itinerary for ${data.destination}.

Trip Dates: ${startDateFormatted} to ${endDateFormatted}
Interests: ${interestsText}
${difficultyText ? `${difficultyText}\n` : ''}${budgetText ? `${budgetText}\n` : ''}${groupSizeText ? `Group size: ${groupSizeText}\n` : ''}${travelingWithText ? `${travelingWithText}\n` : ''}

Please create a day-by-day itinerary with:
- Specific activities and attractions
- Recommended times for each activity
- Locations/addresses when possible
- Practical tips and recommendations
- Information about crowd levels if relevant
- Suggestions for meals and accommodations if applicable

Make the itinerary engaging, practical, and tailored to the specified interests and preferences.`;
}

/**
 * Parse AI-generated itinerary content into structured items
 */
function parseItineraryContent(content: string, startDate: Date): Array<{
  title: string;
  description: string | null;
  location: string | null;
  startTime: Date | null;
  endTime: Date | null;
  date: Date | null;
  category: string | null;
  order: number;
}> {
  const items: Array<{
    title: string;
    description: string | null;
    location: string | null;
    startTime: Date | null;
    endTime: Date | null;
    date: Date | null;
    category: string | null;
    order: number;
  }> = [];

  try {
    // Split content by day markers (Day 1, Day 2, etc.)
    const dayRegex = /(?:^|\n)(?:#+\s*)?(?:Day\s+)?(\d+)[:.\-\s]*(.*?)(?=(?:^|\n)(?:#+\s*)?(?:Day\s+)?\d+[:.\-]|$)/gis;
    const dayMatches = Array.from(content.matchAll(dayRegex));

    if (dayMatches.length === 0) {
      // Fallback: treat entire content as single day
      const lines = content.split('\n').filter(line => line.trim());
      lines.forEach((line, index) => {
        if (line.trim() && !line.match(/^#+\s/)) {
          items.push({
            title: line.trim().replace(/^[-*•]\s*/, '').substring(0, 200),
            description: null,
            location: null,
            startTime: null,
            endTime: null,
            date: new Date(startDate),
            category: 'activity',
            order: index,
          });
        }
      });
      return items;
    }

    dayMatches.forEach((match, dayIndex) => {
      const dayNumber = parseInt(match[1] || '1', 10);
      const dayContent = match[2] || match[0];

      // Calculate date for this day
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

      // Extract activities from day content
      const activityLines = dayContent
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed && 
                 !trimmed.match(/^#+\s/) && 
                 !trimmed.match(/^Day\s+\d+/i) &&
                 trimmed.length > 3;
        });

      activityLines.forEach((line, activityIndex) => {
        const trimmed = line.trim().replace(/^[-*•]\s*/, '');
        
        if (trimmed.length < 3) return;

        // Try to extract location from line (look for patterns like "at X" or "in Y")
        let location: string | null = null;
        const locationMatch = trimmed.match(/(?:at|in|near|visit)\s+([A-Z][^,.!?]+(?:,\s*[A-Z][^,.!?]+)*)/i);
        if (locationMatch) {
          location = locationMatch[1].trim();
        }

        // Try to extract time
        let startTime: Date | null = null;
        let endTime: Date | null = null;
        const timeMatch = trimmed.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/i);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
          const isPM = timeMatch[3]?.toLowerCase() === 'pm';
          const adjustedHours = isPM && hours !== 12 ? hours + 12 : (!isPM && hours === 12 ? 0 : hours);
          
          startTime = new Date(dayDate);
          startTime.setHours(adjustedHours, minutes, 0, 0);
        }

        // Determine category based on content
        let category: string = 'activity';
        const lowerTrimmed = trimmed.toLowerCase();
        if (lowerTrimmed.includes('hotel') || lowerTrimmed.includes('accommodation') || lowerTrimmed.includes('lodge')) {
          category = 'accommodation';
        } else if (lowerTrimmed.includes('restaurant') || lowerTrimmed.includes('dinner') || lowerTrimmed.includes('lunch') || lowerTrimmed.includes('breakfast') || lowerTrimmed.includes('eat')) {
          category = 'food';
        } else if (lowerTrimmed.includes('drive') || lowerTrimmed.includes('transport') || lowerTrimmed.includes('airport')) {
          category = 'transportation';
        }

        items.push({
          title: trimmed.substring(0, 200),
          description: trimmed.length > 200 ? trimmed.substring(200) : null,
          location: location,
          startTime: startTime,
          endTime: null,
          date: dayDate,
          category: category,
          order: dayIndex * 100 + activityIndex,
        });
      });
    });

    // If no items were parsed, create at least one item from the content
    if (items.length === 0) {
      const firstLine = content.split('\n').find(line => line.trim().length > 10);
      if (firstLine) {
        items.push({
          title: firstLine.trim().substring(0, 200),
          description: content.substring(firstLine.length).trim() || null,
          location: null,
          startTime: null,
          endTime: null,
          date: startDate,
          category: 'activity',
          order: 0,
        });
      }
    }
  } catch (error) {
    console.error('Error parsing itinerary content:', error);
    // Return at least one item so itinerary can be created
    items.push({
      title: `Trip to ${startDate.toLocaleDateString()}`,
      description: 'Itinerary details',
      location: null,
      startTime: null,
      endTime: null,
      date: startDate,
      category: 'activity',
      order: 0,
    });
  }

  return items;
}
