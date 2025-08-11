import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function DELETE(request: NextRequest) {
  try {
    console.log('Turning off light display');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(
      `http://${config.lightControllerIp}/v1/zones/${config.zoneId}/sequence`,
      {
        method: 'DELETE',
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
      console.error('Error turning off lights:', error.message);
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - light controller not responding' },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: `Failed to turn off lights: ${error.message}` },
        { status: 500 }
      );
    }
    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'Failed to turn off lights' },
      { status: 500 }
    );
  }
}