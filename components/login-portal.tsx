"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { GlassCard } from "@/components/ui-elements/glass-card"
import { useWeb3 } from "@/components/web3-provider"
import { Lock, Unlock } from "lucide-react"

export default function LoginPortal() {
  const router = useRouter()
  const { isConnected, isConnecting, connectWallet } = useWeb3()
  const [loginStatus, setLoginStatus] = useState<"locked" | "unlocking" | "unlocked">("locked")

  useEffect(() => {
    if (isConnected) {
      setLoginStatus("unlocked")
      // Redirect to journal after a short delay
      const timer = setTimeout(() => {
        router.push("/journal")
      }, 1500)

      return () => clearTimeout(timer)
    } else {
      setLoginStatus(isConnecting ? "unlocking" : "locked")
    }
  }, [isConnected, isConnecting, router])

  const handleConnect = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect:", error)
      setLoginStatus("locked")
    }
  }

  return (
    <GlassCard className="w-full max-w-md mx-auto" glowBorder>
      <div className="flex flex-col items-center p-4">
        <div className="mb-6 text-center">
          <h2 className="font-orbitron text-xl mb-2">Memory Vault Access</h2>
          <p className="text-gray-400 font-rajdhani">Connect your wallet to enter the vault</p>
        </div>

        <div className="w-full mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {loginStatus === "locked" && <Lock className="w-8 h-8 text-cyber-red" />}
            {loginStatus === "unlocking" && (
              <div className="animate-spin">
                <Lock className="w-8 h-8 text-cyber-red" />
              </div>
            )}
            {loginStatus === "unlocked" && <Unlock className="w-8 h-8 text-cyber-red animate-pulse" />}

            <div className="text-lg font-orbitron">
              {loginStatus === "locked" && "Vault Locked"}
              {loginStatus === "unlocking" && "Unlocking..."}
              {loginStatus === "unlocked" && "Vault Unlocked"}
            </div>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-cyber-red transition-all duration-1000 ${
                loginStatus === "locked" ? "w-0" : loginStatus === "unlocking" ? "w-1/2" : "w-full"
              }`}
            ></div>
          </div>
        </div>

        <CyberButton onClick={handleConnect} disabled={loginStatus !== "locked"} glow className="w-full">
          {loginStatus === "locked" ? "Enter the Vault" : loginStatus === "unlocking" ? "Connecting..." : "Connected"}
        </CyberButton>

        <p className="mt-4 text-xs text-gray-500 font-rajdhani">Requires MetaMask or compatible Web3 wallet</p>
      </div>
    </GlassCard>
  )
}
