"use client"

import { useState } from "react"
import { useDashboard } from "@/lib/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { 
  Settings, 
  Network, 
  Bell, 
  Shield,
  Database,
  Save,
  RefreshCw,
  Wifi,
  Clock,
  Globe,
  Terminal,
  Eye,
  Moon,
  Volume2,
  Mail,
} from "lucide-react"

interface SettingsState {
  // Network
  controllerHost: string
  controllerPort: string
  heartbeatInterval: string
  connectionTimeout: string
  // Notifications
  enableNotifications: boolean
  soundEnabled: boolean
  emailAlerts: boolean
  alertEmail: string
  // Display
  darkMode: boolean
  compactView: boolean
  showTimestamps: boolean
  autoRefresh: boolean
  refreshInterval: string
  // Data
  logRetention: string
  maxLogEntries: string
  dataBufferSize: string
  autoExport: boolean
}

const defaultSettings: SettingsState = {
  controllerHost: "localhost",
  controllerPort: "23999",
  heartbeatInterval: "1000",
  connectionTimeout: "5000",
  enableNotifications: true,
  soundEnabled: false,
  emailAlerts: false,
  alertEmail: "",
  darkMode: true,
  compactView: false,
  showTimestamps: true,
  autoRefresh: true,
  refreshInterval: "2000",
  logRetention: "7",
  maxLogEntries: "1000",
  dataBufferSize: "100",
  autoExport: false,
}

export function SettingsContent() {
  const { addLog } = useDashboard()
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    addLog("Settings saved successfully", "success", "CONFIG")
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    addLog("Settings reset to defaults", "info", "CONFIG")
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure the Constellation Operator Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Unsaved changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="network" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border">
          <TabsTrigger value="network" className="data-[state=active]:bg-background">
            <Network className="mr-2 h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="data-[state=active]:bg-background">
            <Eye className="mr-2 h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-background">
            <Database className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Globe className="h-4 w-4 text-primary" />
                Controller Connection
              </CardTitle>
              <CardDescription>
                Configure connection to the Constellation controller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-card-foreground">Controller Host</FieldLabel>
                  <Input
                    value={settings.controllerHost}
                    onChange={(e) => updateSetting("controllerHost", e.target.value)}
                    placeholder="localhost"
                    className="bg-secondary/50 border-border text-card-foreground"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-card-foreground">Controller Port</FieldLabel>
                  <Input
                    value={settings.controllerPort}
                    onChange={(e) => updateSetting("controllerPort", e.target.value)}
                    placeholder="23999"
                    className="bg-secondary/50 border-border text-card-foreground"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Wifi className="h-4 w-4 text-primary" />
                Connection Parameters
              </CardTitle>
              <CardDescription>
                Configure heartbeat and timeout settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-card-foreground">Heartbeat Interval (ms)</FieldLabel>
                  <Select
                    value={settings.heartbeatInterval}
                    onValueChange={(v) => updateSetting("heartbeatInterval", v)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="500">500ms</SelectItem>
                      <SelectItem value="1000">1000ms</SelectItem>
                      <SelectItem value="2000">2000ms</SelectItem>
                      <SelectItem value="5000">5000ms</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-card-foreground">Connection Timeout (ms)</FieldLabel>
                  <Select
                    value={settings.connectionTimeout}
                    onValueChange={(v) => updateSetting("connectionTimeout", v)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="3000">3000ms</SelectItem>
                      <SelectItem value="5000">5000ms</SelectItem>
                      <SelectItem value="10000">10000ms</SelectItem>
                      <SelectItem value="30000">30000ms</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Bell className="h-4 w-4 text-primary" />
                Alert Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive system alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Bell className="h-4 w-4" />
                    Browser Notifications
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive desktop notifications for system events
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Volume2 className="h-4 w-4" />
                    Sound Alerts
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Play audio for critical warnings and errors
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Mail className="h-4 w-4" />
                    Email Alerts
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send email notifications for critical events
                  </p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => updateSetting("emailAlerts", checked)}
                />
              </div>

              {settings.emailAlerts && (
                <Field>
                  <FieldLabel className="text-card-foreground">Alert Email Address</FieldLabel>
                  <Input
                    type="email"
                    value={settings.alertEmail}
                    onChange={(e) => updateSetting("alertEmail", e.target.value)}
                    placeholder="operator@example.com"
                    className="bg-secondary/50 border-border text-card-foreground"
                  />
                </Field>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Eye className="h-4 w-4 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the dashboard appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Terminal className="h-4 w-4" />
                    Compact View
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reduce spacing for more compact display
                  </p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => updateSetting("compactView", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Clock className="h-4 w-4" />
                    Show Timestamps
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Display timestamps in log entries
                  </p>
                </div>
                <Switch
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) => updateSetting("showTimestamps", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <RefreshCw className="h-4 w-4 text-primary" />
                Auto-Refresh
              </CardTitle>
              <CardDescription>
                Configure automatic data refresh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-card-foreground">Enable Auto-Refresh</div>
                  <p className="text-xs text-muted-foreground">
                    Automatically update data in real-time
                  </p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => updateSetting("autoRefresh", checked)}
                />
              </div>

              {settings.autoRefresh && (
                <Field>
                  <FieldLabel className="text-card-foreground">Refresh Interval</FieldLabel>
                  <Select
                    value={settings.refreshInterval}
                    onValueChange={(v) => updateSetting("refreshInterval", v)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="1000">1 second</SelectItem>
                      <SelectItem value="2000">2 seconds</SelectItem>
                      <SelectItem value="5000">5 seconds</SelectItem>
                      <SelectItem value="10000">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Database className="h-4 w-4 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>
                Configure data storage and retention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-card-foreground">Log Retention (days)</FieldLabel>
                  <Select
                    value={settings.logRetention}
                    onValueChange={(v) => updateSetting("logRetention", v)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-card-foreground">Max Log Entries</FieldLabel>
                  <Select
                    value={settings.maxLogEntries}
                    onValueChange={(v) => updateSetting("maxLogEntries", v)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="100">100 entries</SelectItem>
                      <SelectItem value="500">500 entries</SelectItem>
                      <SelectItem value="1000">1000 entries</SelectItem>
                      <SelectItem value="5000">5000 entries</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-card-foreground">Data Buffer Size (MB)</FieldLabel>
                  <Input
                    value={settings.dataBufferSize}
                    onChange={(e) => updateSetting("dataBufferSize", e.target.value)}
                    placeholder="100"
                    className="bg-secondary/50 border-border text-card-foreground"
                  />
                </Field>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-card-foreground">Auto-Export</div>
                    <p className="text-xs text-muted-foreground">
                      Automatically export data periodically
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoExport}
                    onCheckedChange={(checked) => updateSetting("autoExport", checked)}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Shield className="h-4 w-4 text-primary" />
                System Information
              </CardTitle>
              <CardDescription>
                Current system version and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Dashboard Version</p>
                  <p className="text-sm font-medium text-card-foreground">v1.0.0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Constellation Protocol</p>
                  <p className="text-sm font-medium text-card-foreground">CHIRP v2.1</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Build Date</p>
                  <p className="text-sm font-medium text-card-foreground">2024-02-24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
