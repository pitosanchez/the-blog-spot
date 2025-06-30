import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exportCMETranscript } from '@/lib/cme';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format, stateBoard } = await request.json();

    if (!['PDF', 'CSV', 'XML'].includes(format)) {
      return NextResponse.json({ 
        error: 'Invalid format. Must be PDF, CSV, or XML' 
      }, { status: 400 });
    }

    const downloadUrl = await exportCMETranscript(session.user.id, format, stateBoard);
    
    return NextResponse.json({ downloadUrl });

  } catch (error) {
    console.error('Error exporting CME transcript:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}