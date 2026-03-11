"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "@/lib/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { cn } from "@/lib/utils"
import type { Node } from "@/lib/types"
import { 
  Server, 
  Cpu,
  MemoryStick,
  Network,
  Thermometer,
  HardDrive,
  RefreshCw,
  Power,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react"

interface NodeHistory {
  time: string
  cpu: number
  memory: number
  network: number
}

export function NodesContent() {
  const { nodes, setNodes, addLog } = useDashboard()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodeHistory, setNodeHistory] = useState<Record<string, NodeHistory[]>>({})

  // Initialize history for all nodes
  useEffect(() => {
    const history: Record<string, NodeHistory[]> = {}
    nodes.forEach((node) => {
      history[node.id] = Array.from({ length: 30 }, (_, i) => ({
        time: `${30 - i}s`,
        cpu: Math.random() * 40 + 30,
        memory: Math.random() * 30 + 50,
        network: Math.random() * 500 + 200,
      }))
    })
    setNodeHistory(history)
  }, [nodes.length])

  // Update history with live data
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeHistory((prev) => {
        const updated = { ...prev }
        nodes.forEach((node) => {
          if (node.status === "online") {
            const current = updated[node.id] || []
            updated[node.id] = [
              ...current.slice(-29),
              {
                time: "now",
                cpu: node.cpuLoad,
                memory: node.memoryUsage || 50,
                network: (node.networkIn || 0) + (node.networkOut || 0),
              },
            ]
          }
        })
        return updated
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [nodes])

  const handleRestartNode = (node: Node) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === node.id ? { ...n, status: "warning" } : n
      )
    )
    addLog(`Restarting node ${node.name}...`, "warning", "NODE")
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, status: "online", lastActivity: "just now" } : n
        )
      )
      addLog(`Node ${node.name} restart complete`, "success", "NODE")
    }, 3000)
  }

  const handleToggleNode = (node: Node) => {
    if (node.status === "offline") {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, status: "online", lastActivity: "just now", cpuLoad: 15 } : n
        )
      )
      addLog(`Node ${node.name} powered on`, "success", "NODE")
    } else {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, status: "offline", cpuLoad: 0 } : n
        )
      )
      addLog(`Node ${node.name} powered off`, "warning", "NODE")
    }
  }

  const onlineNodes = nodes.filter((n) => n.status === "online").length
  const warningNodes = nodes.filter((n) => n.status === "warning").length
  const offlineNodes = nodes.filter((n) => n.status === "offline").length
  const avgCpu = nodes.filter((n) => n.status !== "offline").reduce((a, b) => a + b.cpuLoad, 0) / Math.max(1, nodes.filter((n) => n.status !== "offline").length)

  const getNodeIcon = (type?: string) => {
    switch (type) {
      case "compute": return <Cpu className="h-4 w-4" />
      case "storage": return <HardDrive className="h-4 w-4" />
      case "gateway": return <Network className="h-4 w-4" />
      case "sensor": return <Activity className="h-4 w-4" />
      default: return <Server className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Node Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and control compute nodes in the cluster
          </p>
        </div>
        <Button variant="outline" onClick={() => addLog("Refreshing node status...", "info", "NODE")}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh All
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Wifi className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{onlineNodes}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Activity className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{warningNodes}</p>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <WifiOff className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{offlineNodes}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{avgCpu.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Avg CPU</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nodes.map((node) => (
          <Card 
            key={node.id} 
            className={cn(
              "bg-card border-border cursor-pointer transition-all hover:border-primary/50",
              selectedNode?.id === node.id && "border-primary"
            )}
            onClick={() => setSelectedNode(node)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    node.status === "online" ? "bg-green-500/10 text-green-500" :
                    node.status === "warning" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      {node.name}
                    </CardTitle>
                    <p className="text-[10px] text-muted-foreground">{node.id}</p>
                  </div>
                </div>
                <Badge 
                  className={cn(
                    "text-[10px]",
                    node.status === "online" ? "bg-green-500/20 text-green-400" :
                    node.status === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  )}
                >
                  {node.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Resource Bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Cpu className="h-3 w-3" /> CPU
                  </span>
                  <span className={cn(
                    "font-medium",
                    node.cpuLoad > 80 ? "text-red-400" : "text-card-foreground"
                  )}>
                    {node.cpuLoad}%
                  </span>
                </div>
                <Progress 
                  value={node.cpuLoad} 
                  className={cn(
                    "h-1.5",
                    node.cpuLoad > 80 && "[&>div]:bg-red-500"
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MemoryStick className="h-3 w-3" /> Memory
                  </span>
                  <span className={cn(
                    "font-medium",
                    (node.memoryUsage || 0) > 85 ? "text-red-400" : "text-card-foreground"
                  )}>
                    {node.memoryUsage || 0}%
                  </span>
                </div>
                <Progress 
                  value={node.memoryUsage || 0} 
                  className={cn(
                    "h-1.5",
                    (node.memoryUsage || 0) > 85 && "[&>div]:bg-red-500"
                  )}
                />
              </div>

              {/* Network Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                  {node.networkIn || 0} MB/s
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  {node.networkOut || 0} MB/s
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleNode(node)
                  }}
                >
                  <Power className="mr-1 h-3 w-3" />
                  {node.status === "offline" ? "Start" : "Stop"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  disabled={node.status === "offline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRestartNode(node)
                  }}
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Restart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Server className="h-4 w-4 text-primary" />
                {selectedNode.name} - Detailed View
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Info Panel */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Node ID</p>
                    <p className="text-sm font-medium text-card-foreground">{selectedNode.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-card-foreground capitalize">{selectedNode.type || "Compute"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-sm font-medium text-card-foreground">{selectedNode.uptime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Activity</p>
                    <p className="text-sm font-medium text-card-foreground">{selectedNode.lastActivity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className={cn(
                      "text-sm font-medium",
                      (selectedNode.temperature || 0) > 60 ? "text-red-400" : "text-card-foreground"
                    )}>
                      {selectedNode.temperature || 45}°C
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge 
                      className={cn(
                        "text-[10px]",
                        selectedNode.status === "online" ? "bg-green-500/20 text-green-400" :
                        selectedNode.status === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      )}
                    >
                      {selectedNode.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* History Chart */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Resource History (30s)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={nodeHistory[selectedNode.id] || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      axisLine={{ stroke: "#374151" }}
                    />
                    <YAxis 
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      axisLine={{ stroke: "#374151" }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(75, 85, 99, 0.5)",
                        borderRadius: "6px",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke="#22d3ee" 
                      fill="#22d3ee" 
                      fillOpacity={0.2}
                      name="CPU %"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#4ade80" 
                      fill="#4ade80" 
                      fillOpacity={0.2}
                      name="Memory %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
