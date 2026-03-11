"use client"

import { useEffect, useState } from "react"
import { Activity, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataGaugeProps {
  title: string
  value: number
  maxValue: number
  unit: string
  trend?: "up" | "down" | "stable"
}

export function DataGauge({ title, value, maxValue, unit, trend = "stable" }: DataGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = (value / maxValue) * 100
  
  // Animate value
  useEffect(() => {
    const step = value / 20
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  // Calculate stroke dasharray for circular gauge
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage > 80) return { stroke: "oklch(0.6 0.2 25)", text: "text-red-400" }
    if (percentage > 60) return { stroke: "oklch(0.75 0.15 85)", text: "text-yellow-400" }
    return { stroke: "oklch(0.7 0.15 195)", text: "text-primary" }
  }

  const color = getColor()

  return (
    <div className="rounded-lg border border-border bg-card panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
        {trend !== "stable" && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-semibold",
            trend === "up" ? "text-green-400" : "text-red-400"
          )}>
            {trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-28 h-28 -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="oklch(0.18 0.01 250)"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color.stroke})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold font-mono", color.text)}>
            {displayValue.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>

      {/* Scale markers */}
      <div className="flex justify-between mt-3 px-2">
        <span className="text-[9px] text-muted-foreground">0</span>
        <span className="text-[9px] text-muted-foreground">{maxValue / 2}</span>
        <span className="text-[9px] text-muted-foreground">{maxValue}</span>
      </div>
    </div>
  )
}

export function DataGaugeRow() {
  const [dataRate, setDataRate] = useState(1.24)
  const [throughput, setThroughput] = useState(847)
  const [latency, setLatency] = useState(12.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setDataRate(1.1 + Math.random() * 0.4)
      setThroughput(780 + Math.random() * 150)
      setLatency(10 + Math.random() * 8)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 panel-header border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Performance Metrics</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="p-4">
          <DataGauge
            title="Data Rate"
            value={dataRate}
            maxValue={2.0}
            unit="GB/s"
            trend={dataRate > 1.3 ? "up" : "down"}
          />
        </div>
        <div className="p-4">
          <DataGauge
            title="Throughput"
            value={throughput}
            maxValue={1000}
            unit="req/s"
            trend={throughput > 850 ? "up" : "stable"}
          />
        </div>
        <div className="p-4">
          <DataGauge
            title="Latency"
            value={latency}
            maxValue={50}
            unit="ms"
            trend={latency < 15 ? "up" : "down"}
          />
        </div>
      </div>
    </div>
  )
}
