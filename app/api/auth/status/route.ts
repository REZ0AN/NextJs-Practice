import { NextResponse, NextRequest } from 'next/server';

export async function GET(request : NextRequest) {

  const token =request.cookies.get("token")?.value

  return NextResponse.json({ isLoggedIn: !!token });
}