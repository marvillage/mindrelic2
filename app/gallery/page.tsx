"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Brain, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for NFT memories
const mockMemories = [
  {
    id: "1",
    date: "2025-05-17",
    summary:
      "Explored the boundaries of digital consciousness today. The neural pathways seem to converge at unexpected junctions, creating new possibilities for memory storage.",
    mood: "curious",
    keywords: ["digital", "consciousness", "exploration"],
  },
  {
    id: "2",
    date: "2025-05-16",
    summary:
      "The virtual sunset painted the metaverse in hues of crimson and gold. I found solace in the digital silence, away from the noise of physical existence.",
    mood: "peaceful",
    keywords: ["metaverse", "solace", "silence"],
  },
  {
    id: "3",
    date: "2025-05-15",
    summary:
      "Fragments of code danced like fireflies in the dark void of my mind. Each line a memory, each function a moment captured in the eternal blockchain.",
    mood: "reflective",
    keywords: ["code", "memory", "blockchain"],
  },
  {
    id: "4",
    date: "2025-05-14",
    summary:
      "The neural interface glitched today, sending ripples of unexpected emotions through my consciousness. Even in digital form, we remain beautifully flawed.",
    mood: "melancholic",
    keywords: ["glitch", "emotions", "flawed"],
  },
  {
    id: "5",
    date: "2025-05-13",
    summary:
      "Discovered ancient data fragments from the early days of the internet. Like digital archaeology, each packet reveals the primitive beauty of our connected past.",
    mood: "nostalgic",
    keywords: ["archaeology", "internet", "history"],
  },
  {
    id: "6",
    date: "2025-05-12",
    summary:
      "The quantum encryption of today's memories feels particularly strong. Some thoughts are meant to be protected, even in the transparent world of the blockchain.",
    mood: "secure",
    keywords: ["quantum", "encryption", "protection"],
  },
]

export default function GalleryPage() {
  const router = useRouter()
  const { isConnected } = useWeb3()
  const [memories, setMemories] = useState(mockMemories)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [selectedMemory, setSelectedMemory] = useState<(typeof mockMemories)[0] | null>(null)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  // Filter and sort memories
  const filteredMemories = memories.filter(
    (memory) =>
      memory.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      memory.mood.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return 0
  })

  const handleMemoryClick = (memory: (typeof mockMemories)[0]) => {
    setSelectedMemory(memory)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen pb-16 md:pb-0 md:pt-16">
      <MatrixRain />
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <CyberHeading level={2} glow>
            Relic Gallery
          </CyberHeading>
          <p className="text-gray-400 font-rajdhani">Your eternal memories on the blockchain</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border border-cyber-red/30 focus:border-cyber-red focus:ring-cyber-red/50 font-rajdhani"
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-transparent border border-cyber-red/30 focus:border-cyber-red focus:ring-cyber-red/50 font-rajdhani">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="mood">Mood</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedMemories.map((memory) => (
            <div key={memory.id} onClick={() => handleMemoryClick(memory)}>
              <GlassCard className="h-full cursor-pointer transition-all duration-300" hoverEffect>
                <div className="flex flex-col h-full">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400 font-mono">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(memory.date)}</span>
                    </div>
                    <div className="px-2 py-1 bg-cyber-red/20 rounded text-xs font-rajdhani border border-cyber-red/30">
                      {memory.mood}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-rajdhani text-sm text-gray-300 line-clamp-4">{memory.summary}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {memory.keywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-cyber-red/10 border border-cyber-red/30 rounded-sm text-xs font-mono"
                        >
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {sortedMemories.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-cyber-red/30 mx-auto mb-4" />
            <p className="text-gray-500 font-rajdhani">No memories found</p>
          </div>
        )}

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-2xl">
              <GlassCard className="animate-pulse-glow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-orbitron text-xl mb-1">Memory Relic</h3>
                    <div className="flex items-center text-sm text-gray-400 font-mono">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(selectedMemory.date)}</span>
                    </div>
                  </div>

                  <div className="px-3 py-1 bg-cyber-red/20 rounded text-sm font-rajdhani border border-cyber-red/30">
                    {selectedMemory.mood}
                  </div>
                </div>

                <div className="my-6 font-rajdhani text-gray-200 leading-relaxed">{selectedMemory.summary}</div>

                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-2">Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMemory.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 bg-cyber-red/10 border border-cyber-red/30 rounded-sm text-xs font-mono"
                      >
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="text-xs text-gray-500 font-mono">Token ID: #{selectedMemory.id}</div>

                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="text-cyber-red hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
