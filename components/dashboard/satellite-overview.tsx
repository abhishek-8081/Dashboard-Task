"use client"

import { cn } from "@/lib/utils"
import type { Satellite } from "@/lib/types"
import { Radio, ArrowRight, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"

interface SatelliteOverviewProps {
  satellites: Satellite[]
}

const stateConfig: Record<Satellite["state"], { color: string; bg: string; glow?: string }> = {
  NEW: { color: "text-muted-foreground", bg: "bg-muted/30" },
  INIT: { color: "text-blue-400", bg: "bg-blue-500/10" },
  ORBIT: { color: "text-yellow-400", bg: "bg-yellow-500/10", glow: "glow-yellow" },
  RUN: { color: "text-green-400", bg: "bg-green-500/10", glow: "glow-green" },
  SAFE: { color: "text-orange-400", bg: "bg-orange-500/10" },
  ERROR: { color: "text-red-400", bg: "bg-red-500/10", glow: "glow-red" },
  DEAD: { color: "text-red-500", bg: "bg-red-900/20" },
}

export function SatelliteOverview({ satellites }: SatelliteOverviewProps) {
  const runningSatellites = satellites.filter((s) => s.state === "RUN" || s.state === "ORBIT").length
  const errorSatellites = satellites.filter((s) => s.state === "ERROR" || s.state === "DEAD").length
  
  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 panel-header border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Radio className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Satellite Fleet</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
              {satellites.length} Registered Devices
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border">
            <Wifi className="h-3 w-3 text-green-400" />
            <span className="text-xs font-bold text-green-400">{runningSatellites}</span>
            <span className="text-[10px] text-muted-foreground">Active</span>
          </div>
          {errorSatellites > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <WifiOff className="h-3 w-3 text-red-400" />
              <span className="text-xs font-bold text-red-400">{errorSatellites}</span>
              <span className="text-[10px] text-red-400/70">Error</span>
            </div>
          )}
        </div>
      </div>

      {/* Satellite List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {satellites.slice(0, 6).map((satellite, index) => {
            const state = stateConfig[satellite.state]
            const isActive = satellite.state === "RUN" || satellite.state === "ORBIT"
            return (
              <div
                key={satellite.id}
                className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 border",
                  "bg-secondary/20 border-border hover:border-primary/30 hover:bg-secondary/30"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      isActive ? "bg-green-500" : 
                      satellite.state === "ERROR" || satellite.state === "DEAD" ? "bg-red-500" :
                      satellite.state === "ORBIT" ? "bg-yellow-500" : "bg-muted-foreground"
                    )} />
                    {isActive && (
                      <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-500 status-pulse" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{satellite.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{satellite.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                    state.bg,
                    state.color
                  )}>
                    {satellite.state}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-secondary/20 shrink-0">
        <Link 
          href="/satellites" 
          className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All Satellites
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
