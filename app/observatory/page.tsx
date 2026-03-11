"use client"

import { DashboardProvider } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ObservatoryContent } from "@/components/observatory/observatory-content"

export default function ObservatoryPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <ObservatoryContent />
      </DashboardLayout>
    </DashboardProvider>
  )
}
