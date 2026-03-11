"use client"

import { DashboardProvider } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { NodesContent } from "@/components/nodes/nodes-content"

export default function NodesPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <NodesContent />
      </DashboardLayout>
    </DashboardProvider>
  )
}
