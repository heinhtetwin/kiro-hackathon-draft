"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, PieChart, Settings, Bell } from "lucide-react"

interface AWSService {
  id: string
  name: string
  service: string
  cost: number
  costTrend: number
  [key: string]: any
}

interface CostManagementDashboardProps {
  services: AWSService[]
}

export function CostManagementDashboard({ services }: CostManagementDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0)
  const projectedCost = totalCost * 1.15 // 15% increase projection
  const budget = 200 // Mock budget
  const budgetUsed = (totalCost / budget) * 100

  const costByService = services
    .sort((a, b) => b.cost - a.cost)
    .map((service) => ({
      ...service,
      percentage: (service.cost / totalCost) * 100,
    }))

  const getServiceColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
    ]
    return colors[index % colors.length]
  }

  const costOptimizationRecommendations = [
    {
      id: 1,
      service: "EC2 Instance",
      recommendation: "Right-size instance from t3.large to t3.medium",
      potentialSavings: 35.2,
      effort: "Low",
    },
    {
      id: 2,
      service: "Amazon S3",
      recommendation: "Move infrequently accessed objects to IA storage class",
      potentialSavings: 12.8,
      effort: "Medium",
    },
    {
      id: 3,
      service: "Amazon RDS",
      recommendation: "Enable automated backups optimization",
      potentialSavings: 8.5,
      effort: "Low",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${projectedCost.toFixed(2)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">End of month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
            <Target className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsed.toFixed(0)}%</div>
            <Progress value={budgetUsed} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${costOptimizationRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Per month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cost by Service
            </CardTitle>
            <CardDescription>Monthly spending breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costByService.map((service, index) => (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getServiceColor(index)}`} />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{service.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${service.cost.toFixed(2)}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{service.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Cost Optimization
            </CardTitle>
            <CardDescription>Recommendations to reduce costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costOptimizationRecommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{rec.service}</p>
                      <Badge
                        variant={
                          rec.effort === "Low" ? "default" : rec.effort === "Medium" ? "secondary" : "destructive"
                        }
                        className="text-xs mt-1"
                      >
                        {rec.effort} Effort
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${rec.potentialSavings}/mo</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{rec.recommendation}</p>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                    Apply Recommendation
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Budget Alerts & Forecasts
          </CardTitle>
          <CardDescription>Monitor spending and set up alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-sm">Budget Alert</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                You've used {budgetUsed.toFixed(0)}% of your monthly budget
              </p>
              <Button size="sm" variant="outline">
                Adjust Budget
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Forecast</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Projected to exceed budget by ${(projectedCost - budget).toFixed(2)} this month
              </p>
              <Button size="sm" variant="outline">
                View Forecast
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-sm">Configure</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Set up custom alerts and spending limits
              </p>
              <Button size="sm" variant="outline">
                Manage Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
