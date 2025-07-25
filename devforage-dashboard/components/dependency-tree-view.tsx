"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Package, AlertTriangle, Clock, ExternalLink } from "lucide-react"

interface Dependency {
  id: string
  name: string
  version: string
  latestVersion: string
  type?: string
  vulnerabilities: Array<{
    id: string
    severity: string
    title: string
    description: string
    affectedVersions: string
    fixedVersion: string
    publishedDate: string
    cvssScore: number
  }>
  outdated: boolean
  description?: string
  dependencies?: Dependency[]
}

interface DependencyTreeViewProps {
  dependencies: Dependency[]
  selectedDependencies: string[]
  onSelectDependency: (id: string, checked: boolean) => void
}

export function DependencyTreeView({
  dependencies,
  selectedDependencies,
  onSelectDependency,
}: DependencyTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  const getVulnerabilityIndicator = (vulnerabilities: Dependency["vulnerabilities"]) => {
    if (vulnerabilities.length === 0) return <div className="w-2 h-2 rounded-full bg-green-500" />

    const hasCritical = vulnerabilities.some((v) => v.severity === "critical")
    const hasHigh = vulnerabilities.some((v) => v.severity === "high")
    const hasMedium = vulnerabilities.some((v) => v.severity === "medium")

    if (hasCritical) return <div className="w-2 h-2 rounded-full bg-red-500" />
    if (hasHigh) return <div className="w-2 h-2 rounded-full bg-orange-500" />
    if (hasMedium) return <div className="w-2 h-2 rounded-full bg-yellow-500" />
    return <div className="w-2 h-2 rounded-full bg-blue-500" />
  }

  const renderDependency = (dep: Dependency, level = 0) => {
    const hasChildren = dep.dependencies && dep.dependencies.length > 0
    const isExpanded = expandedNodes.has(dep.id)
    const isSelected = selectedDependencies.includes(dep.id)

    return (
      <div key={dep.id} className="space-y-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
            isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-slate-200 dark:border-slate-700"
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse Button */}
          <div className="w-6 flex justify-center">
            {hasChildren ? (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleExpanded(dep.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* Checkbox */}
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectDependency(dep.id, checked as boolean)}
          />

          {/* Vulnerability Indicator */}
          {getVulnerabilityIndicator(dep.vulnerabilities)}

          {/* Package Icon */}
          <Package className="h-4 w-4 text-slate-600" />

          {/* Package Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-900 dark:text-white">{dep.name}</span>
              <Badge variant="outline" className="text-xs">
                {dep.version}
              </Badge>
              {dep.type && (
                <Badge variant={dep.type === "production" ? "default" : "secondary"} className="text-xs">
                  {dep.type}
                </Badge>
              )}
              {dep.outdated && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Update to {dep.latestVersion}
                </Badge>
              )}
            </div>
            {dep.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{dep.description}</p>
            )}
          </div>

          {/* Vulnerability Count */}
          {dep.vulnerabilities.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {dep.vulnerabilities.length} vuln{dep.vulnerabilities.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            {dep.outdated && (
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Update
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Child Dependencies */}
        {hasChildren && isExpanded && dep.dependencies && (
          <div className="space-y-2">{dep.dependencies.map((childDep) => renderDependency(childDep, level + 1))}</div>
        )}
      </div>
    )
  }

  return <div className="space-y-2">{dependencies.map((dep) => renderDependency(dep))}</div>
}
