"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Brain, Loader, Check } from "lucide-react"
import { analyzeEntry } from "@/lib/analyze"
import { saveMemory, newId } from "@/lib/storage"

export default function JournalPage() {
  const router = useRouter()
  const { isConnected, isGuest, account } = useWeb3()
  const [journalEntry, setJournalEntry] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [forged, setForged] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalEntry(e.target.value)
  }

  const generateSummary = async () => {
    if (!journalEntry.trim()) return

    setIsGenerating(true)
    setForged(false)
    try {
      const analysis = await analyzeEntry(journalEntry)
      setAiSummary(analysis.summary)
      setMood(analysis.mood)
      setKeywords(analysis.keywords)
    } finally {
      setIsGenerating(false)
    }
  }

  const mintMemory = () => {
    if (!aiSummary) return
    const owner = account ?? "guest"
    saveMemory({
      id: newId(),
      date: new Date().toISOString(),
      content: journalEntry,
      summary: aiSummary,
      mood: mood ?? "contemplative",
      keywords,
      owner,
    })

    // Reset the form and confirm.
    setJournalEntry("")
    setAiSummary(null)
    setMood(null)
    setKeywords([])
    setForged(true)
    setTimeout(() => setForged(false), 4000)
  }

  const toggleVoice = () => {
    // Web Speech API — browser-native, no key required.
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : undefined

    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setJournalEntry((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <main className="min-h-screen pb-16 md:pb-0 md:pt-16">
      <MatrixRain />
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <CyberHeading level={2} glow>
              Journal Entry
            </CyberHeading>
            <p className="text-gray-400 font-rajdhani">
              {isGuest ? "Guest mode — your memories are stored in this browser." : "Speak your thoughts to MindRelic..."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journal Input */}
            <div>
              <GlassCard className="h-full" glowBorder>
                <div className="flex flex-col h-full">
                  <Textarea
                    value={journalEntry}
                    onChange={handleJournalChange}
                    placeholder="Type your thoughts here..."
                    className="flex-1 min-h-[200px] bg-transparent border border-cyber-red/30 focus:border-cyber-red focus:ring-cyber-red/50 font-rajdhani resize-none"
                  />

                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-2">
                      <CyberButton variant="ghost" size="sm" onClick={toggleVoice}>
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4 mr-1 animate-pulse" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-1" />
                            <span>Voice</span>
                          </>
                        )}
                      </CyberButton>
                    </div>

                    <CyberButton
                      onClick={generateSummary}
                      disabled={!journalEntry.trim() || isGenerating}
                      glow={!!journalEntry.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          <span>Generate Summary</span>
                        </>
                      )}
                    </CyberButton>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* AI Summary */}
            <div>
              <GlassCard className={`h-full ${aiSummary ? "animate-pulse-glow" : ""}`}>
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-orbitron text-lg">Today's Relic Summary</h3>
                    {mood && (
                      <div className="px-2 py-1 bg-cyber-red/20 rounded text-xs font-rajdhani border border-cyber-red/30">
                        {mood}
                      </div>
                    )}
                  </div>

                  {forged && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-cyber-red font-rajdhani border border-cyber-red/30 rounded p-2 bg-cyber-red/10">
                      <Check className="w-4 h-4" />
                      Memory forged and stored in your vault.
                    </div>
                  )}

                  {!aiSummary && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 font-rajdhani">
                      <Brain className="w-12 h-12 mb-4 opacity-30" />
                      <p>Your AI-generated memory summary will appear here</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="animate-pulse">
                        <Brain className="w-16 h-16 text-cyber-red" />
                      </div>
                      <p className="mt-4 font-rajdhani">Processing your memories...</p>
                    </div>
                  )}

                  {aiSummary && !isGenerating && (
                    <>
                      <div className="flex-1 font-rajdhani text-gray-200 leading-relaxed">{aiSummary}</div>

                      {keywords.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs text-gray-400 mb-2">Keywords:</div>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 bg-cyber-red/10 border border-cyber-red/30 rounded-sm text-xs font-mono"
                              >
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <CyberButton onClick={mintMemory} className="w-full" glow>
                          🧠 Forge Memory
                        </CyberButton>
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
