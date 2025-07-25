"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Zap,
  HardDrive,
  Server,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface AWSService {
  id: string
  name: string
  service: string
  type: string
  status: string
  icon: React.ComponentType<any>
  region: string
  cost: number
  costTrend: number
  description: string
  health: string
  metrics: any
  alerts: number
  lastUpdated: string
}

interface ServiceOverviewTabProps {
  service: AWSService
}

export function ServiceOverviewTab({ service }: ServiceOverviewTabProps) {
  const getCostTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Activity className="h-4 w-4 text-slate-500" />
  }

  const renderServiceSpecificOverview = () => {
    switch (service.service) {
      case "Amazon RDS":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.cpu}%</div>
                <Progress value={service.metrics.cpu} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connections</CardTitle>
                <Database className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.connections}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Active connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.storage}%</div>
                <Progress value={service.metrics.storage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IOPS</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.iops}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Operations/sec</p>
              </CardContent>
            </Card>
          </div>
        )

      case "AWS Lambda":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invocations (24h)</CardTitle>
                <Zap className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.invocations.toLocaleString()}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total invocations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.duration}ms</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Execution time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{service.metrics.errors}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Failed invocations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cold Starts</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.coldStarts}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Initialization events</p>
              </CardContent>
            </Card>
          </div>
        )

      case "Amazon S3":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Objects</CardTitle>
                <HardDrive className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.objects.toLocaleString()}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total objects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.storage}TB</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Used storage</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requests (24h)</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.requests.toLocaleString()}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">API requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Transfer</CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.transfer}GB</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Outbound transfer</p>
              </CardContent>
            </Card>
          </div>
        )

      case "EC2 Instance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.cpu}%</div>
                <Progress value={service.metrics.cpu} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <Server className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.memory}%</div>
                <Progress value={service.metrics.memory} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
                <Activity className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.network}MB/s</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Network throughput</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{service.metrics.disk}%</div>
                <Progress value={service.metrics.disk} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-600 dark:text-slate-300">Service-specific metrics will be displayed here.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6 h-full overflow-auto">
      {/* Cost and Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${service.cost.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {getCostTrendIcon(service.costTrend)}
              <span
                className={
                  service.costTrend > 0 ? "text-red-500" : service.costTrend < 0 ? "text-green-500" : "text-slate-500"
                }
              >
                {service.costTrend > 0 ? "+" : ""}
                {service.costTrend.toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            {service.health === "healthy" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{service.health}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Last checked: {service.lastUpdated}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{service.alerts}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {service.alerts > 0 ? "Require attention" : "All systems normal"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service-specific Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        {renderServiceSpecificOverview()}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common operations for this service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              Configure Alerts
            </Button>
            <Button variant="outline" size="sm">
              Export Metrics
            </Button>
            <Button variant="outline" size="sm">
              Schedule Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
