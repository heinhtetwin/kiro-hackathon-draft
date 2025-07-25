"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AWSServiceCard } from "@/components/aws-service-card"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { CostManagementDashboard } from "@/components/cost-management-dashboard"
import { AlertConfigModal } from "@/components/alert-config-modal"
import {
  Database,
  Zap,
  HardDrive,
  BarChart3,
  Server,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Settings,
  Bell,
  TrendingUp,
  Activity,
} from "lucide-react"

// Mock AWS services data
const mockAWSServices = [
  {
    id: "rds-1",
    name: "production-db",
    service: "Amazon RDS",
    type: "Database",
    status: "healthy",
    icon: Database,
    region: "us-east-1",
    cost: 45.2,
    costTrend: 5.2,
    description: "PostgreSQL 14.9 - db.t3.medium",
    health: "healthy",
    metrics: {
      connections: 12,
      cpu: 35,
      storage: 78,
      iops: 1250,
    },
    alerts: 2,
    lastUpdated: "2 minutes ago",
  },
  {
    id: "lambda-1",
    name: "api-handler",
    service: "AWS Lambda",
    type: "Compute",
    status: "active",
    icon: Zap,
    region: "us-east-1",
    cost: 12.5,
    costTrend: -2.1,
    description: "Node.js 18.x - 512MB memory",
    health: "healthy",
    metrics: {
      invocations: 45230,
      duration: 245,
      errors: 12,
      coldStarts: 89,
    },
    alerts: 0,
    lastUpdated: "1 minute ago",
  },
  {
    id: "s3-1",
    name: "app-assets-bucket",
    service: "Amazon S3",
    type: "Storage",
    status: "active",
    icon: HardDrive,
    region: "us-east-1",
    cost: 8.75,
    costTrend: 12.3,
    description: "Standard storage - 2.3TB",
    health: "healthy",
    metrics: {
      objects: 125430,
      storage: 2.3,
      requests: 89450,
      transfer: 450,
    },
    alerts: 1,
    lastUpdated: "30 seconds ago",
  },
  {
    id: "cloudwatch-1",
    name: "monitoring-logs",
    service: "CloudWatch",
    type: "Monitoring",
    status: "active",
    icon: BarChart3,
    region: "us-east-1",
    cost: 15.3,
    costTrend: 8.7,
    description: "Log groups and metrics",
    health: "warning",
    metrics: {
      logEvents: 2450000,
      metrics: 1250,
      alarms: 15,
      storage: 12.5,
    },
    alerts: 3,
    lastUpdated: "5 minutes ago",
  },
  {
    id: "ec2-1",
    name: "web-server-01",
    service: "EC2 Instance",
    type: "Compute",
    status: "running",
    icon: Server,
    region: "us-east-1",
    cost: 89.6,
    costTrend: 0,
    description: "t3.large - Ubuntu 22.04",
    health: "healthy",
    metrics: {
      cpu: 45,
      memory: 67,
      network: 125,
      disk: 34,
    },
    alerts: 1,
    lastUpdated: "1 minute ago",
  },
]

export function AWSServicesContent() {
  const [selectedService, setSelectedService] = useState<(typeof mockAWSServices)[0] | null>(null)
  const [showCostDashboard, setShowCostDashboard] = useState(false)
  const [showAlertConfig, setShowAlertConfig] = useState(false)
  const [activeTab, setActiveTab] = useState("services")

  const totalCost = mockAWSServices.reduce((sum, service) => sum + service.cost, 0)
  const healthyServices = mockAWSServices.filter((service) => service.health === "healthy").length
  const warningServices = mockAWSServices.filter((service) => service.health === "warning").length
  const totalAlerts = mockAWSServices.reduce((sum, service) => sum + service.alerts, 0)

  const avgCostTrend = mockAWSServices.reduce((sum, service) => sum + service.costTrend, 0) / mockAWSServices.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AWS Services</h2>
          <p className="text-slate-600 dark:text-slate-300">Monitor and manage your AWS infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAlertConfig(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Alerts ({totalAlerts})
          </Button>
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAWSServices.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Across 1 region</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <div className="flex items-center text-xs">
              <TrendingUp className={`h-3 w-3 mr-1 ${avgCostTrend > 0 ? "text-red-500" : "text-green-500"}`} />
              <span className={avgCostTrend > 0 ? "text-red-500" : "text-green-500"}>
                {avgCostTrend > 0 ? "+" : ""}
                {avgCostTrend.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyServices}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Services running well</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningServices}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAlerts}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Require action</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Services Overview
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAWSServices.map((service) => (
              <AWSServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <CostManagementDashboard services={mockAWSServices} />
        </TabsContent>
      </Tabs>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      />

      {/* Alert Configuration Modal */}
      <AlertConfigModal open={showAlertConfig} onOpenChange={setShowAlertConfig} services={mockAWSServices} />
    </div>
  )
}
