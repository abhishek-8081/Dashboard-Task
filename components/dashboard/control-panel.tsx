"use client"

import { Play, Square, RotateCcw, Search, AlertTriangle, Power, Settings2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ControlPanelProps {
  onAction: (action: string, message: string) => void
  isSystemRunning: boolean
}

export function ControlPanel({ onAction, isSystemRunning }: ControlPanelProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const controls = [
    {
      id: "start",
      label: "Initialize",
      icon: Power,
      color: "text-green-400",
      bgColor: "bg-green-500/10 hover:bg-green-500/20 border-green-500/30",
      disabled: isSystemRunning,
      message: "System initialization sequence started",
    },
    {
      id: "stop",
      label: "Shutdown",
      icon: Square,
      color: "text-red-400",
      bgColor: "bg-red-500/10 hover:bg-red-500/20 border-red-500/30",
      disabled: !isSystemRunning,
      message: "System shutdown sequence initiated",
    },
    {
      id: "restart",
      label: "Restart",
      icon: RotateCcw,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30",
      disabled: false,
      message: "Node restart sequence initiated",
    },
    {
      id: "diagnostics",
      label: "Diagnostics",
      icon: Search,
      color: "text-primary",
      bgColor: "bg-primary/10 hover:bg-primary/20 border-primary/30",
      disabled: false,
      message: "Running full system diagnostics...",
    },
  ]

  const handleClick = (control: typeof controls[0]) => {
    if (control.disabled) return
    setActiveButton(control.id)
    onAction(control.id, control.message)
    setTimeout(() => setActiveButton(null), 500)
  }

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 panel-header border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Control Panel</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSystemRunning ? (
            <>
              <div className="relative">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 block" />
                <span className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-500 status-pulse" />
              </div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Running</span>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 glow-red" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Stopped</span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {controls.map((control) => {
            const Icon = control.icon
            return (
              <button
                key={control.id}
                disabled={control.disabled}
                onClick={() => handleClick(control)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all duration-200",
                  control.bgColor,
                  control.disabled && "opacity-40 cursor-not-allowed",
                  activeButton === control.id && "scale-95"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-background/50",
                  control.color
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn("text-xs font-semibold uppercase tracking-wider", control.color)}>
                  {control.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => onAction("safe-mode", "Entering safe mode...")}
          >
            <Shield className="h-3 w-3 mr-1.5" />
            Safe Mode
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => onAction("emergency", "Emergency protocol activated")}
          >
            <Zap className="h-3 w-3 mr-1.5" />
            Emergency
          </Button>
        </div>
      </div>

      {/* Warning */}
      <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg bg-yellow-500/5 p-3 border border-yellow-500/20">
        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-yellow-200/70 leading-relaxed">
          Critical operations require operator authentication. Contact system administrator for restricted access.
        </p>
      </div>
    </div>
  )
}
