import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash";
import { encrypt } from "@/lib/auth/jwt";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json() as any;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // @ts-ignore - DB is a Cloudflare D1 binding
    const db = process.env.DB as D1Database;
    
    if (!db) {
      console.error("D1 Database binding not found");
      return NextResponse.json(
        { error: "Internal Server Error: Database not configured" },
        { status: 500 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);

    // Insert user
    await db
      .prepare(
        "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(userId, email, hashedPassword, name || null, now)
      .run();

    // Create session (JWT)
    const token = await encrypt({ userId, email });

    const response = NextResponse.json(
      { 
        message: "User created successfully",
        user: { id: userId, email, name }
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
