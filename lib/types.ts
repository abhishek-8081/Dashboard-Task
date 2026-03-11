export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: "info" | "warning" | "error" | "success"
  source?: string
}

export interface Node {
  id: string
  name: string
  status: "online" | "warning" | "offline"
  uptime: string
  lastActivity: string
  cpuLoad: number
  memoryUsage?: number
  networkIn?: number
  networkOut?: number
  temperature?: number
  type?: "compute" | "storage" | "gateway" | "sensor"
}

export interface Satellite {
  id: string
  name: string
  type: "CHIRP" | "CMDP" | "DATA" | "CTRL"
  state: "NEW" | "INIT" | "ORBIT" | "RUN" | "SAFE" | "ERROR" | "DEAD"
  host: string
  port: number
  lastHeartbeat: string
  connectedSince?: string
  commands: number
  dataRate: number
}

export interface MetricPoint {
  timestamp: string
  value: number
}

export interface SystemMetrics {
  cpu: { value: number; trend: "up" | "down" | "stable"; trendValue: string }
  memory: { value: number; trend: "up" | "down" | "stable"; trendValue: string }
  network: { value: number; trend: "up" | "down" | "stable"; trendValue: string }
  power: { value: number; trend: "up" | "down" | "stable"; trendValue: string }
  temp: { value: number; trend: "up" | "down" | "stable"; trendValue: string }
}

export interface ChartDataPoint {
  time: string
  cpu: number
  network: number
  dataRate: number
  memory?: number
}

export interface ObservatoryPlot {
  id: string
  title: string
  xLabel: string
  yLabel: string
  data: { x: number; y: number }[]
  color: string
  type: "line" | "scatter" | "histogram"
}
