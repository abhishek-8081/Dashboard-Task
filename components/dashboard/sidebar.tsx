"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Server,
  Telescope,
  ScrollText,
  Settings,
  Radio,
  ChevronRight,
  Hexagon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { id: "/", label: "Mission Control", icon: LayoutDashboard, description: "System Overview" },
  { id: "/satellites", label: "Satellites", icon: Radio, description: "Device Management" },
  { id: "/nodes", label: "Nodes", icon: Server, description: "Node Status" },
  { id: "/observatory", label: "Observatory", icon: Telescope, description: "Data Visualization" },
  { id: "/logs", label: "Logs", icon: ScrollText, description: "System Logs" },
  { id: "/settings", label: "Settings", icon: Settings, description: "Configuration" },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col bg-sidebar border-r border-sidebar-border lg:w-64">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4 panel-header">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <Hexagon className="h-10 w-10 text-primary absolute" strokeWidth={1} />
          <Hexagon className="h-6 w-6 text-primary/60" strokeWidth={1.5} />
        </div>
        <div className="hidden lg:block">
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            CONSTELLATION
          </span>
          <span className="block text-[10px] font-medium tracking-widest text-primary uppercase">
            Operator Dashboard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        <div className="hidden lg:block mb-4">
          <span className="px-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Navigation
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.id
          return (
            <Link
              key={item.id}
              href={item.id}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border border-transparent"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                isActive ? "bg-primary/20" : "bg-transparent group-hover:bg-sidebar-accent"
              )}>
                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )} />
              </div>
              <div className="hidden lg:block flex-1">
                <span className="block">{item.label}</span>
                <span className={cn(
                  "block text-[10px] transition-colors",
                  isActive ? "text-primary/70" : "text-muted-foreground/60"
                )}>
                  {item.description}
                </span>
              </div>
              {isActive && (
                <ChevronRight className="hidden lg:block h-4 w-4 text-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="border-t border-sidebar-border p-4 panel-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-green-500 glow-green" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 status-pulse" />
          </div>
          <div className="hidden lg:block flex-1">
            <span className="block text-xs font-medium text-sidebar-foreground">
              System Online
            </span>
            <span className="block text-[10px] text-muted-foreground">
              All services operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
