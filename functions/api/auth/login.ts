/// <reference types="@cloudflare/workers-types" />
import { comparePassword } from "../../../lib/auth/hash";
import { encrypt } from "../../../lib/auth/jwt";

interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { email, password } = await request.json() as any;
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first() as any;

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
    
    // Store session in D1 (or KV)
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
    )
      .bind(sessionId, user.id, expiresAt, Math.floor(Date.now() / 1000))
      .run();

    // Generate JWT
    const token = await encrypt({ userId: user.id, sessionId });

    // Return token and user info
    return new Response(JSON.stringify({ 
      success: true, 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": `session_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
