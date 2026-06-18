// Client-side persistence for MindRelic.
// Memories are stored in localStorage so the live demo works with zero backend
// or paid infrastructure. (A real deployment would swap this for on-chain / IPFS storage.)

export type Memory = {
  id: string
  date: string // ISO timestamp
  content: string // the original journal entry
  summary: string
  mood: string
  keywords: string[]
  owner: string // wallet address or "guest"
}

export type Prefs = {
  notifications: boolean
  privateMemories: boolean
  afterlifeMode: boolean
}

const MEMORIES_KEY = "mindrelic.memories"
const PREFS_KEY = "mindrelic.prefs"
const SEEDED_KEY = "mindrelic.seeded"

const defaultPrefs: Prefs = {
  notifications: false,
  privateMemories: false,
  afterlifeMode: false,
}

// A few seed relics so the gallery is never empty on first visit.
const seedMemories: Memory[] = [
  {
    id: "seed-1",
    date: "2025-05-17T09:00:00.000Z",
    content:
      "Explored the boundaries of digital consciousness today. The neural pathways seem to converge at unexpected junctions, creating new possibilities for memory storage.",
    summary:
      "Explored the boundaries of digital consciousness today. The neural pathways seem to converge at unexpected junctions, creating new possibilities for memory storage.",
    mood: "curious",
    keywords: ["digital", "consciousness", "exploration"],
    owner: "guest",
  },
  {
    id: "seed-2",
    date: "2025-05-16T20:30:00.000Z",
    content:
      "The virtual sunset painted the metaverse in hues of crimson and gold. I found solace in the digital silence, away from the noise of physical existence.",
    summary:
      "The virtual sunset painted the metaverse in hues of crimson and gold. I found solace in the digital silence, away from the noise of physical existence.",
    mood: "peaceful",
    keywords: ["metaverse", "solace", "silence"],
    owner: "guest",
  },
  {
    id: "seed-3",
    date: "2025-05-15T14:10:00.000Z",
    content:
      "Fragments of code danced like fireflies in the dark void of my mind. Each line a memory, each function a moment captured in the eternal blockchain.",
    summary:
      "Fragments of code danced like fireflies in the dark void of my mind. Each line a memory, each function a moment captured in the eternal blockchain.",
    mood: "reflective",
    keywords: ["code", "memory", "blockchain"],
    owner: "guest",
  },
]

function isBrowser() {
  return typeof window !== "undefined"
}

export function getMemories(): Memory[] {
  if (!isBrowser()) return []
  try {
    // Seed once so the gallery has content to show on a fresh visit.
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(seedMemories))
      localStorage.setItem(SEEDED_KEY, "1")
    }
    const raw = localStorage.getItem(MEMORIES_KEY)
    return raw ? (JSON.parse(raw) as Memory[]) : []
  } catch {
    return []
  }
}

export function saveMemory(memory: Memory): Memory[] {
  const memories = getMemories()
  const next = [memory, ...memories]
  if (isBrowser()) {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(next))
  }
  return next
}

export function deleteMemory(id: string): Memory[] {
  const next = getMemories().filter((m) => m.id !== id)
  if (isBrowser()) {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(next))
  }
  return next
}

export function resetVault(): void {
  if (!isBrowser()) return
  localStorage.removeItem(MEMORIES_KEY)
  localStorage.removeItem(SEEDED_KEY)
}

export function getPrefs(): Prefs {
  if (!isBrowser()) return defaultPrefs
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]): Prefs {
  const prefs = { ...getPrefs(), [key]: value }
  if (isBrowser()) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  }
  return prefs
}

export function newId(): string {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID()
  return `mem-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}
