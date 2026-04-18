export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { encrypt } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session } = body;
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Missing session data" }, { status: 400 });
    }

    const token = await encrypt({ 
      userId: session.user.id, 
      email: session.user.email 
    });

    const response = NextResponse.json({ success: true });
    
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
