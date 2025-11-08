/**
 * Packing List Generator
 * 
 * Generates AI-powered packing lists based on weather, activities, and trip details
 */

import { getOpenAIClient } from './openai';
import { WeatherSummary } from './weather';

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  essential: boolean;
  quantity?: string;
  notes?: string;
}

export interface PackingList {
  items: PackingItem[];
  summary: string;
  tips: string[];
}

/**
 * Generate packing list using OpenAI
 */
export async function generatePackingList(
  destination: string,
  duration: number,
  startDate: Date,
  endDate: Date,
  weatherSummary: WeatherSummary | null,
  activities: string[],
  interests: string[],
  isPremium: boolean = false
): Promise<PackingList | null> {
  try {
    const openai = getOpenAIClient();

    // Build weather context
    let weatherContext = 'Weather information not available.';
    if (weatherSummary) {
      const { averageHigh, averageLow, conditions, forecasts } = weatherSummary;
      const tempUnit = '°C'; // Using metric from OpenWeatherMap
      const tempHighF = Math.round((averageHigh * 9) / 5 + 32);
      const tempLowF = Math.round((averageLow * 9) / 5 + 32);
      
      weatherContext = `Expected weather during the trip:
- Average high temperature: ${averageHigh}°C (${tempHighF}°F)
- Average low temperature: ${averageLow}°C (${tempLowF}°F)
- Conditions: ${conditions.join(', ')}
- Number of forecast days: ${forecasts.length}`;

      if (forecasts.length > 0) {
        const hasRain = forecasts.some(f => f.precipitation && f.precipitation > 0);
        const hasSnow = conditions.includes('snow');
        if (hasRain) weatherContext += '\n- Rain expected during the trip';
        if (hasSnow) weatherContext += '\n- Snow expected during the trip';
      }
    }

    // Build activities context
    const activitiesContext = activities.length > 0
      ? `Planned activities: ${activities.join(', ')}`
      : 'Activities: General travel';

    // Build interests context
    const interestsContext = interests.length > 0
      ? `Travel interests: ${interests.join(', ')}`
      : '';

    const dateStr = startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const prompt = `You are a travel packing expert. Generate a comprehensive packing list for a trip.

Trip Details:
- Destination: ${destination}
- Duration: ${duration} ${duration === 1 ? 'day' : 'days'}
- Travel dates: Starting ${dateStr}
${weatherContext}
${activitiesContext}
${interestsContext}

Generate a detailed packing list that includes:
1. Clothing appropriate for the weather conditions
2. Items needed for the planned activities
3. Essential travel items
4. Any specialty items based on interests

Format your response as a JSON object with this structure:
{
  "items": [
    {
      "name": "Item name",
      "category": "Clothing | Electronics | Toiletries | Documents | Other",
      "essential": true/false,
      "quantity": "Optional quantity recommendation (e.g., '2-3 pairs', '1 per day')",
      "notes": "Optional helpful notes about the item"
    }
  ],
  "summary": "Brief summary of packing recommendations (2-3 sentences)",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Categories should be: Clothing, Footwear, Electronics, Toiletries, Documents, Gear/Equipment, Medications, Food/Snacks, Other

Mark items as essential (true) if they are critical for the trip, false if they are optional but recommended.

Return ONLY the JSON object, no additional text.`;

    const model = isPremium ? 'gpt-4' : 'gpt-3.5-turbo';

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a travel packing expert. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5, // Lower temperature for more consistent, practical lists
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content || '';

    // Parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Add IDs to items
        const items: PackingItem[] = parsed.items.map((item: any, index: number) => ({
          id: `item-${index}`,
          name: item.name,
          category: item.category || 'Other',
          essential: item.essential !== false, // Default to true if not specified
          quantity: item.quantity,
          notes: item.notes,
        }));

        return {
          items,
          summary: parsed.summary || 'Pack according to weather and activities.',
          tips: parsed.tips || [],
        };
      }
    } catch (parseError) {
      console.error('Error parsing packing list JSON:', parseError);
      // Fallback to a basic list
      return generateFallbackPackingList(weatherSummary, duration);
    }

    return null;
  } catch (error) {
    console.error('Error generating packing list:', error);
    // Fallback to a basic list
    return generateFallbackPackingList(weatherSummary, duration);
  }
}

/**
 * Generate a fallback packing list when AI fails
 */
function generateFallbackPackingList(
  weatherSummary: WeatherSummary | null,
  duration: number
): PackingList {
  const items: PackingItem[] = [
    { id: '1', name: 'Passport/ID', category: 'Documents', essential: true },
    { id: '2', name: 'Travel documents', category: 'Documents', essential: true },
    { id: '3', name: 'Phone charger', category: 'Electronics', essential: true },
    { id: '4', name: 'Toothbrush', category: 'Toiletries', essential: true },
    { id: '5', name: 'Toothpaste', category: 'Toiletries', essential: true },
    { id: '6', name: 'Underwear', category: 'Clothing', essential: true, quantity: `${duration} pairs` },
    { id: '7', name: 'Socks', category: 'Clothing', essential: true, quantity: `${duration} pairs` },
  ];

  if (weatherSummary) {
    const { averageHigh, averageLow, conditions } = weatherSummary;
    
    if (averageLow < 10) {
      items.push(
        { id: '8', name: 'Warm jacket', category: 'Clothing', essential: true },
        { id: '9', name: 'Gloves', category: 'Clothing', essential: false },
        { id: '10', name: 'Beanie/hat', category: 'Clothing', essential: false }
      );
    }

    if (averageHigh > 25) {
      items.push(
        { id: '11', name: 'Sunscreen', category: 'Toiletries', essential: true },
        { id: '12', name: 'Hat', category: 'Clothing', essential: false },
        { id: '13', name: 'Sunglasses', category: 'Other', essential: false }
      );
    }

    if (conditions.includes('rain')) {
      items.push({ id: '14', name: 'Rain jacket', category: 'Clothing', essential: true });
    }

    if (conditions.includes('snow')) {
      items.push(
        { id: '15', name: 'Winter boots', category: 'Footwear', essential: true },
        { id: '16', name: 'Warm layers', category: 'Clothing', essential: true }
      );
    }
  }

  return {
    items,
    summary: 'Basic packing list based on weather conditions. Consider adding items specific to your activities.',
    tips: [
      'Check the weather forecast before packing',
      'Pack layers for variable weather',
      'Don\'t forget important documents',
    ],
  };
}

