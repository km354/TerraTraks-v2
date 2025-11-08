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
    const body: GenerateItineraryRequest = await request.json();

    // Validate required fields
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 }
      );
    }

    // Check user's subscription status for itinerary limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscriptionStatus: true,
        _count: { select: { itineraries: true } }
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
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const duration = body.duration || Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Build the prompt for OpenAI
    const prompt = buildItineraryPrompt(body, duration);

    // Call OpenAI API
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

    const itineraryContent = completion.choices[0]?.message?.content || '';

    if (!itineraryContent) {
      return NextResponse.json(
        { error: 'Failed to generate itinerary. Please try again.' },
        { status: 500 }
      );
    }

    // Generate a title if not provided
    const title = body.title || `Trip to ${body.destination}`;

    // Save itinerary to database
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title,
        destination: body.destination,
        description: body.description || itineraryContent.substring(0, 500), // Use first 500 chars as description
        startDate: startDate,
        endDate: endDate,
        isPublic: false,
        items: {
          create: parseItineraryContent(itineraryContent, startDate),
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
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Build the prompt for OpenAI based on user inputs
 */
function buildItineraryPrompt(data: GenerateItineraryRequest, duration: number): string {
  const parts: string[] = [];

  parts.push(`You are an expert travel guide. Plan a ${duration}-day trip to ${data.destination}.`);

  // Group information
  if (data.groupSize) {
    parts.push(`Traveling as: ${data.groupSize}.`);
  }

  if (data.travelingWith.length > 0) {
    parts.push(`Traveling with: ${data.travelingWith.join(', ')}.`);
  }

  // Interests
  if (data.interests.length > 0) {
    parts.push(`Interests and activities: ${data.interests.join(', ')}.`);
  }

  // Difficulty level
  if (data.difficulty) {
    const difficultyMap: Record<string, string> = {
      easy: 'easy and relaxed',
      moderate: 'moderate',
      challenging: 'challenging and adventurous',
      extreme: 'extreme and very strenuous',
    };
    parts.push(`Activity level: ${difficultyMap[data.difficulty] || data.difficulty}.`);
  }

  // Budget
  if (data.budget) {
    parts.push(`Budget: $${parseFloat(data.budget).toLocaleString()} total for the trip.`);
  } else if (data.budgetRange) {
    const budgetMap: Record<string, string> = {
      budget: 'budget-friendly (under $500 per person)',
      moderate: 'moderate ($500 - $1,500 per person)',
      comfortable: 'comfortable ($1,500 - $3,000 per person)',
      luxury: 'luxury ($3,000+ per person)',
    };
    parts.push(`Budget range: ${budgetMap[data.budgetRange] || data.budgetRange}.`);
  }

  // Additional notes
  if (data.description) {
    parts.push(`Additional preferences: ${data.description}`);
  }

  parts.push(`
Please create a detailed day-by-day itinerary with:
- Specific activities and attractions for each day
- Recommended times for each activity
- Practical tips and recommendations
- Restaurant suggestions (if applicable)
- Transportation options
- Any special considerations based on the group and interests

Format the response in clear sections for each day. Make it practical, engaging, and tailored to the specified interests and activity level.
  `);

  return parts.join(' ');
}

/**
 * Parse the AI-generated itinerary content into structured items
 * Extracts day-by-day activities from the markdown-formatted response
 */
function parseItineraryContent(content: string, startDate: Date): Array<{
  title: string;
  description: string | null;
  location: string | null;
  date: Date;
  category: string | null;
  order: number;
}> {
  const items: Array<{
    title: string;
    description: string | null;
    location: string | null;
    date: Date;
    category: string | null;
    order: number;
  }> = [];

  const lines = content.split('\n');
  let currentDay = 0;
  let currentOrder = 0;
  let currentActivity: { title: string; description: string[]; location: string | null } | null = null;
  
  // Regex patterns
  const dayRegex = /^#+\s*(?:day\s+)?(\d+)|^day\s+(\d+)|^day\s+(one|two|three|four|five|six|seven)/i;
  const activityRegex = /^[-*•]\s+|^\d+[.)]\s+/;
  const timeRegex = /\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?|\d{1,2}\s*(?:AM|PM|am|pm))\b/;
  const locationRegex = /📍|at\s+([^,\.]+)|location[:\s]+([^,\.]+)/i;

  const dayNames: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a day marker
    const dayMatch = line.match(dayRegex);
    if (dayMatch) {
      // Save previous activity if exists
      if (currentActivity) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (currentDay - 1));
        items.push({
          title: currentActivity.title,
          description: currentActivity.description.join(' ').trim() || null,
          location: currentActivity.location,
          date,
          category: determineCategory(currentActivity.title + ' ' + currentActivity.description.join(' ')),
          order: currentOrder++,
        });
        currentActivity = null;
      }

      // Extract day number
      const dayNum = dayMatch[1] 
        ? parseInt(dayMatch[1]) 
        : dayMatch[2] 
        ? parseInt(dayMatch[2])
        : dayNames[dayMatch[3]?.toLowerCase() || ''] || 0;
      
      if (dayNum > 0) {
        currentDay = dayNum;
        currentOrder = 0;
      }
      continue;
    }

    // Skip empty lines, headers, and markdown formatting
    if (!line || line.startsWith('#') || line.match(/^={3,}$|^-{3,}$/)) {
      continue;
    }

    // Check if this is an activity line (bullet point or numbered)
    if (activityRegex.test(line)) {
      // Save previous activity
      if (currentActivity) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (currentDay - 1));
        items.push({
          title: currentActivity.title,
          description: currentActivity.description.join(' ').trim() || null,
          location: currentActivity.location,
          date,
          category: determineCategory(currentActivity.title + ' ' + currentActivity.description.join(' ')),
          order: currentOrder++,
        });
      }

      // Extract activity title (remove bullet/number prefix)
      const activityText = line.replace(/^[-*•\d.\s)]+/, '').trim();
      
      // Split title and description if there's a colon or dash
      const parts = activityText.split(/[:\-–—]/).map(p => p.trim());
      const title = parts[0];
      const description = parts.length > 1 ? [parts.slice(1).join(' - ')] : [];

      // Extract location if present
      const locationMatch = activityText.match(locationRegex);
      const location = locationMatch ? (locationMatch[1] || locationMatch[2] || '').trim() : null;

      currentActivity = {
        title: title.length > 150 ? title.substring(0, 150) : title,
        description,
        location,
      };
    } else if (currentActivity && line.length > 0) {
      // Continue building description for current activity
      if (!line.match(/^#{1,3}\s/)) { // Don't add headers as descriptions
        currentActivity.description.push(line);
        
        // Check for location in description lines
        if (!currentActivity.location) {
          const locationMatch = line.match(locationRegex);
          if (locationMatch) {
            currentActivity.location = (locationMatch[1] || locationMatch[2] || '').trim();
          }
        }
      }
    }
  }

  // Save last activity
  if (currentActivity) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (currentDay - 1));
    items.push({
      title: currentActivity.title,
      description: currentActivity.description.join(' ').trim() || null,
      location: currentActivity.location,
      date,
      category: determineCategory(currentActivity.title + ' ' + currentActivity.description.join(' ')),
      order: currentOrder++,
    });
  }

  // If no items were parsed, create a default item with the full content
  if (items.length === 0) {
    items.push({
      title: 'Generated Itinerary',
      description: content.substring(0, 2000),
      location: null,
      date: startDate,
      category: 'activity',
      order: 0,
    });
  }

  return items;
}

/**
 * Determine category based on content
 */
function determineCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.match(/\b(eat|restaurant|food|dining|breakfast|lunch|dinner|meal|cafe|bakery)\b/)) {
    return 'food';
  } else if (lowerText.match(/\b(hotel|stay|accommodation|lodging|resort|hostel)\b/)) {
    return 'accommodation';
  } else if (lowerText.match(/\b(transport|drive|fly|flight|train|bus|car rental|taxi)\b/)) {
    return 'transportation';
  }
  
  return 'activity';
}

