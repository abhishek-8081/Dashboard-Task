"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { LogEntry, Node, Satellite, SystemMetrics, ChartDataPoint } from "./types"
import { initialSatellites, initialNodes, initialLogs, initialMetrics, generateInitialChartData } from "./store"

interface DashboardContextType {
  // System state
  systemStatus: "online" | "warning" | "error"
  isSystemRunning: boolean
  setIsSystemRunning: (running: boolean) => void
  
  // Logs
  logs: LogEntry[]
  addLog: (message: string, type: LogEntry["type"], source?: string) => void
  clearLogs: () => void
  
  // Nodes
  nodes: Node[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  
  // Satellites
  satellites: Satellite[]
  setSatellites: React.Dispatch<React.SetStateAction<Satellite[]>>
  
  // Metrics
  metrics: SystemMetrics
  chartData: ChartDataPoint[]
  
  // Actions
  handleControlAction: (action: string, message: string) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider")
  }
  return context
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [systemStatus, setSystemStatus] = useState<"online" | "warning" | "error">("online")
  const [isSystemRunning, setIsSystemRunning] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [satellites, setSatellites] = useState<Satellite[]>(initialSatellites)
  const [chartData, setChartData] = useState<ChartDataPoint[]>(() => generateInitialChartData())
  const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics)

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info", source = "SYSTEM") => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", { hour12: false })
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      message,
      type,
      source,
    }
    setLogs((prev) => [...prev.slice(-99), newLog])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    addLog("Log console cleared", "info", "SYSTEM")
  }, [addLog])

  const handleControlAction = useCallback((action: string, message: string) => {
    if (action === "start") {
      setIsSystemRunning(true)
      setSystemStatus("online")
      addLog(message, "success", "CTRL")
      addLog("All subsystems coming online...", "info", "SYSTEM")
    } else if (action === "stop") {
      setIsSystemRunning(false)
      setSystemStatus("error")
      addLog(message, "warning", "CTRL")
      addLog("Graceful shutdown in progress...", "info", "SYSTEM")
    } else if (action === "restart") {
      addLog(message, "info", "CTRL")
      addLog("Restarting selected satellites...", "warning", "CHIRP")
      setTimeout(() => addLog("Satellite restart complete", "success", "CHIRP"), 1500)
    } else if (action === "diagnostics") {
      addLog(message, "info", "DIAG")
      addLog("Running system diagnostics...", "info", "DIAG")
      setTimeout(() => addLog("CPU: OK | Memory: OK | Network: OK | Storage: OK", "success", "DIAG"), 1000)
      setTimeout(() => addLog("Diagnostic scan complete - no issues found", "success", "DIAG"), 2000)
    } else if (action === "transition") {
      addLog(message, "info", "FSM")
    }
  }, [addLog])

  // Simulated real-time updates
  useEffect(() => {
    if (!isSystemRunning) return

    const interval = setInterval(() => {
      // Update metrics
      setMetrics((prev) => ({
        cpu: {
          ...prev.cpu,
          value: Math.min(100, Math.max(40, prev.cpu.value + (Math.random() - 0.5) * 8)),
        },
        memory: {
          ...prev.memory,
          value: Math.min(16, Math.max(4, prev.memory.value + (Math.random() - 0.5) * 0.3)),
        },
        network: {
          ...prev.network,
          value: Math.max(0.1, prev.network.value + (Math.random() - 0.5) * 0.2),
        },
        power: {
          ...prev.power,
          value: Math.min(1000, Math.max(600, prev.power.value + (Math.random() - 0.5) * 20)),
        },
        temp: {
          ...prev.temp,
          value: Math.min(80, Math.max(35, prev.temp.value + (Math.random() - 0.5) * 2)),
        },
      }))

      // Update chart data
      const now = new Date()
      setChartData((prev) => {
        const newPoint: ChartDataPoint = {
          time: now.toLocaleTimeString("en-US", { hour12: false }),
          cpu: 50 + Math.random() * 40,
          network: 0.5 + Math.random() * 1.5,
          dataRate: 2 + Math.random() * 4,
          memory: 60 + Math.random() * 25,
        }
        return [...prev.slice(-30), newPoint]
      })

      // Occasionally update node status
      if (Math.random() < 0.1) {
        setNodes((prev) =>
          prev.map((node) => ({
            ...node,
            cpuLoad: Math.min(100, Math.max(5, node.cpuLoad + Math.floor((Math.random() - 0.5) * 10))),
            lastActivity: node.status === "online" ? "just now" : node.lastActivity,
          }))
        )
      }

      // Update satellite heartbeats
      setSatellites((prev) =>
        prev.map((sat) => ({
          ...sat,
          lastHeartbeat: sat.state === "RUN" || sat.state === "ORBIT" ? `${Math.floor(Math.random() * 5) + 1} seconds ago` : sat.lastHeartbeat,
          dataRate: sat.state === "RUN" ? Math.max(0, sat.dataRate + (Math.random() - 0.5) * 0.5) : sat.dataRate,
        }))
      )

      // Randomly add system logs
      if (Math.random() < 0.1) {
        const randomMessages = [
          { message: "Heartbeat received from PowerSupplyCtrl", type: "info" as const, source: "CHIRP" },
          { message: "Data packet processed successfully", type: "success" as const, source: "DATA" },
          { message: "Cache optimization complete", type: "info" as const, source: "SYSTEM" },
          { message: "Network latency nominal: 12ms", type: "info" as const, source: "NETWORK" },
          { message: "Sensor calibration verified", type: "success" as const, source: "SENSOR" },
          { message: "FSM transition: ORBIT -> RUN", type: "info" as const, source: "FSM" },
        ]
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)]
        addLog(randomMsg.message, randomMsg.type, randomMsg.source)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isSystemRunning, addLog])

  // Update system status based on metrics
  useEffect(() => {
    if (!isSystemRunning) return
    
    if (metrics.cpu.value > 90 || metrics.temp.value > 70) {
      setSystemStatus("warning")
    } else {
      setSystemStatus("online")
    }
  }, [metrics, isSystemRunning])

  return (
    <DashboardContext.Provider
      value={{
        systemStatus,
        isSystemRunning,
        setIsSystemRunning,
        logs,
        addLog,
        clearLogs,
        nodes,
        setNodes,
        satellites,
        setSatellites,
        metrics,
        chartData,
        handleControlAction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
