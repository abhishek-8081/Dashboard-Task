"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  trend: "up" | "down" | "stable"
  trendValue: string
  icon: LucideIcon
  status?: "normal" | "warning" | "critical"
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  status = "normal",
}: MetricCardProps) {
  const trendConfig = {
    up: { icon: TrendingUp, color: "text-red-400", bgColor: "bg-red-500/10" },
    down: { icon: TrendingDown, color: "text-green-400", bgColor: "bg-green-500/10" },
    stable: { icon: Minus, color: "text-muted-foreground", bgColor: "bg-muted/50" },
  }

  const statusConfig = {
    normal: {
      border: "border-border hover:border-primary/30",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      glow: "",
    },
    warning: {
      border: "border-yellow-500/30 hover:border-yellow-500/50",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      glow: "shadow-[0_0_15px_-3px] shadow-yellow-500/20",
    },
    critical: {
      border: "border-red-500/30 hover:border-red-500/50",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      glow: "shadow-[0_0_15px_-3px] shadow-red-500/20",
    },
  }

  const TrendIcon = trendConfig[trend].icon
  const statusStyle = statusConfig[status]

  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card p-4 transition-all duration-300 card-interactive panel",
        statusStyle.border,
        statusStyle.glow
      )}
    >
      {/* Status indicator line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 rounded-t-lg transition-all duration-300",
        status === "normal" ? "bg-primary/50 group-hover:bg-primary" :
        status === "warning" ? "bg-yellow-500/50 group-hover:bg-yellow-500" :
        "bg-red-500/50 group-hover:bg-red-500"
      )} />

      <div className="flex items-start justify-between">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          statusStyle.iconBg
        )}>
          <Icon className={cn("h-5 w-5", statusStyle.iconColor)} />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
          trendConfig[trend].bgColor,
          trendConfig[trend].color
        )}>
          <TrendIcon className="h-3 w-3" />
          <span className="font-medium">{trendValue}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <p className={cn(
            "text-3xl font-bold tracking-tight text-foreground",
            status === "critical" && "metric-highlight text-red-400",
            status === "warning" && "text-yellow-400"
          )}>
            {value}
          </p>
          {unit && (
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-2 right-2 h-8 w-8 opacity-5">
        <Icon className="h-8 w-8" />
      </div>
    </div>
  )
}
