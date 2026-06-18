# MindRelic — Web3 AI Memory Vault

A cyberpunk-themed journaling app that turns your thoughts into "memory relics." Write an entry, get an AI-generated reflection with detected mood and keyword themes, then forge it into your personal vault.

**Live demo:** https://mindrelic2.vercel.app

> Built to be fully explorable with **zero setup** — no wallet, no API key, no backend required. Click "Explore as Guest" and start forging memories.

## Features

- **Two ways in** — connect a MetaMask wallet, or jump straight in as a guest. Sessions persist across reloads.
- **AI memory analysis** — every entry is distilled into a short reflection, a detected mood, and keyword themes. Runs **on-device** by default (no API key, instant, free); upgrades to a real Claude call when an API key is configured.
- **Voice journaling** — dictate entries with the browser's native Web Speech API.
- **Relic gallery** — browse, search, and sort your forged memories; open any relic for detail or forget it.
- **Persistence** — memories and preferences are saved to `localStorage`, so your vault survives refreshes.
- **Settings** — export your whole vault as JSON, manage preferences, or reset the vault.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **ethers.js** for wallet connection
- **Anthropic SDK** (optional, for real AI analysis)

## How the AI analysis works

The journal calls `POST /api/analyze`. If `ANTHROPIC_API_KEY` is set, the route asks **Claude (claude-opus-4-8)** to summarize the entry and detect its mood and keywords. If no key is set (the default for the public demo), the route returns `501` and the client transparently falls back to the on-device engine in [`lib/analyze.ts`](lib/analyze.ts) — keyword frequency, a mood lexicon, and extractive summarization. Either way the app works; the only difference is depth of the reflection.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Optional: enable real Claude-powered analysis

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

Without this, the on-device analyzer is used — no configuration needed.

## Notes

The "Web3 / on-chain" framing is the product's theme. In this demo, memories are stored locally in the browser; a production build would swap [`lib/storage.ts`](lib/storage.ts) for on-chain / IPFS persistence behind the same interface.
