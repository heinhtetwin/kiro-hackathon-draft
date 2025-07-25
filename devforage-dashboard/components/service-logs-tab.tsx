"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Play, Pause, RefreshCw, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  source?: string
  details?: string
}

interface AWSService {
  id: string
  name: string
  service: string
  [key: string]: any
}

interface ServiceLogsTabProps {
  service: AWSService
}

// Mock log data
const generateMockLogs = (service: AWSService): LogEntry[] => {
  const logs: LogEntry[] = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - i * 60000) // 1 minute intervals
    const levels: LogEntry["level"][] = ["info", "warn", "error", "debug"]
    const level = levels[Math.floor(Math.random() * levels.length)]

    let message = ""
    let source = ""

    switch (service.service) {
      case "Amazon RDS":
        source = "postgresql"
        const rdsMessages = [
          "Connection established from 10.0.1.45:5432",
          "Query executed successfully in 45ms",
          "Checkpoint completed: wrote 1024 buffers",
          "Slow query detected: SELECT * FROM users WHERE created_at > '2024-01-01'",
          "Connection pool exhausted, rejecting new connections",
        ]
        message = rdsMessages[Math.floor(Math.random() * rdsMessages.length)]
        break

      case "AWS Lambda":
        source = "lambda-runtime"
        const lambdaMessages = [
          "Function invocation started",
          "Cold start detected, initializing runtime",
          "Function executed successfully in 245ms",
          "Memory usage: 128MB / 512MB",
          "Function timeout after 30 seconds",
        ]
        message = lambdaMessages[Math.floor(Math.random() * lambdaMessages.length)]
        break

      case "Amazon S3":
        source = "s3-access"
        const s3Messages = [
          "GET request for object: /images/profile-123.jpg",
          "PUT request completed: /uploads/document.pdf",
          "Bucket policy updated successfully",
          "Cross-origin request blocked from unauthorized domain",
          "Lifecycle policy applied: 1000 objects transitioned to IA",
        ]
        message = s3Messages[Math.floor(Math.random() * s3Messages.length)]
        break

      default:
        source = "system"
        message = "System event logged"
    }

    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      level,
      message,
      source,
      details: level === "error" ? "Stack trace and additional error details would appear here" : undefined,
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function ServiceLogsTab({ service }: ServiceLogsTabProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [isStreaming, setIsStreaming] = useState(false)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  useEffect(() => {
    const mockLogs = generateMockLogs(service)
    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [service])

  useEffect(() => {
    let filtered = logs

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.source?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, levelFilter])

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogEntry["level"],
        message: "New real-time log entry",
        source: "live-stream",
      }

      setLogs((prev) => [newLog, ...prev.slice(0, 99)]) // Keep only 100 logs
    }, 3000)

    return () => clearInterval(interval)
  }, [isStreaming])

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warn":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "debug":
        return <CheckCircle className="h-4 w-4 text-slate-500" />
      default:
        return <Info className="h-4 w-4 text-slate-500" />
    }
  }

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "warn":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "debug":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={levelFilter} onValueChange={setLevelFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
              <TabsTrigger value="warn">Warnings</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={isStreaming ? "default" : "outline"} size="sm" onClick={() => setIsStreaming(!isStreaming)}>
            {isStreaming ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isStreaming ? "Stop Stream" : "Live Stream"}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Log Entries */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Log Entries ({filteredLogs.length})</span>
            {isStreaming && (
              <Badge variant="default" className="bg-green-600">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Real-time logs from {service.name}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-start gap-3">
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${getLevelColor(log.level)}`}>{log.level.toUpperCase()}</Badge>
                        {log.source && (
                          <Badge variant="outline" className="text-xs">
                            {log.source}
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-900 dark:text-white font-mono">{log.message}</p>
                      {expandedLog === log.id && log.details && (
                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No logs found matching your criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
