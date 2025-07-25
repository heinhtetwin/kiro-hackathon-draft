"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Lock,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
  Copy,
  Shield,
  Clock,
  User,
  GitBranch,
  CheckCircle,
  Key,
  Database,
  Globe,
} from "lucide-react"

// Mock vault data
const mockSecrets = {
  development: [
    {
      id: 1,
      key: "DATABASE_URL",
      value: "postgresql://user:pass@localhost:5432/dev_db",
      description: "Development database connection string",
      lastUpdated: "2024-01-20",
      updatedBy: "Alex Chen",
      masked: true,
    },
    {
      id: 2,
      key: "API_KEY",
      value: "sk-1234567890abcdef",
      description: "Third-party API key for development",
      lastUpdated: "2024-01-18",
      updatedBy: "Sarah Wilson",
      masked: true,
    },
    {
      id: 3,
      key: "JWT_SECRET",
      value: "super-secret-jwt-key-dev",
      description: "JWT signing secret for authentication",
      lastUpdated: "2024-01-15",
      updatedBy: "Mike Johnson",
      masked: true,
    },
  ],
  staging: [
    {
      id: 4,
      key: "DATABASE_URL",
      value: "postgresql://user:pass@staging.db.com:5432/staging_db",
      description: "Staging database connection string",
      lastUpdated: "2024-01-19",
      updatedBy: "Alex Chen",
      masked: true,
    },
    {
      id: 5,
      key: "API_KEY",
      value: "sk-staging-abcdef123456",
      description: "Third-party API key for staging",
      lastUpdated: "2024-01-17",
      updatedBy: "Sarah Wilson",
      masked: true,
    },
  ],
  production: [
    {
      id: 6,
      key: "DATABASE_URL",
      value: "postgresql://user:pass@prod.db.com:5432/prod_db",
      description: "Production database connection string",
      lastUpdated: "2024-01-20",
      updatedBy: "Alex Chen",
      masked: true,
    },
    {
      id: 7,
      key: "API_KEY",
      value: "sk-prod-xyz789abc123",
      description: "Third-party API key for production",
      lastUpdated: "2024-01-16",
      updatedBy: "Alex Chen",
      masked: true,
    },
    {
      id: 8,
      key: "JWT_SECRET",
      value: "ultra-secure-jwt-key-production",
      description: "JWT signing secret for production authentication",
      lastUpdated: "2024-01-14",
      updatedBy: "Alex Chen",
      masked: true,
    },
  ],
}

const mockAccessHistory = [
  {
    id: 1,
    user: "Sarah Wilson",
    action: "Viewed DATABASE_URL",
    environment: "Production",
    timestamp: "2024-01-20 14:30:00",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    user: "Mike Johnson",
    action: "Updated API_KEY",
    environment: "Development",
    timestamp: "2024-01-20 12:15:00",
    ip: "192.168.1.101",
  },
  {
    id: 3,
    user: "Alex Chen",
    action: "Added JWT_SECRET",
    environment: "Production",
    timestamp: "2024-01-20 10:45:00",
    ip: "192.168.1.102",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "Downloaded .env file",
    environment: "Staging",
    timestamp: "2024-01-19 16:20:00",
    ip: "192.168.1.100",
  },
]

export function VaultContent() {
  const [selectedEnvironment, setSelectedEnvironment] = useState("development")
  const [isAddSecretModalOpen, setIsAddSecretModalOpen] = useState(false)
  const [newSecretKey, setNewSecretKey] = useState("")
  const [newSecretValue, setNewSecretValue] = useState("")
  const [newSecretDescription, setNewSecretDescription] = useState("")
  const [maskedSecrets, setMaskedSecrets] = useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()

  const toggleSecretVisibility = (secretId: number) => {
    setMaskedSecrets((prev) => ({
      ...prev,
      [secretId]: !prev[secretId],
    }))
  }

  const maskValue = (value: string, secretId: number) => {
    if (maskedSecrets[secretId]) {
      return value
    }
    return "•".repeat(Math.min(value.length, 20))
  }

  const handleAddSecret = () => {
    if (!newSecretKey || !newSecretValue) return

    toast({
      title: "Secret added successfully",
      description: `${newSecretKey} has been added to ${selectedEnvironment}`,
    })

    setNewSecretKey("")
    setNewSecretValue("")
    setNewSecretDescription("")
    setIsAddSecretModalOpen(false)
  }

  const handleCopySecret = (value: string, key: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied to clipboard",
      description: `${key} value copied successfully`,
    })
  }

  const handleDownloadEnv = (environment: string) => {
    toast({
      title: "Environment file downloaded",
      description: `.env.${environment} file has been downloaded`,
    })
  }

  const getEnvironmentIcon = (env: string) => {
    switch (env) {
      case "development":
        return <Database className="h-4 w-4 text-blue-500" />
      case "staging":
        return <GitBranch className="h-4 w-4 text-amber-500" />
      case "production":
        return <Globe className="h-4 w-4 text-red-500" />
      default:
        return <Key className="h-4 w-4" />
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "development":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
      case "staging":
        return "border-amber-200 bg-amber-50 dark:bg-amber-950/20"
      case "production":
        return "border-red-200 bg-red-50 dark:bg-red-950/20"
      default:
        return "border-slate-200 bg-slate-50 dark:bg-slate-950/20"
    }
  }

  const currentSecrets = mockSecrets[selectedEnvironment as keyof typeof mockSecrets] || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Secure Vault
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage environment variables and secrets securely</p>
        </div>
        <Dialog open={isAddSecretModalOpen} onOpenChange={setIsAddSecretModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Secret
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Secret</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Environment</label>
                <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <div className="flex items-center gap-2">
                    {getEnvironmentIcon(selectedEnvironment)}
                    <span className="font-medium capitalize">{selectedEnvironment}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Key</label>
                <Input
                  placeholder="e.g., DATABASE_URL"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Value</label>
                <Textarea
                  placeholder="Enter secret value"
                  value={newSecretValue}
                  onChange={(e) => setNewSecretValue(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <Input
                  placeholder="Brief description of this secret"
                  value={newSecretDescription}
                  onChange={(e) => setNewSecretDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddSecretModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSecret} disabled={!newSecretKey || !newSecretValue}>
                  Add Secret
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Environment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
            <Key className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(mockSecrets).reduce((acc, secrets) => acc + secrets.length, 0)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Across all environments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSecrets.development.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Dev secrets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staging</CardTitle>
            <GitBranch className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSecrets.staging.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Staging secrets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production</CardTitle>
            <Globe className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSecrets.production.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Prod secrets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environment Secrets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Environment Variables</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadEnv(selectedEnvironment)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download .env
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="development" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Development
                  </TabsTrigger>
                  <TabsTrigger value="staging" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Staging
                  </TabsTrigger>
                  <TabsTrigger value="production" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Production
                  </TabsTrigger>
                </TabsList>

                {["development", "staging", "production"].map((env) => (
                  <TabsContent key={env} value={env} className="mt-4">
                    <div className={`p-4 rounded-lg border-2 ${getEnvironmentColor(env)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getEnvironmentIcon(env)}
                          <h3 className="font-semibold capitalize">{env} Environment</h3>
                          <Badge variant="outline">
                            {mockSecrets[env as keyof typeof mockSecrets]?.length || 0} secrets
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">Synced</span>
                        </div>
                      </div>

                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {currentSecrets.map((secret) => (
                            <div key={secret.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                                      {secret.key}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono">
                                      {maskValue(secret.value, secret.id)}
                                    </code>
                                    <Button variant="ghost" size="sm" onClick={() => toggleSecretVisibility(secret.id)}>
                                      {maskedSecrets[secret.id] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopySecret(secret.value, secret.key)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {secret.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                      {secret.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {secret.lastUpdated}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {secret.updatedBy}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Access History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access History
            </CardTitle>
            <CardDescription>Recent vault access and modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockAccessHistory.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {event.action.includes("Viewed") ? (
                          <Eye className="h-4 w-4 text-blue-500" />
                        ) : event.action.includes("Updated") ? (
                          <Edit className="h-4 w-4 text-amber-500" />
                        ) : event.action.includes("Added") ? (
                          <Plus className="h-4 w-4 text-green-500" />
                        ) : (
                          <Download className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{event.user}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{event.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {event.environment}
                          </Badge>
                          <span className="text-xs text-slate-500">{event.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">IP: {event.ip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
