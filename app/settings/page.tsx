"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { NavBar } from "@/components/nav-bar"
import { MatrixRain } from "@/components/matrix-rain"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Key, Shield, Skull, User } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { isConnected, account } = useWeb3()

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

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
                  <Label className="text-sm text-gray-400">Connected Wallet</Label>
                  <div className="font-mono text-sm bg-cyber-darkgray p-2 rounded border border-cyber-red/30">
                    {account || "Not connected"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-sm">
                      Enable Notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive alerts for new features</p>
                  </div>
                  <Switch id="notifications" />
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
                  <Switch id="private-memories" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="afterlife-mode" className="text-sm">
                      Afterlife Mode
                    </Label>
                    <p className="text-xs text-gray-500">Unlock memories after period of inactivity</p>
                  </div>
                  <Switch id="afterlife-mode" />
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
                <p className="text-sm text-gray-400">Download all your memories and metadata from the blockchain.</p>

                <div className="flex space-x-4">
                  <CyberButton>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download All Relics</span>
                  </CyberButton>

                  <CyberButton variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    <span>Export Private Keys</span>
                  </CyberButton>
                </div>
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

                <CyberButton variant="outline" className="border-red-900 text-red-500 hover:bg-red-900/10">
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
