import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET() {
  try {
    const res = await fetch(process.env.ANTHROPIC_BASE_URL + "/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-opus-4-6",
        max_tokens: 50,
        messages: [{ role: "user", content: "say hi" }],
      }),
    });
    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: text.slice(0, 500),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
