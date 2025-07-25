"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DependencyTreeView } from "@/components/dependency-tree-view"
import { VulnerabilityCard } from "@/components/vulnerability-card"
import { DependencySummary } from "@/components/dependency-summary"
import {
  Search,
  Filter,
  Download,
  Calendar,
  Shield,
  Package,
  TreePine,
  List,
  MoreHorizontal,
  RefreshCw,
  FileText,
} from "lucide-react"

// Mock dependency data with vulnerabilities
const mockDependencies = [
  {
    id: "1",
    name: "express",
    version: "4.18.2",
    latestVersion: "4.18.2",
    type: "production",
    vulnerabilities: [],
    outdated: false,
    description: "Fast, unopinionated, minimalist web framework",
    dependencies: [
      {
        id: "1-1",
        name: "accepts",
        version: "1.3.8",
        latestVersion: "1.3.8",
        vulnerabilities: [],
        outdated: false,
      },
      {
        id: "1-2",
        name: "body-parser",
        version: "1.20.1",
        latestVersion: "1.20.2",
        vulnerabilities: [],
        outdated: true,
      },
    ],
  },
  {
    id: "2",
    name: "lodash",
    version: "4.17.20",
    latestVersion: "4.17.21",
    type: "production",
    outdated: true,
    description: "Lodash modular utilities",
    vulnerabilities: [
      {
        id: "CVE-2021-23337",
        severity: "high",
        title: "Command Injection in lodash",
        description: "lodash versions prior to 4.17.21 are vulnerable to Command Injection via the template function.",
        affectedVersions: "< 4.17.21",
        fixedVersion: "4.17.21",
        publishedDate: "2021-02-15",
        cvssScore: 7.2,
      },
      {
        id: "CVE-2020-8203",
        severity: "medium",
        title: "Prototype Pollution in lodash",
        description: "lodash prior to 4.17.19 is vulnerable to Prototype Pollution in zipObjectDeep function.",
        affectedVersions: "< 4.17.19",
        fixedVersion: "4.17.19",
        publishedDate: "2020-07-15",
        cvssScore: 5.3,
      },
    ],
    dependencies: [],
  },
  {
    id: "3",
    name: "axios",
    version: "0.27.2",
    latestVersion: "1.6.2",
    type: "production",
    outdated: true,
    description: "Promise based HTTP client",
    vulnerabilities: [
      {
        id: "CVE-2023-45857",
        severity: "critical",
        title: "Server-Side Request Forgery in axios",
        description: "axios versions before 1.6.0 are vulnerable to Server-Side Request Forgery.",
        affectedVersions: "< 1.6.0",
        fixedVersion: "1.6.0",
        publishedDate: "2023-11-08",
        cvssScore: 9.1,
      },
    ],
    dependencies: [
      {
        id: "3-1",
        name: "follow-redirects",
        version: "1.15.2",
        latestVersion: "1.15.4",
        vulnerabilities: [
          {
            id: "CVE-2024-28849",
            severity: "medium",
            title: "Improper Input Validation in follow-redirects",
            description: "follow-redirects versions before 1.15.4 are vulnerable to improper input validation.",
            affectedVersions: "< 1.15.4",
            fixedVersion: "1.15.4",
            publishedDate: "2024-03-14",
            cvssScore: 6.1,
          },
        ],
        outdated: true,
      },
    ],
  },
  {
    id: "4",
    name: "react",
    version: "18.2.0",
    latestVersion: "18.2.0",
    type: "production",
    vulnerabilities: [],
    outdated: false,
    description: "React is a JavaScript library for building user interfaces",
    dependencies: [
      {
        id: "4-1",
        name: "loose-envify",
        version: "1.4.0",
        latestVersion: "1.4.0",
        vulnerabilities: [],
        outdated: false,
      },
    ],
  },
  {
    id: "5",
    name: "jest",
    version: "29.3.1",
    latestVersion: "29.7.0",
    type: "development",
    vulnerabilities: [],
    outdated: true,
    description: "JavaScript testing framework",
    dependencies: [],
  },
]

type SeverityFilter = "all" | "critical" | "high" | "medium" | "low"

export function DependenciesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree")
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all")
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([])

  // Calculate statistics
  const totalDeps = mockDependencies.length
  const vulnerableDeps = mockDependencies.filter((dep) => dep.vulnerabilities.length > 0).length
  const outdatedDeps = mockDependencies.filter((dep) => dep.outdated).length

  const allVulnerabilities = mockDependencies.flatMap((dep) =>
    dep.vulnerabilities.concat(dep.dependencies?.flatMap((subDep) => subDep.vulnerabilities || []) || []),
  )

  const criticalVulns = allVulnerabilities.filter((v) => v.severity === "critical").length
  const highVulns = allVulnerabilities.filter((v) => v.severity === "high").length
  const mediumVulns = allVulnerabilities.filter((v) => v.severity === "medium").length
  const lowVulns = allVulnerabilities.filter((v) => v.severity === "low").length

  const securityScore = Math.round(((totalDeps - vulnerableDeps) / totalDeps) * 100)

  // Filter dependencies based on search and severity
  const filteredDependencies = mockDependencies.filter((dep) => {
    const matchesSearch =
      dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (severityFilter === "all") return true

    const hasMatchingSeverity =
      dep.vulnerabilities.some((vuln) => vuln.severity === severityFilter) ||
      dep.dependencies?.some((subDep) => subDep.vulnerabilities?.some((vuln) => vuln.severity === severityFilter))

    return hasMatchingSeverity
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDependencies(filteredDependencies.map((dep) => dep.id))
    } else {
      setSelectedDependencies([])
    }
  }

  const handleSelectDependency = (depId: string, checked: boolean) => {
    if (checked) {
      setSelectedDependencies((prev) => [...prev, depId])
    } else {
      setSelectedDependencies((prev) => prev.filter((id) => id !== depId))
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dependencies Analysis</h2>
          <p className="text-slate-600 dark:text-slate-300">Manage vulnerabilities and keep dependencies secure</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Updates
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
                <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Security Report (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Vulnerability List (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                Dependency Tree (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Dashboard */}
      <DependencySummary
        totalDeps={totalDeps}
        vulnerableDeps={vulnerableDeps}
        outdatedDeps={outdatedDeps}
        securityScore={securityScore}
        criticalVulns={criticalVulns}
        highVulns={highVulns}
        mediumVulns={mediumVulns}
        lowVulns={lowVulns}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search dependencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <div className="flex gap-1">
              {[
                { key: "all", label: "All", color: "bg-slate-500" },
                { key: "critical", label: "Critical", color: "bg-red-500" },
                { key: "high", label: "High", color: "bg-orange-500" },
                { key: "medium", label: "Medium", color: "bg-yellow-500" },
                { key: "low", label: "Low", color: "bg-blue-500" },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={severityFilter === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSeverityFilter(filter.key as SeverityFilter)}
                  className={severityFilter === filter.key ? `${filter.color} hover:${filter.color}/90` : ""}
                >
                  {filter.label}
                  {filter.key !== "all" && (
                    <span className="ml-1 text-xs">
                      (
                      {filter.key === "critical"
                        ? criticalVulns
                        : filter.key === "high"
                          ? highVulns
                          : filter.key === "medium"
                            ? mediumVulns
                            : lowVulns}
                      )
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "tree" | "list")}>
          <TabsList>
            <TabsTrigger value="tree" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              Tree View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions */}
      {selectedDependencies.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedDependencies.length} dependencies selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Selected
                </Button>
                <Button size="sm" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Ignore Vulnerabilities
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dependencies Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dependencies ({filteredDependencies.length})</CardTitle>
              <CardDescription>
                {viewMode === "tree" ? "Hierarchical view of dependencies" : "Flat list of all dependencies"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedDependencies.length === filteredDependencies.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "tree" ? (
            <DependencyTreeView
              dependencies={filteredDependencies}
              selectedDependencies={selectedDependencies}
              onSelectDependency={handleSelectDependency}
            />
          ) : (
            <div className="space-y-4">
              {filteredDependencies.map((dep) => (
                <VulnerabilityCard
                  key={dep.id}
                  dependency={dep}
                  selected={selectedDependencies.includes(dep.id)}
                  onSelect={(checked) => handleSelectDependency(dep.id, checked)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
