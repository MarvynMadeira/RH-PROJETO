import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  return NextResponse.json({ message: 'Get form', token: params.token });
}
