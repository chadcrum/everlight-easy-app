import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `http://${config.lightControllerIp}/v1/zones/${config.zoneId}/sequence`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error submitting light pattern:', error);
    return NextResponse.json(
      { error: 'Failed to submit light pattern' },
      { status: 500 }
    );
  }
}