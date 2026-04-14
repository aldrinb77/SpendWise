/// <reference types="@cloudflare/workers-types" />
export const onRequestPost: PagesFunction = async () => {
  return new Response(JSON.stringify({ success: true, message: "Logged out" }), {
    status: 200,
    headers: { 
      "Content-Type": "application/json",
      "Set-Cookie": "session_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
    },
  });
};
