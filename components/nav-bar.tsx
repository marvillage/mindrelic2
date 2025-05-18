"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { CyberButton } from "@/components/ui-elements/cyber-button"
import { cn } from "@/lib/utils"
import { Brain, BookOpen, Grid3X3, Settings, LogOut } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()
  const { isConnected, account, disconnectWallet } = useWeb3()

  if (!isConnected) return null

  const navItems = [
    {
      name: "Journal",
      path: "/journal",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Gallery",
      path: "/gallery",
      icon: <Grid3X3 className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto glass-panel border-t border-cyber-red/30 md:border-t-0 md:border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-cyber-red" />
            <span className="font-orbitron text-lg tracking-wider hidden md:inline-block">MindRelic</span>
          </Link>

          <div className="flex items-center space-x-1 md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center px-2 py-1 md:px-3 md:py-2 rounded transition-colors",
                  "text-xs md:text-sm font-rajdhani",
                  pathname === item.path
                    ? "text-cyber-red border-b-2 border-cyber-red"
                    : "text-gray-400 hover:text-white hover:bg-cyber-red/10",
                )}
              >
                <span className="md:mr-2">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            <CyberButton
              variant="ghost"
              size="sm"
              onClick={disconnectWallet}
              className="flex flex-col md:flex-row items-center text-xs md:text-sm"
            >
              <LogOut className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Disconnect</span>
            </CyberButton>
          </div>

          <div className="hidden md:flex items-center">
            <div className="text-xs font-mono bg-cyber-darkgray px-2 py-1 rounded border border-cyber-red/30">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not Connected"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
