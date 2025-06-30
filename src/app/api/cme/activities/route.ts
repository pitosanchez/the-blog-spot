import { NextRequest, NextResponse } from 'next/server';
import { getAvailableCMEActivities } from '@/lib/cme';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty') || undefined;
    const creditType = searchParams.get('creditType') || undefined;

    const activities = await getAvailableCMEActivities(specialty, creditType);
    
    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error fetching CME activities:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}