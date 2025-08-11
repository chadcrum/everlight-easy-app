import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Submitting to controller:', JSON.stringify(body, null, 2));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(
      `http://${config.lightControllerIp}/v1/zones/${config.zoneId}/sequence`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Controller error (${response.status}):`, errorText);
      throw new Error(`Controller responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.text();
    console.log('Controller response:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error submitting light pattern:', error.message);
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - light controller not responding' },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: `Failed to submit light pattern: ${error.message}` },
        { status: 500 }
      );
    }
    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'Failed to submit light pattern' },
      { status: 500 }
    );
  }
}