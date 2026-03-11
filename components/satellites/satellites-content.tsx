"use client"

import { useState } from "react"
import { useDashboard } from "@/lib/dashboard-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Satellite } from "@/lib/types"
import { 
  Radio, 
  Plus, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2,
  Settings,
  Activity,
  Clock,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Zap,
  X,
} from "lucide-react"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const stateConfig: Record<Satellite["state"], { color: string; bg: string; border: string }> = {
  NEW: { color: "text-muted-foreground", bg: "bg-muted/30", border: "border-muted-foreground/30" },
  INIT: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  ORBIT: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  RUN: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  SAFE: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  ERROR: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  DEAD: { color: "text-red-500", bg: "bg-red-900/20", border: "border-red-900/30" },
}

const typeConfig: Record<Satellite["type"], { color: string; bg: string; label: string }> = {
  CHIRP: { color: "text-purple-400", bg: "bg-purple-500/10", label: "Heartbeat" },
  CMDP: { color: "text-blue-400", bg: "bg-blue-500/10", label: "Command" },
  DATA: { color: "text-green-400", bg: "bg-green-500/10", label: "Data Stream" },
  CTRL: { color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Controller" },
}

const FSM_TRANSITIONS: Record<string, string[]> = {
  NEW: ["INIT"],
  INIT: ["ORBIT"],
  ORBIT: ["RUN", "SAFE"],
  RUN: ["ORBIT", "SAFE"],
  SAFE: ["ORBIT", "INIT"],
  ERROR: ["SAFE", "INIT"],
  DEAD: [],
}

export function SatellitesContent() {
  const { satellites, setSatellites, addLog, handleControlAction } = useDashboard()
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSatellite, setNewSatellite] = useState({
    name: "",
    type: "DATA" as Satellite["type"],
    host: "",
    port: "23999",
  })

  const handleAddSatellite = () => {
    const satellite: Satellite = {
      id: `sat-${Date.now()}`,
      name: newSatellite.name,
      type: newSatellite.type,
      state: "NEW",
      host: newSatellite.host,
      port: parseInt(newSatellite.port),
      lastHeartbeat: "never",
      commands: 0,
      dataRate: 0,
    }
    setSatellites((prev) => [...prev, satellite])
    addLog(`Satellite ${newSatellite.name} added to constellation`, "success", "CHIRP")
    setIsAddDialogOpen(false)
    setNewSatellite({ name: "", type: "DATA", host: "", port: "23999" })
  }

  const handleStateTransition = (satellite: Satellite, newState: Satellite["state"]) => {
    setSatellites((prev) =>
      prev.map((s) =>
        s.id === satellite.id ? { ...s, state: newState } : s
      )
    )
    addLog(`FSM transition: ${satellite.name} ${satellite.state} -> ${newState}`, "info", "FSM")
    handleControlAction("transition", `State transition initiated for ${satellite.name}`)
  }

  const handleRemoveSatellite = (satellite: Satellite) => {
    setSatellites((prev) => prev.filter((s) => s.id !== satellite.id))
    addLog(`Satellite ${satellite.name} removed from constellation`, "warning", "CHIRP")
    setSelectedSatellite(null)
  }

  const runningSatellites = satellites.filter((s) => s.state === "RUN").length
  const orbitSatellites = satellites.filter((s) => s.state === "ORBIT").length
  const errorSatellites = satellites.filter((s) => s.state === "ERROR" || s.state === "DEAD").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Satellite Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and control connected satellites in the constellation
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Satellite
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Satellite</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Connect a new satellite to the constellation network.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="gap-4 py-4">
              <Field>
                <FieldLabel className="text-card-foreground">Name</FieldLabel>
                <Input
                  value={newSatellite.name}
                  onChange={(e) => setNewSatellite({ ...newSatellite, name: e.target.value })}
                  placeholder="e.g., SensorReadout"
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Type</FieldLabel>
                <Select
                  value={newSatellite.type}
                  onValueChange={(v) => setNewSatellite({ ...newSatellite, type: v as Satellite["type"] })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="CHIRP">CHIRP - Heartbeat</SelectItem>
                    <SelectItem value="CMDP">CMDP - Command</SelectItem>
                    <SelectItem value="DATA">DATA - Data Stream</SelectItem>
                    <SelectItem value="CTRL">CTRL - Controller</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Host</FieldLabel>
                <Input
                  value={newSatellite.host}
                  onChange={(e) => setNewSatellite({ ...newSatellite, host: e.target.value })}
                  placeholder="192.168.1.100"
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Port</FieldLabel>
                <Input
                  value={newSatellite.port}
                  onChange={(e) => setNewSatellite({ ...newSatellite, port: e.target.value })}
                  placeholder="23999"
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSatellite} disabled={!newSatellite.name || !newSatellite.host}>
                Add Satellite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card panel p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Play className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{runningSatellites}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Running</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card panel p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
              <Activity className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{orbitSatellites}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Orbit</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card panel p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <WifiOff className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{errorSatellites}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Error/Dead</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card panel p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Radio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{satellites.length}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fleet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {satellites.map((satellite) => {
          const state = stateConfig[satellite.state]
          const type = typeConfig[satellite.type]
          const isActive = satellite.state === "RUN" || satellite.state === "ORBIT"
          
          return (
            <div 
              key={satellite.id} 
              className={cn(
                "rounded-lg border bg-card panel cursor-pointer transition-all duration-200",
                "hover:border-primary/50 hover:shadow-[0_0_20px_-5px] hover:shadow-primary/20",
                selectedSatellite?.id === satellite.id && "border-primary ring-1 ring-primary/20"
              )}
              onClick={() => setSelectedSatellite(satellite)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      isActive ? "bg-green-500" : 
                      satellite.state === "ERROR" || satellite.state === "DEAD" ? "bg-red-500" :
                      satellite.state === "ORBIT" ? "bg-yellow-500" : "bg-muted-foreground"
                    )} />
                    {isActive && (
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 status-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{satellite.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {satellite.host}:{satellite.port}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-[10px] font-bold", type.bg, type.color)}>
                    {satellite.type}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* State Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Current State
                  </span>
                  <Badge className={cn("text-xs font-bold px-3 py-1", state.bg, state.color, state.border)}>
                    {satellite.state}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/30 p-3 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Commands</span>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                    <p className="text-lg font-bold text-foreground font-mono">{satellite.commands}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-3 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Data Rate</span>
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-lg font-bold text-foreground font-mono">{satellite.dataRate.toFixed(1)}<span className="text-xs text-muted-foreground ml-1">MB/s</span></p>
                  </div>
                </div>

                {/* Last Heartbeat */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last heartbeat: {satellite.lastHeartbeat}</span>
                </div>

                {/* FSM Controls */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                  {FSM_TRANSITIONS[satellite.state]?.map((nextState) => (
                    <Button
                      key={nextState}
                      size="sm"
                      variant="outline"
                      className="h-7 px-3 text-[10px] font-semibold uppercase tracking-wider"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStateTransition(satellite, nextState as Satellite["state"])
                      }}
                    >
                      {nextState === "RUN" && <Play className="mr-1.5 h-3 w-3 text-green-500" />}
                      {nextState === "SAFE" && <Square className="mr-1.5 h-3 w-3 text-orange-500" />}
                      {nextState === "ORBIT" && <Activity className="mr-1.5 h-3 w-3 text-yellow-500" />}
                      {nextState === "INIT" && <RotateCcw className="mr-1.5 h-3 w-3 text-blue-500" />}
                      {nextState}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveSatellite(satellite)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Panel */}
      {selectedSatellite && (
        <div className="rounded-lg border border-border bg-card panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 panel-header border-b border-border">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">{selectedSatellite.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Satellite Configuration</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedSatellite(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-5">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Server className="h-3 w-3" />
                  Connection Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Host</span>
                    <span className="font-mono text-foreground">{selectedSatellite.host}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Port</span>
                    <span className="font-mono text-foreground">{selectedSatellite.port}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Connected</span>
                    <span className="font-mono text-foreground">{selectedSatellite.connectedSince || "Not connected"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Commands Sent</span>
                    <span className="font-mono font-semibold text-foreground">{selectedSatellite.commands}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Data Rate</span>
                    <span className="font-mono font-semibold text-foreground">{selectedSatellite.dataRate.toFixed(2)} MB/s</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Last Heartbeat</span>
                    <span className="font-mono text-foreground">{selectedSatellite.lastHeartbeat}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Wifi className="h-3 w-3" />
                  State Machine
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(["NEW", "INIT", "ORBIT", "RUN", "SAFE", "ERROR", "DEAD"] as Satellite["state"][]).map((state) => {
                    const config = stateConfig[state]
                    const isCurrent = selectedSatellite.state === state
                    return (
                      <Badge
                        key={state}
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold transition-all",
                          isCurrent ? cn(config.bg, config.color, config.border, "ring-1 ring-current") : "opacity-40"
                        )}
                      >
                        {state}
                      </Badge>
                    )
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Available transitions: {FSM_TRANSITIONS[selectedSatellite.state]?.join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
