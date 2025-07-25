"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Database,
  TableIcon,
  Key,
  Link,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  HardDrive,
  Zap,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react"

// Mock database data
const mockDatabaseData = {
  overview: {
    type: "PostgreSQL",
    version: "15.4",
    status: "healthy",
    uptime: "99.9%",
    connections: {
      active: 12,
      max: 100,
      usage: 12,
    },
    storage: {
      used: 2.4,
      total: 10,
      usage: 24,
    },
    performance: {
      qps: 1250,
      avgResponseTime: 45,
      slowQueries: 3,
    },
  },
  tables: [
    {
      name: "users",
      rows: 15420,
      size: "2.1 MB",
      lastModified: "2024-01-15T10:30:00Z",
      indexes: 4,
      primaryKey: "id",
      foreignKeys: 0,
      status: "healthy",
    },
    {
      name: "orders",
      rows: 8932,
      size: "1.8 MB",
      lastModified: "2024-01-15T09:45:00Z",
      indexes: 6,
      primaryKey: "id",
      foreignKeys: 2,
      status: "healthy",
    },
    {
      name: "products",
      rows: 2341,
      size: "890 KB",
      lastModified: "2024-01-14T16:20:00Z",
      indexes: 3,
      primaryKey: "id",
      foreignKeys: 1,
      status: "warning",
    },
    {
      name: "order_items",
      rows: 23456,
      size: "3.2 MB",
      lastModified: "2024-01-15T11:15:00Z",
      indexes: 5,
      primaryKey: "id",
      foreignKeys: 2,
      status: "healthy",
    },
    {
      name: "categories",
      rows: 45,
      size: "12 KB",
      lastModified: "2024-01-10T14:30:00Z",
      indexes: 2,
      primaryKey: "id",
      foreignKeys: 0,
      status: "healthy",
    },
  ],
  schema: {
    users: {
      columns: [
        { name: "id", type: "SERIAL", nullable: false, primaryKey: true },
        { name: "email", type: "VARCHAR(255)", nullable: false, unique: true },
        { name: "password_hash", type: "VARCHAR(255)", nullable: false },
        { name: "first_name", type: "VARCHAR(100)", nullable: true },
        { name: "last_name", type: "VARCHAR(100)", nullable: true },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
        { name: "updated_at", type: "TIMESTAMP", nullable: false },
      ],
      indexes: [
        { name: "idx_users_email", columns: ["email"], unique: true },
        { name: "idx_users_created_at", columns: ["created_at"], unique: false },
      ],
      foreignKeys: [],
    },
    orders: {
      columns: [
        { name: "id", type: "SERIAL", nullable: false, primaryKey: true },
        { name: "user_id", type: "INTEGER", nullable: false },
        { name: "status", type: "VARCHAR(50)", nullable: false },
        { name: "total_amount", type: "DECIMAL(10,2)", nullable: false },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
        { name: "updated_at", type: "TIMESTAMP", nullable: false },
      ],
      indexes: [
        { name: "idx_orders_user_id", columns: ["user_id"], unique: false },
        { name: "idx_orders_status", columns: ["status"], unique: false },
        { name: "idx_orders_created_at", columns: ["created_at"], unique: false },
      ],
      foreignKeys: [{ name: "fk_orders_user_id", column: "user_id", referencedTable: "users", referencedColumn: "id" }],
    },
  },
  performance: {
    slowQueries: [
      {
        query: "SELECT * FROM orders o JOIN users u ON o.user_id = u.id WHERE o.created_at > '2024-01-01'",
        avgTime: 2340,
        executions: 45,
        lastSeen: "2024-01-15T11:30:00Z",
        impact: "high",
      },
      {
        query: "SELECT COUNT(*) FROM products WHERE category_id IN (SELECT id FROM categories WHERE active = true)",
        avgTime: 890,
        executions: 123,
        lastSeen: "2024-01-15T10:15:00Z",
        impact: "medium",
      },
      {
        query: "UPDATE users SET last_login = NOW() WHERE id = ?",
        avgTime: 450,
        executions: 234,
        lastSeen: "2024-01-15T11:45:00Z",
        impact: "low",
      },
    ],
    metrics: [
      { time: "00:00", qps: 1100, responseTime: 42 },
      { time: "04:00", qps: 890, responseTime: 38 },
      { time: "08:00", qps: 1450, responseTime: 52 },
      { time: "12:00", qps: 1250, responseTime: 45 },
      { time: "16:00", qps: 1380, responseTime: 48 },
      { time: "20:00", qps: 1150, responseTime: 41 },
    ],
  },
  insights: [
    {
      type: "warning",
      title: "Missing Index Detected",
      description: "Table 'products' could benefit from an index on 'category_id' column",
      impact: "Medium",
      recommendation: "CREATE INDEX idx_products_category_id ON products(category_id);",
    },
    {
      type: "info",
      title: "Query Optimization Opportunity",
      description: "Slow query detected in orders table join operation",
      impact: "High",
      recommendation: "Consider adding composite index on (user_id, created_at)",
    },
    {
      type: "success",
      title: "Good Performance",
      description: "Database response times are within acceptable limits",
      impact: "Low",
      recommendation: "Continue monitoring current performance metrics",
    },
  ],
}

export function DatabaseContent() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      case "warning":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "error":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database</h1>
          <p className="text-muted-foreground">Monitor and analyze your database performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(mockDatabaseData.overview.status)}>
                {getStatusIcon(mockDatabaseData.overview.status)}
                <span className="ml-1 capitalize">{mockDatabaseData.overview.status}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockDatabaseData.overview.type} {mockDatabaseData.overview.version}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDatabaseData.overview.connections.active}</div>
            <Progress value={mockDatabaseData.overview.connections.usage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {mockDatabaseData.overview.connections.active} of {mockDatabaseData.overview.connections.max} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDatabaseData.overview.storage.used} GB</div>
            <Progress value={mockDatabaseData.overview.storage.usage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {mockDatabaseData.overview.storage.used} GB of {mockDatabaseData.overview.storage.total} GB used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDatabaseData.overview.performance.qps}</div>
            <p className="text-xs text-muted-foreground">
              QPS • {mockDatabaseData.overview.performance.avgResponseTime}ms avg
            </p>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                {mockDatabaseData.overview.performance.slowQueries} slow queries
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Overview of all tables in your database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Indexes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDatabaseData.tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <TableIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{table.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{table.rows.toLocaleString()}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>{table.indexes}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(table.status)}>
                          {getStatusIcon(table.status)}
                          <span className="ml-1 capitalize">{table.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(table.lastModified).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTable(table.name)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Table: {table.name}</DialogTitle>
                              <DialogDescription>Detailed information about the {table.name} table</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Table Statistics</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Rows:</span>
                                      <span>{table.rows.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Size:</span>
                                      <span>{table.size}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Indexes:</span>
                                      <span>{table.indexes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Foreign Keys:</span>
                                      <span>{table.foreignKeys}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Schema Info</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Primary Key:</span>
                                      <span className="font-mono">{table.primaryKey}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Status:</span>
                                      <Badge className={getStatusColor(table.status)}>{table.status}</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <div className="grid gap-6">
            {Object.entries(mockDatabaseData.schema).map(([tableName, schema]) => (
              <Card key={tableName}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TableIcon className="h-5 w-5" />
                    <span>{tableName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TableIcon className="h-4 w-4 mr-2" />
                        Columns
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Key</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schema.columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell className="font-mono">{column.name}</TableCell>
                              <TableCell className="font-mono text-sm">{column.type}</TableCell>
                              <TableCell>
                                {column.nullable ? (
                                  <Badge variant="outline">Nullable</Badge>
                                ) : (
                                  <Badge variant="secondary">Not Null</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {column.primaryKey && (
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    <Key className="h-3 w-3 mr-1" />
                                    PK
                                  </Badge>
                                )}
                                {column.unique && !column.primaryKey && <Badge variant="outline">Unique</Badge>}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {schema.indexes.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Indexes</h4>
                        <div className="space-y-2">
                          {schema.indexes.map((index) => (
                            <div key={index.name} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm">{index.name}</span>
                                {index.unique && (
                                  <Badge variant="outline" className="text-xs">
                                    Unique
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">({index.columns.join(", ")})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {schema.foreignKeys.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Link className="h-4 w-4 mr-2" />
                          Foreign Keys
                        </h4>
                        <div className="space-y-2">
                          {schema.foreignKeys.map((fk) => (
                            <div key={fk.name} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="font-mono text-sm">{fk.column}</span>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>→</span>
                                <span className="font-mono">
                                  {fk.referencedTable}.{fk.referencedColumn}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Slow Queries</CardTitle>
                <CardDescription>Queries that may need optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDatabaseData.performance.slowQueries.map((query, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getImpactColor(query.impact)}>{query.impact.toUpperCase()} IMPACT</Badge>
                        <div className="text-sm text-muted-foreground">
                          Avg: {query.avgTime}ms • Executions: {query.executions}
                        </div>
                      </div>
                      <ScrollArea className="h-20 w-full">
                        <code className="text-sm bg-muted p-2 rounded block">{query.query}</code>
                      </ScrollArea>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>Last seen: {new Date(query.lastSeen).toLocaleString()}</span>
                        <Button variant="outline" size="sm">
                          Analyze
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {mockDatabaseData.insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {insight.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {insight.type === "info" && <Activity className="h-5 w-5 text-blue-500" />}
                      {insight.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge className={getImpactColor(insight.impact)}>{insight.impact.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.recommendation && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Recommendation:</p>
                          <code className="text-xs">{insight.recommendation}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
