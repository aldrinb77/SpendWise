import { NextRequest, NextResponse } from "next/server";
import { comparePassword } from "@/lib/auth/hash";
import { encrypt } from "@/lib/auth/jwt";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as any;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // @ts-ignore - DB is a Cloudflare D1 binding
    const db = process.env.DB as D1Database;
    
    // DEVELOPMENT FALLBACK: If running locally without D1 bindings
    if (!db || process.env.NODE_ENV === "development") {
      if (email === "user@example.com" && password === "password123") {
         const mockUser = {
           id: "defa-defa-defa-defa-defa",
           email: "user@example.com",
           name: "Demo User"
         };
         
         const token = await encrypt({ userId: mockUser.id, email: mockUser.email });
         const response = NextResponse.json({ message: "Logged in successfully (Dev Mode)", user: mockUser }, { status: 200 });
         
         response.cookies.set("session", token, {
           httpOnly: true,
           secure: false,
           sameSite: "lax",
           maxAge: 60 * 60 * 2,
           path: "/",
         });
         return response;
      }
      
      if (!db) {
        return NextResponse.json(
          { error: "Internal Server Error: Database not configured. Use demo credentials for local testing." },
          { status: 500 }
        );
      }
    }

    // Find user
    const user = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first() as any;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = await comparePassword(password, user.password_hash);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session (JWT)
    const token = await encrypt({ userId: user.id, email: user.email });

    const response = NextResponse.json(
      { 
        message: "Logged in successfully",
        user: { id: user.id, email: user.email, name: user.name }
      },
      { status: 200 }
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
