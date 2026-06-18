"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Brain, Calendar, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMemories, deleteMemory, type Memory } from "@/lib/storage"

export default function GalleryPage() {
  const router = useRouter()
  const { isConnected } = useWeb3()
  const [memories, setMemories] = useState<Memory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  // Load saved memories from local storage on mount.
  useEffect(() => {
    setMemories(getMemories())
  }, [])

  const handleDelete = (id: string) => {
    setMemories(deleteMemory(id))
    setSelectedMemory(null)
  }

  // Filter and sort memories
  const filteredMemories = memories.filter(
    (memory) =>
      memory.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      memory.mood.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortBy === "mood") {
      return a.mood.localeCompare(b.mood)
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

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
            <div key={memory.id} onClick={() => setSelectedMemory(memory)}>
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
            <p className="text-gray-500 font-rajdhani">
              {memories.length === 0 ? "No memories yet — forge your first one in the Journal." : "No memories match your search."}
            </p>
          </div>
        )}

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedMemory(null)}
          >
            <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
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

                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => handleDelete(selectedMemory.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors font-rajdhani"
                  >
                    <Trash2 className="w-4 h-4" />
                    Forget
                  </button>

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
