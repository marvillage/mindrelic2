// On-device journal analysis: mood detection, keyword extraction, and a short
// summary. This runs entirely in the browser with no API key, so the live demo
// always works. When an ANTHROPIC_API_KEY is configured on the server, the
// journal page upgrades to a real Claude call via /api/analyze and falls back
// to this local engine on any error.

export type Analysis = {
  summary: string
  mood: string
  keywords: string[]
}

const MOOD_LEXICON: Record<string, string[]> = {
  joyful: ["happy", "joy", "excited", "great", "love", "wonderful", "amazing", "delighted", "grateful", "celebrate"],
  peaceful: ["calm", "peace", "serene", "quiet", "relaxed", "still", "rest", "gentle", "ease", "solace"],
  hopeful: ["hope", "future", "dream", "goal", "plan", "looking forward", "optimistic", "possibility", "growth"],
  reflective: ["think", "thought", "remember", "memory", "realize", "wonder", "consider", "reflect", "ponder"],
  anxious: ["worried", "anxious", "nervous", "stress", "stressed", "fear", "afraid", "overwhelmed", "pressure", "panic"],
  melancholic: ["sad", "lonely", "tired", "lost", "empty", "miss", "grief", "cry", "ache", "heavy"],
  frustrated: ["angry", "annoyed", "frustrated", "mad", "hate", "unfair", "stuck", "blocked", "irritated"],
  determined: ["focus", "work", "build", "finish", "push", "discipline", "drive", "commit", "achieve", "ship"],
}

const STOPWORDS = new Set(
  ("a an the and or but if then else of to in on at for from by with as is are was were be been being this that these those " +
    "i you he she it we they me him her them my your his its our their mine yours not no so do does did done have has had " +
    "will would can could should may might must just about into over under again very really too more most much many some " +
    "any all out up down off than there here when where what which who whom how why because while during after before").split(/\s+/),
)

function detectMood(text: string): string {
  const lower = ` ${text.toLowerCase()} `
  let best = "contemplative"
  let bestScore = 0
  for (const [mood, words] of Object.entries(MOOD_LEXICON)) {
    let score = 0
    for (const w of words) {
      // count occurrences
      const matches = lower.split(w).length - 1
      score += matches
    }
    if (score > bestScore) {
      bestScore = score
      best = mood
    }
  }
  return best
}

function extractKeywords(text: string, max = 4): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))

  const freq = new Map<string, number>()
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1)

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, max)
    .map(([w]) => w)
}

function summarize(text: string): string {
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? []

  if (sentences.length === 0) return text.trim()
  if (sentences.length <= 2) return sentences.join(" ")

  // Score sentences by keyword overlap; keep the two strongest in original order.
  const keywords = new Set(extractKeywords(text, 8))
  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().split(/\s+/)
    const score = words.reduce((acc, w) => acc + (keywords.has(w.replace(/[^a-z0-9]/g, "")) ? 1 : 0), 0)
    return { s, i, score }
  })
  const top = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)

  return top.join(" ")
}

export function analyzeLocally(text: string): Analysis {
  const clean = text.trim()
  return {
    summary: summarize(clean),
    mood: detectMood(clean),
    keywords: extractKeywords(clean),
  }
}

// Tries the server (real Claude) first; falls back to the local engine.
export async function analyzeEntry(text: string): Promise<Analysis> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (res.ok) {
      const data = (await res.json()) as Partial<Analysis>
      if (data.summary && data.mood && Array.isArray(data.keywords)) {
        return { summary: data.summary, mood: data.mood, keywords: data.keywords }
      }
    }
  } catch {
    // ignore and fall back
  }
  return analyzeLocally(text)
}
