import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

// Optional real-AI upgrade for the journal analysis.
//
// If ANTHROPIC_API_KEY is set in the environment, this route asks Claude to
// summarize the entry and detect its mood + keywords. If the key is absent (the
// default for the public demo), it returns 501 and the client falls back to the
// on-device engine in lib/analyze.ts — so the live deployment works with no
// secrets and no cost.

export const runtime = "nodejs"

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No key configured — tell the client to use its local engine.
    return NextResponse.json({ error: "AI not configured" }, { status: 501 })
  }

  let text = ""
  try {
    const body = await req.json()
    text = typeof body?.text === "string" ? body.text : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!text.trim()) {
    return NextResponse.json({ error: "Empty entry" }, { status: 400 })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system:
        "You are MindRelic, an AI memory vault. Given a journal entry, respond with ONLY a JSON object (no markdown, no prose) of the form " +
        '{"summary": string, "mood": string, "keywords": string[]}. ' +
        "summary is a short evocative 1-2 sentence reflection; mood is a single lowercase word; keywords is 3-4 lowercase single-word themes.",
      messages: [{ role: "user", content: text }],
    })

    const block = response.content.find((b) => b.type === "text") as { text: string } | undefined
    // The model may wrap JSON in a code fence — extract the first {...} object.
    const raw = block?.text ?? ""
    const match = raw.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : null
    if (!parsed?.summary || !parsed?.mood || !Array.isArray(parsed?.keywords)) {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 502 })
    }
    return NextResponse.json({
      summary: String(parsed.summary),
      mood: String(parsed.mood),
      keywords: parsed.keywords.map((k: unknown) => String(k)).slice(0, 4),
    })
  } catch (err) {
    console.error("analyze route error:", err)
    return NextResponse.json({ error: "AI request failed" }, { status: 502 })
  }
}
