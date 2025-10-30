import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { districtCode } = params;
  const { searchParams } = new URL(request.url);
  const months = searchParams.get('months') || 12;

  try {
    // Forward the request to your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/financial/fund-utilization/${districtCode}?months=${months}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch fund utilization data');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in fund-utilization API route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
