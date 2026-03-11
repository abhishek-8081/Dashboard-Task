"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useDashboard } from "@/lib/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { LogEntry } from "@/lib/types"
import { 
  ScrollText, 
  Search,
  Download,
  Trash2,
  Filter,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
} from "lucide-react"

const LOG_SOURCES = ["SYSTEM", "CHIRP", "DATA", "FSM", "CTRL", "NETWORK", "SENSOR", "MONITOR", "DAQ", "STORAGE", "CONFIG", "DIAG", "OBSERVATORY"]

export function LogsContent() {
  const { logs, clearLogs, addLog } = useDashboard()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>(["info", "warning", "error", "success"])
  const [sourceFilter, setSourceFilter] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const logContainerRef = useRef<HTMLDivElement>(null)
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([])

  // Update displayed logs when not paused
  useEffect(() => {
    if (!isPaused) {
      setDisplayedLogs(logs)
    }
  }, [logs, isPaused])

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [displayedLogs, autoScroll])

  // Filter logs
  const filteredLogs = useMemo(() => {
    return displayedLogs.filter((log) => {
      const matchesSearch = searchQuery === "" || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter.length === 0 || typeFilter.includes(log.type)
      const matchesSource = sourceFilter.length === 0 || (log.source && sourceFilter.includes(log.source))
      return matchesSearch && matchesType && matchesSource
    })
  }, [displayedLogs, searchQuery, typeFilter, sourceFilter])

  const handleExportLogs = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.type.toUpperCase()}] [${log.source || "SYSTEM"}] ${log.message}`)
      .join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `constellation-logs-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    addLog("Logs exported successfully", "success", "SYSTEM")
  }

  const toggleTypeFilter = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const toggleSourceFilter = (source: string) => {
    setSourceFilter((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    )
  }

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "error": return <AlertCircle className="h-3.5 w-3.5 text-red-400" />
      case "warning": return <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
      case "success": return <CheckCircle className="h-3.5 w-3.5 text-green-400" />
      default: return <Info className="h-3.5 w-3.5 text-primary" />
    }
  }

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error": return "text-red-400 bg-red-500/5 border-red-500/20"
      case "warning": return "text-yellow-400 bg-yellow-500/5 border-yellow-500/20"
      case "success": return "text-green-400 bg-green-500/5 border-green-500/20"
      default: return "text-primary bg-primary/5 border-primary/20"
    }
  }

  const logCounts = {
    info: displayedLogs.filter((l) => l.type === "info").length,
    warning: displayedLogs.filter((l) => l.type === "warning").length,
    error: displayedLogs.filter((l) => l.type === "error").length,
    success: displayedLogs.filter((l) => l.type === "success").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          <p className="text-sm text-muted-foreground">
            Real-time system event logging and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className={cn(isPaused && "border-yellow-500 text-yellow-500")}
          >
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogs} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xl font-bold text-card-foreground">{displayedLogs.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "bg-card border-border cursor-pointer transition-all",
            typeFilter.includes("info") && "border-primary"
          )}
          onClick={() => toggleTypeFilter("info")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold text-card-foreground">{logCounts.info}</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "bg-card border-border cursor-pointer transition-all",
            typeFilter.includes("success") && "border-green-500"
          )}
          onClick={() => toggleTypeFilter("success")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xl font-bold text-card-foreground">{logCounts.success}</p>
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "bg-card border-border cursor-pointer transition-all",
            typeFilter.includes("warning") && "border-yellow-500"
          )}
          onClick={() => toggleTypeFilter("warning")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xl font-bold text-card-foreground">{logCounts.warning}</p>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "bg-card border-border cursor-pointer transition-all",
            typeFilter.includes("error") && "border-red-500"
          )}
          onClick={() => toggleTypeFilter("error")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xl font-bold text-card-foreground">{logCounts.error}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="pl-9 bg-secondary/50 border-border text-card-foreground"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Sources:</span>
              <Select
                value={sourceFilter.length > 0 ? sourceFilter[0] : "all"}
                onValueChange={(v) => setSourceFilter(v === "all" ? [] : [v])}
              >
                <SelectTrigger className="w-32 h-8 text-xs bg-secondary/50 border-border">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Sources</SelectItem>
                  {LOG_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="autoScroll"
                  checked={autoScroll}
                  onCheckedChange={(checked) => setAutoScroll(!!checked)}
                />
                <label htmlFor="autoScroll" className="text-xs text-muted-foreground cursor-pointer">
                  Auto-scroll
                </label>
              </div>
            </div>
          </div>
          {sourceFilter.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {sourceFilter.map((source) => (
                <Badge 
                  key={source} 
                  variant="secondary" 
                  className="text-[10px] cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleSourceFilter(source)}
                >
                  {source}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Console */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <ScrollText className="h-4 w-4 text-primary" />
              Console Output
              {isPaused && (
                <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-500 text-[10px]">
                  PAUSED
                </Badge>
              )}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Showing {filteredLogs.length} of {displayedLogs.length} entries
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={logContainerRef}
            className="h-[500px] overflow-y-auto rounded-md bg-black/30 p-3 font-mono text-xs"
          >
            {filteredLogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No logs matching current filters
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "flex items-start gap-2 rounded px-2 py-1.5 border transition-all cursor-pointer hover:bg-secondary/30",
                      getLogColor(log.type),
                      expandedLog === log.id && "bg-secondary/50"
                    )}
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    <span className="shrink-0 pt-0.5">{getLogIcon(log.type)}</span>
                    <span className="shrink-0 text-muted-foreground w-20">[{log.timestamp}]</span>
                    {log.source && (
                      <Badge variant="outline" className="shrink-0 text-[9px] px-1 py-0 h-4">
                        {log.source}
                      </Badge>
                    )}
                    <span className={cn(
                      "flex-1",
                      log.type === "error" ? "text-red-300" :
                      log.type === "warning" ? "text-yellow-300" :
                      log.type === "success" ? "text-green-300" :
                      "text-foreground"
                    )}>
                      {log.message}
                    </span>
                    {expandedLog === log.id ? (
                      <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
