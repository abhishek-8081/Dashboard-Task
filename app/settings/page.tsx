"use client"

import { DashboardProvider } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </DashboardProvider>
  )
}
