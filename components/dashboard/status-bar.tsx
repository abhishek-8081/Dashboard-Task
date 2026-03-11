"use client"

import { useEffect, useState } from "react"
import { Bell, Clock, Server, Activity, Signal, Wifi, Shield, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBarProps {
  systemStatus: "online" | "warning" | "error"
  activeNodes: number
}

export function StatusBar({ systemStatus, activeNodes }: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const statusConfig = {
    online: {
      label: "ALL SYSTEMS OPERATIONAL",
      color: "bg-green-500",
      textColor: "text-green-400",
      glow: "glow-green",
      icon: Shield,
    },
    warning: {
      label: "WARNING DETECTED",
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
      glow: "glow-yellow",
      icon: AlertTriangle,
    },
    error: {
      label: "CRITICAL ALERT",
      color: "bg-red-500",
      textColor: "text-red-400",
      glow: "glow-red",
      icon: AlertTriangle,
    },
  }

  const status = statusConfig[systemStatus]
  const StatusIcon = status.icon

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6 panel-header">
      {/* Left Section - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn("h-2.5 w-2.5 rounded-full", status.color, status.glow)} />
            <div className={cn("absolute inset-0 h-2.5 w-2.5 rounded-full status-pulse", status.color)} />
          </div>
          <StatusIcon className={cn("h-4 w-4", status.textColor)} />
          <span className={cn("text-xs font-bold tracking-wider", status.textColor)}>
            {status.label}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border">
          <Signal className="h-3 w-3 text-green-400" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Uplink Active
          </span>
        </div>
      </div>

      {/* Right Section - Metrics */}
      <div className="flex items-center gap-4">
        {/* Time Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-foreground tracking-wider">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {currentTime.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Nodes Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border">
          <Server className="h-3.5 w-3.5 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{activeNodes}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Nodes</span>
          </div>
        </div>

        {/* Connection Quality */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/30 border border-border">
          <Wifi className="h-3.5 w-3.5 text-green-400" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">98.5%</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Uptime</span>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Live</span>
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all border border-transparent hover:border-border">
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-card">
              {notifications}
            </Badge>
          )}
        </button>
      </div>
    </header>
  )
}
