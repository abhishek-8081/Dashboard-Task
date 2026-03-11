"use client"

import { DashboardProvider } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LogsContent } from "@/components/logs/logs-content"

export default function LogsPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <LogsContent />
      </DashboardLayout>
    </DashboardProvider>
  )
}
