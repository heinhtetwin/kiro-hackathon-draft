"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Bell,
  ExternalLink,
  Activity,
} from "lucide-react"

interface ServiceMetrics {
  [key: string]: number
}

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
  metrics: ServiceMetrics
  alerts: number
  lastUpdated: string
}

interface AWSServiceCardProps {
  service: AWSService
  onClick: () => void
}

export function AWSServiceCard({ service, onClick }: AWSServiceCardProps) {
  const getStatusIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "border-l-green-500"
      case "warning":
        return "border-l-yellow-500"
      case "error":
        return "border-l-red-500"
      default:
        return "border-l-slate-300"
    }
  }

  const getCostTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-red-500" />
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-green-500" />
    return <Activity className="h-3 w-3 text-slate-500" />
  }

  const renderServiceMetrics = () => {
    switch (service.service) {
      case "Amazon RDS":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>CPU Usage</span>
              <span>{service.metrics.cpu}%</span>
            </div>
            <Progress value={service.metrics.cpu} className="h-1" />
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Connections: {service.metrics.connections}</span>
              <span>Storage: {service.metrics.storage}%</span>
            </div>
          </div>
        )
      case "AWS Lambda":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Invocations (24h)</span>
              <span>{service.metrics.invocations.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Avg Duration: {service.metrics.duration}ms</span>
              <span>Errors: {service.metrics.errors}</span>
            </div>
          </div>
        )
      case "Amazon S3":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Objects</span>
              <span>{service.metrics.objects.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Storage: {service.metrics.storage}TB</span>
              <span>Requests: {service.metrics.requests.toLocaleString()}</span>
            </div>
          </div>
        )
      case "EC2 Instance":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>CPU Usage</span>
              <span>{service.metrics.cpu}%</span>
            </div>
            <Progress value={service.metrics.cpu} className="h-1" />
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Memory: {service.metrics.memory}%</span>
              <span>Disk: {service.metrics.disk}%</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <span>Metrics available in detail view</span>
          </div>
        )
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${getStatusColor(service.health)}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <service.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-base">{service.name}</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">{service.service}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(service.health)}
            {service.alerts > 0 && (
              <Badge variant="destructive" className="text-xs px-1">
                <Bell className="w-3 h-3 mr-1" />
                {service.alerts}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description and Region */}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs">
              {service.region}
            </Badge>
            <span className="text-xs text-slate-500">{service.lastUpdated}</span>
          </div>
        </div>

        {/* Cost Information */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-sm font-medium">${service.cost.toFixed(2)}/month</p>
            <div className="flex items-center gap-1 text-xs">
              {getCostTrendIcon(service.costTrend)}
              <span
                className={
                  service.costTrend > 0 ? "text-red-500" : service.costTrend < 0 ? "text-green-500" : "text-slate-500"
                }
              >
                {service.costTrend > 0 ? "+" : ""}
                {service.costTrend.toFixed(1)}%
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Service-specific Metrics */}
        {renderServiceMetrics()}
      </CardContent>
    </Card>
  )
}
