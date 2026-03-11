"use client"

import { DashboardProvider } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SatellitesContent } from "@/components/satellites/satellites-content"

export default function SatellitesPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <SatellitesContent />
      </DashboardLayout>
    </DashboardProvider>
  )
}
