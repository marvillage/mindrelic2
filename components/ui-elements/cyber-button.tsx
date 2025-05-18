import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  glitch?: boolean
  glow?: boolean
  children: React.ReactNode
  className?: string
}

export function CyberButton({
  variant = "default",
  size = "default",
  glitch = false,
  glow = false,
  children,
  className,
  ...props
}: CyberButtonProps) {
  const baseClasses = "font-orbitron uppercase tracking-wider transition-all duration-300"

  const variantClasses = {
    default: "bg-transparent border border-cyber-red text-cyber-red hover:bg-cyber-red/10",
    outline: "bg-transparent border border-cyber-red/50 text-cyber-red hover:border-cyber-red",
    ghost: "bg-transparent text-cyber-red hover:bg-cyber-red/10 border-none",
  }

  const sizeClasses = {
    default: "py-2 px-4",
    sm: "py-1 px-3 text-sm",
    lg: "py-3 px-6 text-lg",
  }

  const glitchClass = glitch ? "glitch-effect" : ""
  const glowClass = glow ? "animate-pulse-glow" : ""

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glitchClass,
        glowClass,
        "relative overflow-hidden",
        "after:content-[''] after:absolute after:h-[200%] after:w-[200%] after:top-[-50%] after:left-[-50%] after:bg-cyber-red/10 after:rotate-45 after:opacity-0 after:transition-opacity after:duration-300",
        "hover:after:opacity-100",
        className,
      )}
      data-text={glitch ? children : undefined}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  )
}
