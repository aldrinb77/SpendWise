import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash";
import { encrypt } from "@/lib/auth/jwt";
import { getSupabase } from "@/lib/db/supabase";

// // export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json() as any;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    
    if (!supabase) {
       // Mock for development
       const token = await encrypt({ userId: "mock-user", email });
       const response = NextResponse.json({ message: "User created (Mock)", user: { id: "mock-user", email, name } }, { status: 201 });
       response.cookies.set("session", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 3600, path: "/" });
       return response;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Call Supabase instead of direct SQL (using Supabase Auth or just Table)
    // For this app, let's use the 'users' table we created in the migration SQL
    const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hashedPassword, name }])
      .select()
      .single();

    if (error) throw error;

    const token = await encrypt({ userId: newUser.id, email: newUser.email });

    const response = NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, email: newUser.email, name: newUser.name } },
      { status: 201 }
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
