"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Textarea } from "@/components/ui/textarea"
import { Mic, ImageIcon, Brain, Loader } from "lucide-react"

export default function JournalPage() {
  const router = useRouter()
  const { isConnected } = useWeb3()
  const [journalEntry, setJournalEntry] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])

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

    // Simulate AI processing
    setTimeout(() => {
      // This would be replaced with actual AI API call
      const fakeSummary =
        "Your memories today reflect a journey through digital landscapes, where thoughts crystallize into eternal fragments. The neural pathways of your consciousness have formed new connections, creating a tapestry of experience that now lives forever in the blockchain."
      const fakeMood = "contemplative"
      const fakeKeywords = ["digital", "memory", "consciousness", "eternity"]

      setAiSummary(fakeSummary)
      setMood(fakeMood)
      setKeywords(fakeKeywords)
      setIsGenerating(false)
    }, 2000)
  }

  const mintMemory = async () => {
    // This would be replaced with actual NFT minting logic
    alert("Memory forged and stored on the blockchain!")

    // Reset the form
    setJournalEntry("")
    setAiSummary(null)
    setMood(null)
    setKeywords([])
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
            <p className="text-gray-400 font-rajdhani">Speak your thoughts to MindRelic...</p>
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
                      <CyberButton variant="ghost" size="sm">
                        <Mic className="w-4 h-4 mr-1" />
                        <span>Voice</span>
                      </CyberButton>
                      <CyberButton variant="ghost" size="sm">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        <span>Image</span>
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
