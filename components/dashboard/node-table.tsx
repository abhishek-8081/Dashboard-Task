"use client"

import { cn } from "@/lib/utils"
import { Server, MoreHorizontal, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Node {
  id: string
  name: string
  status: "online" | "warning" | "offline"
  uptime: string
  lastActivity: string
  cpuLoad: number
}

interface NodeTableProps {
  nodes: Node[]
}

export function NodeTable({ nodes }: NodeTableProps) {
  const statusConfig = {
    online: {
      label: "ONLINE",
      dotColor: "bg-green-500",
      textColor: "text-green-400",
      bgColor: "bg-green-500/10",
      glow: "glow-green",
    },
    warning: {
      label: "WARNING",
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      glow: "glow-yellow",
    },
    offline: {
      label: "OFFLINE",
      dotColor: "bg-red-500",
      textColor: "text-red-400",
      bgColor: "bg-red-500/10",
      glow: "glow-red",
    },
  }

  const onlineCount = nodes.filter(n => n.status === "online").length
  const warningCount = nodes.filter(n => n.status === "warning").length

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 panel-header border-b border-border">
        <div className="flex items-center gap-3">
          <Server className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Node Status Monitor</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
              {nodes.length} Registered Nodes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                <span className="text-green-400 font-bold">{onlineCount}</span> Online
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground">
                <span className="text-yellow-400 font-bold">{warningCount}</span> Warning
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/20">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Node Identifier
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Uptime
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                CPU Utilization
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {nodes.map((node, index) => {
              const status = statusConfig[node.status]
              return (
                <tr 
                  key={node.id} 
                  className="hover:bg-secondary/10 transition-colors group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 border border-border">
                        <Server className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-mono font-semibold text-foreground">
                          {node.id}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{node.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-2.5 py-1 rounded-full",
                      status.bgColor
                    )}>
                      <div className="relative">
                        <div className={cn("h-2 w-2 rounded-full", status.dotColor)} />
                        {node.status === "online" && (
                          <div className={cn("absolute inset-0 h-2 w-2 rounded-full status-pulse", status.dotColor)} />
                        )}
                      </div>
                      <span className={cn("text-[10px] font-bold tracking-wider", status.textColor)}>
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-foreground">{node.uptime}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{node.lastActivity}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 max-w-24 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            node.cpuLoad > 80
                              ? "bg-gradient-to-r from-red-600 to-red-400"
                              : node.cpuLoad > 60
                              ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                              : "bg-gradient-to-r from-green-600 to-green-400"
                          )}
                          style={{ width: `${node.cpuLoad}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-sm font-mono font-semibold min-w-[3rem]",
                        node.cpuLoad > 80 ? "text-red-400" :
                        node.cpuLoad > 60 ? "text-yellow-400" : "text-green-400"
                      )}>
                        {node.cpuLoad}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Restart Node
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
