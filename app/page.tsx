import { CyberHeading } from "@/components/ui-elements/cyber-heading"
import { MatrixRain } from "@/components/matrix-rain"
import { Brain } from "lucide-react"
import LoginPortal from "@/components/login-portal"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <MatrixRain />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-glow rounded-full"></div>
              <div className="relative bg-black p-4 rounded-full border border-cyber-red">
                <Brain className="w-16 h-16 text-cyber-red" />
              </div>
            </div>
          </div>

          <CyberHeading level={1} glow className="mb-2">
            MindRelic
          </CyberHeading>

          <p className="font-rajdhani text-gray-400 mb-8 max-w-md mx-auto">
            The Web3 AI memory vault. Store your thoughts forever on the blockchain.
          </p>

          <LoginPortal />
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-gray-600 font-rajdhani relative z-10">
        <div className="container mx-auto">
          <p>MindRelic © {new Date().getFullYear()} | The Eternal Memory Vault</p>
        </div>
      </footer>
    </main>
  )
}
