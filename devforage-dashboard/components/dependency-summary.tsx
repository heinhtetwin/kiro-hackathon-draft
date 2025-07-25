"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Shield, TrendingUp, Clock, PieChart } from "lucide-react"

interface DependencySummaryProps {
  totalDeps: number
  vulnerableDeps: number
  outdatedDeps: number
  securityScore: number
  criticalVulns: number
  highVulns: number
  mediumVulns: number
  lowVulns: number
}

export function DependencySummary({
  totalDeps,
  vulnerableDeps,
  outdatedDeps,
  securityScore,
  criticalVulns,
  highVulns,
  mediumVulns,
  lowVulns,
}: DependencySummaryProps) {
  const totalVulns = criticalVulns + highVulns + mediumVulns + lowVulns
  const recentlyUpdated = 8 // Mock data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Total Dependencies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dependencies</CardTitle>
          <Package className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDeps}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Production & Development</p>
        </CardContent>
      </Card>

      {/* Vulnerabilities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalVulns}</div>
          <div className="flex gap-1 mt-1">
            {criticalVulns > 0 && (
              <Badge variant="destructive" className="text-xs px-1">
                {criticalVulns}C
              </Badge>
            )}
            {highVulns > 0 && <Badge className="text-xs px-1 bg-orange-500">{highVulns}H</Badge>}
            {mediumVulns > 0 && <Badge className="text-xs px-1 bg-yellow-500">{mediumVulns}M</Badge>}
            {lowVulns > 0 && <Badge className="text-xs px-1 bg-blue-500">{lowVulns}L</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          <Shield className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
          <Progress value={securityScore} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Outdated */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outdated</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{outdatedDeps}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Updates available</p>
        </CardContent>
      </Card>

      {/* Recently Updated */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{recentlyUpdated}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Last 7 days</p>
        </CardContent>
      </Card>

      {/* Vulnerability Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
          <PieChart className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Critical</span>
              </div>
              <span className="font-medium">{criticalVulns}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>High</span>
              </div>
              <span className="font-medium">{highVulns}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Medium</span>
              </div>
              <span className="font-medium">{mediumVulns}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Low</span>
              </div>
              <span className="font-medium">{lowVulns}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
