"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ServiceOverviewTab } from "@/components/service-overview-tab"
import { ServiceLogsTab } from "@/components/service-logs-tab"
import { ServiceMetricsTab } from "@/components/service-metrics-tab"
import { ServiceConfigTab } from "@/components/service-config-tab"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  ExternalLink,
  Settings,
  Activity,
  FileText,
  BarChart3,
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

interface ServiceDetailModalProps {
  service: AWSService | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceDetailModal({ service, open, onOpenChange }: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!service) return null

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <service.icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <DialogTitle className="text-xl">{service.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{service.service}</span>
                  <Badge variant="outline">{service.region}</Badge>
                  {getStatusIcon(service.health)}
                  <span className="text-sm capitalize">{service.health}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                AWS Console
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="overview" className="h-full overflow-hidden">
              <ServiceOverviewTab service={service} />
            </TabsContent>

            <TabsContent value="logs" className="h-full overflow-hidden">
              <ServiceLogsTab service={service} />
            </TabsContent>

            <TabsContent value="metrics" className="h-full overflow-hidden">
              <ServiceMetricsTab service={service} />
            </TabsContent>

            <TabsContent value="config" className="h-full overflow-hidden">
              <ServiceConfigTab service={service} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
