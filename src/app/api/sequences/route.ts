import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Try to fetch from the hardware controller first with a 3 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`http://${config.lightControllerIp}/v1/sequences`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from hardware controller:', error);
    
    // Fallback to response.json file for testing
    try {
      const filePath = join(process.cwd(), 'response.json');
      const fileContents = readFileSync(filePath, 'utf8');
      const fallbackData = JSON.parse(fileContents);
      console.log('Using fallback data from response.json');
      return NextResponse.json(fallbackData);
    } catch (fallbackError) {
      console.error('Error reading fallback data:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to fetch light sequences' },
        { status: 500 }
      );
    }
  }
}