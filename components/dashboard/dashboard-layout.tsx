"use client"

import { Sidebar } from "./sidebar"
import { StatusBar } from "./status-bar"
import { useDashboard } from "@/lib/dashboard-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { systemStatus, nodes } = useDashboard()
  const activeNodesCount = nodes.filter((n) => n.status === "online").length

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <Sidebar />
      <main className="relative pl-16 lg:pl-64">
        <StatusBar systemStatus={systemStatus} activeNodes={activeNodesCount} />
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
