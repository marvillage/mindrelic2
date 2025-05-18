import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glowBorder?: boolean
  hoverEffect?: boolean
}

export function GlassCard({ children, className, glowBorder = false, hoverEffect = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-md p-4 backdrop-blur-md",
        glowBorder && "glow-border",
        hoverEffect && "transition-all duration-300 hover:scale-[1.02] hover:glow-border",
        className,
      )}
    >
      {children}
    </div>
  )
}
