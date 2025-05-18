import type React from "react"
import { cn } from "@/lib/utils"

interface CyberHeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  glow?: boolean
  glitch?: boolean
  className?: string
}

export function CyberHeading({ children, level = 1, glow = false, glitch = false, className }: CyberHeadingProps) {
  const baseClasses = "font-orbitron tracking-wider text-white"

  const sizeClasses = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  }

  const glowClass = glow ? "glow-text" : ""
  const glitchClass = glitch ? "glitch-effect" : ""

  const Heading = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Heading
      className={cn(baseClasses, sizeClasses[level], glowClass, glitchClass, className)}
      data-text={glitch ? children : undefined}
    >
      {children}
    </Heading>
  )
}
