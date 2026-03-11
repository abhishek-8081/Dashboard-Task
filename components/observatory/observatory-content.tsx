"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { 
  Telescope, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Download,
  Maximize2,
  RefreshCw,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

interface PlotData {
  id: string
  title: string
  xLabel: string
  yLabel: string
  type: "line" | "scatter" | "histogram"
  color: string
  data: { x: number; y: number; timestamp?: string }[]
  isLive: boolean
  satellite: string
}

const PLOT_COLORS = [
  "#22d3ee", // cyan
  "#4ade80", // green  
  "#facc15", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#fb923c", // orange
]

// Generate sample data
function generateSampleData(type: string, points = 50): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = []
  for (let i = 0; i < points; i++) {
    let y: number
    if (type === "sine") {
      y = Math.sin(i * 0.2) * 50 + 50 + (Math.random() - 0.5) * 10
    } else if (type === "gaussian") {
      y = Math.exp(-Math.pow(i - points/2, 2) / 200) * 100 + (Math.random() - 0.5) * 5
    } else if (type === "linear") {
      y = i * 2 + (Math.random() - 0.5) * 20
    } else {
      y = Math.random() * 100
    }
    data.push({ x: i, y })
  }
  return data
}

const initialPlots: PlotData[] = [
  {
    id: "plot-1",
    title: "Sensor Temperature",
    xLabel: "Time (s)",
    yLabel: "Temperature (°C)",
    type: "line",
    color: PLOT_COLORS[0],
    data: generateSampleData("sine"),
    isLive: true,
    satellite: "SensorReadout",
  },
  {
    id: "plot-2",
    title: "Beam Position X/Y",
    xLabel: "X Position (mm)",
    yLabel: "Y Position (mm)",
    type: "scatter",
    color: PLOT_COLORS[1],
    data: Array.from({ length: 200 }, () => ({
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
    })),
    isLive: true,
    satellite: "MotionController",
  },
  {
    id: "plot-3",
    title: "Event Energy Distribution",
    xLabel: "Energy (keV)",
    yLabel: "Count",
    type: "histogram",
    color: PLOT_COLORS[2],
    data: generateSampleData("gaussian", 30),
    isLive: false,
    satellite: "DataLogger",
  },
  {
    id: "plot-4",
    title: "Power Supply Voltage",
    xLabel: "Time (s)",
    yLabel: "Voltage (V)",
    type: "line",
    color: PLOT_COLORS[3],
    data: generateSampleData("linear"),
    isLive: true,
    satellite: "PowerSupplyCtrl",
  },
]

export function ObservatoryContent() {
  const [plots, setPlots] = useState<PlotData[]>(initialPlots)
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)
  const [isAddingPlot, setIsAddingPlot] = useState(false)
  const [newPlot, setNewPlot] = useState({
    title: "",
    type: "line" as PlotData["type"],
    satellite: "SensorReadout",
    xLabel: "Time (s)",
    yLabel: "Value",
  })

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (!plot.isLive) return plot
          
          const newData = [...plot.data]
          if (plot.type === "scatter") {
            // Add new scatter point
            newData.push({
              x: 50 + (Math.random() - 0.5) * 20,
              y: 50 + (Math.random() - 0.5) * 20,
            })
            if (newData.length > 300) newData.shift()
          } else {
            // Shift line/histogram data
            const lastX = newData[newData.length - 1]?.x || 0
            const newY = plot.type === "histogram" 
              ? Math.exp(-Math.pow(Math.random() * 30 - 15, 2) / 200) * 100
              : (plot.data[plot.data.length - 1]?.y || 50) + (Math.random() - 0.5) * 10
            newData.push({ x: lastX + 1, y: Math.max(0, Math.min(100, newY)) })
            if (newData.length > 60) newData.shift()
          }
          
          return { ...plot, data: newData }
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAddPlot = () => {
    const plot: PlotData = {
      id: `plot-${Date.now()}`,
      title: newPlot.title,
      xLabel: newPlot.xLabel,
      yLabel: newPlot.yLabel,
      type: newPlot.type,
      color: PLOT_COLORS[plots.length % PLOT_COLORS.length],
      data: generateSampleData(newPlot.type === "scatter" ? "random" : "sine"),
      isLive: true,
      satellite: newPlot.satellite,
    }
    setPlots((prev) => [...prev, plot])
    setIsAddingPlot(false)
    setNewPlot({ title: "", type: "line", satellite: "SensorReadout", xLabel: "Time (s)", yLabel: "Value" })
  }

  const handleRemovePlot = (id: string) => {
    setPlots((prev) => prev.filter((p) => p.id !== id))
    if (selectedPlot === id) setSelectedPlot(null)
  }

  const togglePlotLive = (id: string) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isLive: !p.isLive } : p))
    )
  }

  const clearPlotData = useCallback((id: string) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === id ? { ...p, data: [] } : p))
    )
  }, [])

  const livePlots = plots.filter((p) => p.isLive).length

  const renderPlotChart = (plot: PlotData, isExpanded = false) => {
    const height = isExpanded ? 400 : 200

    if (plot.type === "scatter") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="x" 
              type="number" 
              name={plot.xLabel}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name={plot.yLabel}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "6px",
              }}
            />
            <Scatter data={plot.data} fill={plot.color} />
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (plot.type === "histogram") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={plot.data} margin={{ top: 10, right: 10, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="x"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis 
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="y" fill={plot.color} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={plot.data} margin={{ top: 10, right: 10, bottom: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="x"
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            axisLine={{ stroke: "#374151" }}
          />
          <YAxis 
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            axisLine={{ stroke: "#374151" }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(75, 85, 99, 0.5)",
              borderRadius: "6px",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke={plot.color} 
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Observatory</h1>
          <p className="text-sm text-muted-foreground">
            Real-time data visualization and plotting interface
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(livePlots > 0 && "border-green-500 text-green-500")}>
            {livePlots} Live Plots
          </Badge>
          <Button 
            onClick={() => setIsAddingPlot(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plot
          </Button>
        </div>
      </div>

      {/* Add Plot Form */}
      {isAddingPlot && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm text-card-foreground">Configure New Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <Field>
                <FieldLabel className="text-card-foreground">Title</FieldLabel>
                <Input
                  value={newPlot.title}
                  onChange={(e) => setNewPlot({ ...newPlot, title: e.target.value })}
                  placeholder="Plot title"
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Type</FieldLabel>
                <Select
                  value={newPlot.type}
                  onValueChange={(v) => setNewPlot({ ...newPlot, type: v as PlotData["type"] })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="histogram">Histogram</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Satellite</FieldLabel>
                <Select
                  value={newPlot.satellite}
                  onValueChange={(v) => setNewPlot({ ...newPlot, satellite: v })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="SensorReadout">SensorReadout</SelectItem>
                    <SelectItem value="DataLogger">DataLogger</SelectItem>
                    <SelectItem value="PowerSupplyCtrl">PowerSupplyCtrl</SelectItem>
                    <SelectItem value="MotionController">MotionController</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">X Label</FieldLabel>
                <Input
                  value={newPlot.xLabel}
                  onChange={(e) => setNewPlot({ ...newPlot, xLabel: e.target.value })}
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
              <Field>
                <FieldLabel className="text-card-foreground">Y Label</FieldLabel>
                <Input
                  value={newPlot.yLabel}
                  onChange={(e) => setNewPlot({ ...newPlot, yLabel: e.target.value })}
                  className="bg-secondary/50 border-border text-card-foreground"
                />
              </Field>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddPlot} disabled={!newPlot.title}>
                Create Plot
              </Button>
              <Button variant="outline" onClick={() => setIsAddingPlot(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plots Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {plots.map((plot) => (
          <Card 
            key={plot.id} 
            className={cn(
              "bg-card border-border transition-all",
              selectedPlot === plot.id && "md:col-span-2"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: plot.color }}
                    />
                    {plot.title}
                  </CardTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {plot.satellite}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {plot.type}
                    </Badge>
                    {plot.isLive && (
                      <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                        LIVE
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => togglePlotLive(plot.id)}
                  >
                    {plot.isLive ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => clearPlotData(plot.id)}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setSelectedPlot(selectedPlot === plot.id ? null : plot.id)}
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleRemovePlot(plot.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-[10px] text-muted-foreground mb-2">
                {plot.xLabel} vs {plot.yLabel} | {plot.data.length} points
              </div>
              {renderPlotChart(plot, selectedPlot === plot.id)}
            </CardContent>
          </Card>
        ))}
      </div>

      {plots.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Telescope className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground">No Plots Configured</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a plot to start visualizing data from your satellites
            </p>
            <Button 
              className="mt-4"
              onClick={() => setIsAddingPlot(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Plot
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
