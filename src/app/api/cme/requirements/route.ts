import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkSpecialtyRequirements } from '@/lib/cme';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');

    if (!specialty) {
      return NextResponse.json({ 
        error: 'Specialty parameter is required' 
      }, { status: 400 });
    }

    const requirements = await checkSpecialtyRequirements(session.user.id, specialty);
    return NextResponse.json(requirements);

  } catch (error) {
    console.error('Error checking specialty requirements:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}