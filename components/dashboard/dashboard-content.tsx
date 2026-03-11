"use client"

import { useDashboard } from "@/lib/dashboard-context"
import { MetricCard } from "./metric-card"
import { LiveMetricsChart } from "./live-metrics-chart"
import { NodeTable } from "./node-table"
import { ControlPanel } from "./control-panel"
import { LogConsole } from "./log-console"
import { SatelliteOverview } from "./satellite-overview"
import { Cpu, MemoryStick, Network, Zap, Thermometer, Activity } from "lucide-react"

export function DashboardContent() {
  const { metrics, handleControlAction, isSystemRunning, nodes, logs, satellites } = useDashboard()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mission Control</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time system monitoring and control interface
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Monitoring Active</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu.value.toFixed(1)}
          unit="%"
          trend={metrics.cpu.trend}
          trendValue={metrics.cpu.trendValue}
          icon={Cpu}
          status={metrics.cpu.value > 85 ? "critical" : metrics.cpu.value > 70 ? "warning" : "normal"}
        />
        <MetricCard
          title="Memory"
          value={metrics.memory.value.toFixed(1)}
          unit="GB"
          trend={metrics.memory.trend}
          trendValue={metrics.memory.trendValue}
          icon={MemoryStick}
        />
        <MetricCard
          title="Network I/O"
          value={metrics.network.value.toFixed(2)}
          unit="Gbps"
          trend={metrics.network.trend}
          trendValue={metrics.network.trendValue}
          icon={Network}
        />
        <MetricCard
          title="Power Draw"
          value={Math.round(metrics.power.value).toString()}
          unit="W"
          trend={metrics.power.trend}
          trendValue={metrics.power.trendValue}
          icon={Zap}
        />
        <MetricCard
          title="Temperature"
          value={metrics.temp.value.toFixed(1)}
          unit="°C"
          trend={metrics.temp.trend}
          trendValue={metrics.temp.trendValue}
          icon={Thermometer}
          status={metrics.temp.value > 65 ? "critical" : metrics.temp.value > 55 ? "warning" : "normal"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LiveMetricsChart />
        </div>
        {/* Control Panel */}
        <div>
          <ControlPanel onAction={handleControlAction} isSystemRunning={isSystemRunning} />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Satellite Overview - Takes 2 columns */}
        <div className="lg:col-span-2 min-h-[400px]">
          <SatelliteOverview satellites={satellites} />
        </div>
        {/* Log Console */}
        <div className="min-h-[400px]">
          <LogConsole logs={logs} />
        </div>
      </div>

      {/* Node Table - Full Width */}
      <div>
        <NodeTable nodes={nodes} />
      </div>
    </div>
  )
}
