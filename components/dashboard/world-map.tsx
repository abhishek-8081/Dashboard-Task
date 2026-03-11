"use client"

import { cn } from "@/lib/utils"

interface NodeLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: "online" | "warning" | "offline"
}

const nodeLocations: NodeLocation[] = [
  { id: "N-01", name: "Berlin", lat: 52.52, lng: 13.405, status: "online" },
  { id: "N-02", name: "Hamburg", lat: 53.55, lng: 9.99, status: "online" },
  { id: "N-03", name: "Geneva", lat: 46.2, lng: 6.15, status: "online" },
  { id: "N-04", name: "Tokyo", lat: 35.68, lng: 139.69, status: "warning" },
  { id: "N-05", name: "Chicago", lat: 41.88, lng: -87.63, status: "online" },
  { id: "N-06", name: "Sydney", lat: -33.87, lng: 151.21, status: "offline" },
]

// Convert lat/lng to SVG coordinates (simple mercator projection)
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return { x, y }
}

export function WorldMap() {
  const statusColors = {
    online: "#22c55e",
    warning: "#eab308",
    offline: "#ef4444",
  }

  return (
    <div className="rounded-lg border border-border bg-card panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 panel-header border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Global Node Distribution</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
            Real-time status map
          </p>
        </div>
        <div className="flex items-center gap-4">
          {(["online", "warning", "offline"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="text-[10px] text-muted-foreground capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-48 bg-[oklch(0.08_0.01_250)] overflow-hidden">
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(0.3 0.01 250)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simplified world outline */}
        <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Continents - simplified paths */}
          <g fill="oklch(0.2 0.01 250)" stroke="oklch(0.3 0.02 195)" strokeWidth="0.1">
            {/* North America */}
            <ellipse cx="22" cy="18" rx="12" ry="8" />
            {/* South America */}
            <ellipse cx="28" cy="35" rx="5" ry="9" />
            {/* Europe */}
            <ellipse cx="50" cy="15" rx="6" ry="5" />
            {/* Africa */}
            <ellipse cx="52" cy="28" rx="6" ry="9" />
            {/* Asia */}
            <ellipse cx="70" cy="18" rx="15" ry="10" />
            {/* Australia */}
            <ellipse cx="82" cy="38" rx="5" ry="4" />
          </g>

          {/* Node locations */}
          {nodeLocations.map((node) => {
            const { x, y } = project(node.lat, node.lng)
            // Scale to viewBox
            const svgX = x
            const svgY = y * 0.5
            return (
              <g key={node.id}>
                {/* Pulse ring */}
                {node.status === "online" && (
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r="2"
                    fill="none"
                    stroke={statusColors[node.status]}
                    strokeWidth="0.3"
                    opacity="0.5"
                    className="status-pulse"
                  />
                )}
                {/* Node dot */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="1"
                  fill={statusColors[node.status]}
                  className={node.status === "online" ? "drop-shadow-[0_0_3px_rgba(34,197,94,0.8)]" : ""}
                />
              </g>
            )
          })}
        </svg>

        {/* Node labels overlay */}
        <div className="absolute inset-0">
          {nodeLocations.map((node) => {
            const { x, y } = project(node.lat, node.lng)
            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y * 0.5}%` }}
              >
                <div className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap mb-1",
                  "bg-background/80 border backdrop-blur-sm",
                  node.status === "online" ? "border-green-500/30 text-green-400" :
                  node.status === "warning" ? "border-yellow-500/30 text-yellow-400" :
                  "border-red-500/30 text-red-400"
                )}>
                  {node.id}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
