"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"
import { Activity, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataPoint {
  time: string
  cpu: number
  network: number
  dataRate: number
}

function generateInitialData(): DataPoint[] {
  const data: DataPoint[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 2000)
    data.push({
      time: time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      cpu: Math.floor(Math.random() * 30) + 45,
      network: Math.floor(Math.random() * 40) + 30,
      dataRate: Math.floor(Math.random() * 25) + 60,
    })
  }
  return data
}

const metrics = [
  { key: "cpu", label: "CPU Load", color: "oklch(0.7 0.15 195)", icon: Activity },
  { key: "network", label: "Network I/O", color: "oklch(0.65 0.18 145)", icon: TrendingUp },
  { key: "dataRate", label: "Data Rate", color: "oklch(0.75 0.15 85)", icon: Zap },
]

export function LiveMetricsChart() {
  const [data, setData] = useState<DataPoint[]>(generateInitialData())
  const [activeMetric, setActiveMetric] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          cpu: Math.floor(Math.random() * 30) + 45,
          network: Math.floor(Math.random() * 40) + 30,
          dataRate: Math.floor(Math.random() * 25) + 60,
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const latestData = data[data.length - 1]

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 panel-header border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Real-Time System Metrics</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
            30 Second Window | 2s Refresh Rate
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Streaming</span>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-secondary/20">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const value = latestData[metric.key as keyof DataPoint]
          return (
            <button
              key={metric.key}
              onMouseEnter={() => setActiveMetric(metric.key)}
              onMouseLeave={() => setActiveMetric(null)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg border transition-all",
                activeMetric === metric.key || activeMetric === null
                  ? "bg-secondary/50 border-border"
                  : "bg-transparent border-transparent opacity-40"
              )}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <div className="text-left">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="block text-lg font-bold text-foreground" style={{ color: metric.color }}>
                  {typeof value === 'number' ? value.toFixed(0) : value}%
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Chart */}
      <div className="h-72 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {metrics.map((metric) => (
                <linearGradient key={metric.key} id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.01 250)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="oklch(0.4 0 0)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fill: "oklch(0.5 0 0)" }}
            />
            <YAxis
              stroke="oklch(0.4 0 0)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "oklch(0.5 0 0)" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.01 250)",
                border: "1px solid oklch(0.25 0.01 250)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px oklch(0 0 0 / 0.3)",
              }}
              labelStyle={{ color: "oklch(0.7 0 0)", marginBottom: "4px", fontWeight: 600 }}
              itemStyle={{ padding: "2px 0" }}
            />
            {metrics.map((metric) => (
              <Area
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.label}
                stroke={metric.color}
                strokeWidth={activeMetric === null || activeMetric === metric.key ? 2 : 1}
                fill={`url(#gradient-${metric.key})`}
                fillOpacity={activeMetric === null || activeMetric === metric.key ? 1 : 0.3}
                dot={false}
                activeDot={{ r: 4, fill: metric.color, stroke: "oklch(0.12 0.01 250)", strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
