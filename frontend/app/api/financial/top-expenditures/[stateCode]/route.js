import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { stateCode } = params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || 10;

  try {
    // Forward the request to your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/financial/top-expenditures/${stateCode}?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch top districts data');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in top-expenditures API route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
