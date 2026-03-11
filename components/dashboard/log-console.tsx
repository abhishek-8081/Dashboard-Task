"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal, Pause, Play, Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: "info" | "warning" | "error" | "success"
}

interface LogConsoleProps {
  logs: LogEntry[]
}

export function LogConsole({ logs }: LogConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (scrollRef.current && autoScroll && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, autoScroll, isPaused])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setAutoScroll(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  const typeConfig = {
    info: {
      color: "text-foreground",
      prefix: "INFO",
      prefixColor: "text-primary bg-primary/10",
    },
    warning: {
      color: "text-yellow-300",
      prefix: "WARN",
      prefixColor: "text-yellow-400 bg-yellow-500/10",
    },
    error: {
      color: "text-red-300",
      prefix: "ERROR",
      prefixColor: "text-red-400 bg-red-500/10",
    },
    success: {
      color: "text-green-300",
      prefix: "OK",
      prefixColor: "text-green-400 bg-green-500/10",
    },
  }

  const displayedLogs = isPaused ? logs.slice(0, -5) : logs

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 panel-header border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">System Console</span>
          <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/50">
            {logs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <Play className="h-3 w-3 text-green-400" />
            ) : (
              <Pause className="h-3 w-3 text-yellow-400" />
            )}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Download className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Console Output */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[oklch(0.06_0.01_250)] p-3 font-mono text-xs scanlines"
      >
        {displayedLogs.map((log, index) => {
          const config = typeConfig[log.type]
          return (
            <div
              key={log.id}
              className={cn(
                "flex items-start gap-2 py-1 px-2 rounded hover:bg-white/5 transition-colors",
                config.color
              )}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <span className="text-muted-foreground/60 shrink-0 w-[72px]">
                {log.timestamp}
              </span>
              <span className={cn(
                "shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider",
                config.prefixColor
              )}>
                {config.prefix}
              </span>
              <span className="flex-1">{log.message}</span>
            </div>
          )
        })}
        
        {/* Cursor line */}
        <div className="flex items-center gap-2 py-1 px-2 text-muted-foreground">
          <span className="w-[72px]" />
          <span className="text-primary">{">"}</span>
          <span className="terminal-cursor text-primary">_</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/20 shrink-0">
        <div className="flex items-center gap-3">
          {isPaused ? (
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-yellow-400">
              <Pause className="h-3 w-3" />
              PAUSED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        {!autoScroll && (
          <button
            onClick={() => {
              setAutoScroll(true)
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
              }
            }}
            className="text-[10px] font-medium text-primary hover:underline"
          >
            Jump to latest
          </button>
        )}
      </div>
    </div>
  )
}
