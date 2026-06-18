"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"

type Web3ContextType = {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  isGuest: boolean
  connectWallet: () => Promise<void>
  enterAsGuest: () => void
  disconnectWallet: () => void
  provider: ethers.BrowserProvider | null
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  isGuest: false,
  connectWallet: async () => {},
  enterAsGuest: () => {},
  disconnectWallet: () => {},
  provider: null,
})

export const useWeb3 = () => useContext(Web3Context)

const GUEST_KEY = "mindrelic.guest"

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  // Until we've checked storage/wallet, we don't know the session state.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const restore = async () => {
      // 1. Restore a guest session if one was started before.
      if (typeof window !== "undefined" && localStorage.getItem(GUEST_KEY) === "1") {
        setIsGuest(true)
        setIsConnected(true)
        setHydrated(true)
        return
      }

      // 2. Otherwise, re-check for an already-authorized wallet.
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const p = new ethers.BrowserProvider((window as any).ethereum)
          const accounts = await p.listAccounts()
          if (accounts.length > 0) {
            setAccount(accounts[0].address)
            setIsConnected(true)
            setProvider(p)
          }
        } catch (error) {
          console.error("Failed to restore wallet:", error)
        }
      }
      setHydrated(true)
    }

    restore()
  }, [])

  useEffect(() => {
    const eth = typeof window !== "undefined" ? (window as any).ethereum : undefined
    if (!eth) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        setIsGuest(false)
      } else if (!isGuest) {
        setAccount(null)
        setIsConnected(false)
      }
    }
    const handleChainChanged = () => window.location.reload()

    eth.on("accountsChanged", handleAccountsChanged)
    eth.on("chainChanged", handleChainChanged)

    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged)
      eth.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [isGuest])

  const connectWallet = async () => {
    const eth = typeof window !== "undefined" ? (window as any).ethereum : undefined
    if (!eth) {
      // No wallet installed — fall back to guest mode so the demo still works.
      enterAsGuest()
      return
    }
    setIsConnecting(true)
    try {
      const p = new ethers.BrowserProvider(eth)
      await p.send("eth_requestAccounts", [])
      const accounts = await p.listAccounts()
      if (accounts.length > 0) {
        if (typeof window !== "undefined") localStorage.removeItem(GUEST_KEY)
        setAccount(accounts[0].address)
        setIsGuest(false)
        setIsConnected(true)
        setProvider(p)
      }
    } catch (error) {
      console.error("Failed to connect to wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const enterAsGuest = () => {
    if (typeof window !== "undefined") localStorage.setItem(GUEST_KEY, "1")
    setIsGuest(true)
    setAccount(null)
    setIsConnected(true)
  }

  const disconnectWallet = () => {
    if (typeof window !== "undefined") localStorage.removeItem(GUEST_KEY)
    setAccount(null)
    setIsGuest(false)
    setIsConnected(false)
    setProvider(null)
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        isGuest,
        connectWallet,
        enterAsGuest,
        disconnectWallet,
        provider,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
