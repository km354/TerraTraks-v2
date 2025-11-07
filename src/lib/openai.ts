/**
 * OpenAI Client Configuration
 * 
 * Provides a configured OpenAI client for making API calls
 */

import OpenAI from 'openai';
import { openAI } from './env';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    if (!openAI.apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
    }
    client = new OpenAI({
      apiKey: openAI.apiKey,
    });
  }
  return client;
}

/**
 * Helper function to make OpenAI API calls
 */
export async function callOpenAI(prompt: string, model: string = 'gpt-4') {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

