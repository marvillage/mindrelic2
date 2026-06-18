"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Shield, Skull, User } from "lucide-react"
import { getMemories, resetVault, getPrefs, setPref, type Prefs } from "@/lib/storage"

export default function SettingsPage() {
  const router = useRouter()
  const { isConnected, isGuest, account } = useWeb3()
  const [prefs, setPrefs] = useState<Prefs>({
    notifications: false,
    privateMemories: false,
    afterlifeMode: false,
  })
  const [memoryCount, setMemoryCount] = useState(0)

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  useEffect(() => {
    setPrefs(getPrefs())
    setMemoryCount(getMemories().length)
  }, [])

  const updatePref = (key: keyof Prefs, value: boolean) => {
    setPrefs(setPref(key, value))
  }

  const exportRelics = () => {
    const data = JSON.stringify(getMemories(), null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mindrelic-memories.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (confirm("This permanently deletes every memory in this vault. Continue?")) {
      resetVault()
      setMemoryCount(0)
    }
  }

  return (
    <main className="min-h-screen pb-16 md:pb-0 md:pt-16">
      <MatrixRain />
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <CyberHeading level={2} glow>
              Settings
            </CyberHeading>
            <p className="text-gray-400 font-rajdhani">Configure your MindRelic experience</p>
          </div>

          <div className="space-y-6">
            {/* Account Section */}
            <GlassCard>
              <div className="mb-4 flex items-center">
                <User className="w-5 h-5 text-cyber-red mr-2" />
                <h3 className="font-orbitron text-lg">Account</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <Label className="text-sm text-gray-400">{isGuest ? "Session" : "Connected Wallet"}</Label>
                  <div className="font-mono text-sm bg-cyber-darkgray p-2 rounded border border-cyber-red/30">
                    {isGuest ? "Guest (local browser vault)" : account || "Not connected"}
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label className="text-sm text-gray-400">Memories Stored</Label>
                  <div className="font-mono text-sm bg-cyber-darkgray p-2 rounded border border-cyber-red/30">
                    {memoryCount}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-sm">
                      Enable Notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive alerts for new features</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={prefs.notifications}
                    onCheckedChange={(v) => updatePref("notifications", v)}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Privacy Section */}
            <GlassCard>
              <div className="mb-4 flex items-center">
                <Shield className="w-5 h-5 text-cyber-red mr-2" />
                <h3 className="font-orbitron text-lg">Privacy</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private-memories" className="text-sm">
                      Private Memories
                    </Label>
                    <p className="text-xs text-gray-500">Encrypt memories with additional layer</p>
                  </div>
                  <Switch
                    id="private-memories"
                    checked={prefs.privateMemories}
                    onCheckedChange={(v) => updatePref("privateMemories", v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="afterlife-mode" className="text-sm">
                      Afterlife Mode
                    </Label>
                    <p className="text-xs text-gray-500">Unlock memories after period of inactivity</p>
                  </div>
                  <Switch
                    id="afterlife-mode"
                    checked={prefs.afterlifeMode}
                    onCheckedChange={(v) => updatePref("afterlifeMode", v)}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Export Section */}
            <GlassCard>
              <div className="mb-4 flex items-center">
                <Download className="w-5 h-5 text-cyber-red mr-2" />
                <h3 className="font-orbitron text-lg">Export</h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-400">Download all your memories and metadata as JSON.</p>

                <CyberButton onClick={exportRelics}>
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download All Relics</span>
                </CyberButton>
              </div>
            </GlassCard>

            {/* Danger Zone */}
            <GlassCard className="border border-red-900/50">
              <div className="mb-4 flex items-center">
                <Skull className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-orbitron text-lg text-red-500">Danger Zone</h3>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>

                <CyberButton
                  variant="outline"
                  className="border-red-900 text-red-500 hover:bg-red-900/10"
                  onClick={handleReset}
                >
                  Reset Memory Vault
                </CyberButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}
