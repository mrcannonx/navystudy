import { NextResponse } from 'next/server';
import { generateMetricsWithAI } from '@/lib/ai-metrics-generator';

export async function POST(req: Request) {
  try {
    const { section, rating, role } = await req.json();
    
    // Validate inputs
    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Missing required section parameter' },
        { status: 400 }
      );
    }
    
    // Call AI service to generate metrics
    const metrics = await generateMetricsWithAI(
      section, 
      rating || 'Meets Standards', 
      role || 'System Administrator'
    );
    
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}