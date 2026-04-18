export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getSupabase } from "@/lib/db/supabase";
import { encrypt } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error && data.session) {
        // Create our custom session token for the middleware
        const token = await encrypt({ 
          userId: data.session.user.id, 
          email: data.session.user.email 
        });

        const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`);
        
        // Set the custom session cookie
        response.cookies.set("session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        
        return response;
      }
    }
  }

  // Fallback redirect if something went wrong or no code
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`);
}
