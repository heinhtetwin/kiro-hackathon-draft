"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Github,
  Lock,
  Globe,
  Calendar,
  Code,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
} from "lucide-react"

interface Repository {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  isPrivate: boolean
  lastUpdated: string
  stars: number
  forks: number
  owner: {
    login: string
    avatar: string
  }
}

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: (project: any) => void
}

// Mock GitHub repositories
const mockRepositories: Repository[] = [
  {
    id: "1",
    name: "e-commerce-api",
    fullName: "alexchen/e-commerce-api",
    description: "RESTful API for e-commerce platform with Node.js and PostgreSQL",
    language: "TypeScript",
    isPrivate: false,
    lastUpdated: "2024-01-15T10:30:00Z",
    stars: 42,
    forks: 8,
    owner: {
      login: "alexchen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "2",
    name: "react-dashboard",
    fullName: "alexchen/react-dashboard",
    description: "Modern React dashboard with TypeScript and Tailwind CSS",
    language: "TypeScript",
    isPrivate: true,
    lastUpdated: "2024-01-14T15:45:00Z",
    stars: 23,
    forks: 3,
    owner: {
      login: "alexchen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "3",
    name: "microservices-auth",
    fullName: "alexchen/microservices-auth",
    description: "Authentication microservice with JWT and Redis",
    language: "Go",
    isPrivate: true,
    lastUpdated: "2024-01-13T09:20:00Z",
    stars: 15,
    forks: 2,
    owner: {
      login: "alexchen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "4",
    name: "ml-pipeline",
    fullName: "alexchen/ml-pipeline",
    description: "Machine learning pipeline with Python and AWS SageMaker",
    language: "Python",
    isPrivate: false,
    lastUpdated: "2024-01-12T14:10:00Z",
    stars: 67,
    forks: 12,
    owner: {
      login: "alexchen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "5",
    name: "mobile-app",
    fullName: "alexchen/mobile-app",
    description: "React Native mobile application with offline support",
    language: "JavaScript",
    isPrivate: true,
    lastUpdated: "2024-01-11T11:30:00Z",
    stars: 8,
    forks: 1,
    owner: {
      login: "alexchen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
]

const importSteps = [
  { id: "importing", label: "Importing repository...", description: "Cloning repository and analyzing structure" },
  { id: "dependencies", label: "Analyzing dependencies...", description: "Scanning package files and dependency tree" },
  { id: "aws", label: "Detecting AWS services...", description: "Identifying cloud services and configurations" },
  { id: "setup", label: "Setting up project...", description: "Creating project workspace and permissions" },
]

export function CreateProjectModal({ open, onOpenChange, onProjectCreated }: CreateProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [importError, setImportError] = useState<string | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(45)
  const { toast } = useToast()

  const filteredRepos = mockRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.language.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Go: "bg-cyan-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
    }
    return colors[language] || "bg-gray-500"
  }

  const handleImport = async () => {
    if (!selectedRepo) return

    setIsImporting(true)
    setImportProgress(0)
    setCurrentStep(0)
    setCompletedSteps([])
    setImportError(null)
    setEstimatedTime(45)

    try {
      // Simulate import process
      for (let i = 0; i < importSteps.length; i++) {
        setCurrentStep(i)

        // Simulate step processing time
        const stepDuration = 2000 + Math.random() * 3000 // 2-5 seconds per step
        const stepProgress = (i / importSteps.length) * 100

        for (let progress = stepProgress; progress < ((i + 1) / importSteps.length) * 100; progress += 2) {
          setImportProgress(progress)
          setEstimatedTime(Math.max(5, estimatedTime - 2))
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setCompletedSteps((prev) => [...prev, importSteps[i].id])

        // Simulate potential error (5% chance)
        if (Math.random() < 0.05 && i === 1) {
          throw new Error("Failed to analyze dependencies. Some package files may be corrupted.")
        }
      }

      setImportProgress(100)

      // Wait a moment before success
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create mock project data
      const newProject = {
        id: Date.now().toString(),
        name: selectedRepo.name,
        repository: {
          name: selectedRepo.fullName,
          url: `https://github.com/${selectedRepo.fullName}`,
        },
        team: [{ id: "1", name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", role: "Owner" }],
        stats: {
          vulnerabilities: Math.floor(Math.random() * 5),
          awsServices: ["RDS", "Lambda", "S3", "CloudWatch"].slice(0, Math.floor(Math.random() * 4) + 1),
          unreadMessages: 0,
          notifications: 1,
        },
      }

      onProjectCreated(newProject)
      onOpenChange(false)

      toast({
        title: "Project created successfully!",
        description: `${selectedRepo.name} has been imported and is ready to use.`,
      })
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "An unexpected error occurred")
    }
  }

  const handleRetry = () => {
    setImportError(null)
    handleImport()
  }

  const handleCancel = () => {
    setIsImporting(false)
    setImportProgress(0)
    setCurrentStep(0)
    setCompletedSteps([])
    setImportError(null)
    setSelectedRepo(null)
    setSearchQuery("")
  }

  const resetModal = () => {
    handleCancel()
    onOpenChange(false)
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        handleCancel()
      }, 300) // Wait for modal close animation
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        {!isImporting && !importError ? (
          // Repository Selection
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Create New Project
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Repository List */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        selectedRepo?.id === repo.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                      onClick={() => setSelectedRepo(repo)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={repo.owner.avatar || "/placeholder.svg"} alt={repo.owner.login} />
                              <AvatarFallback className="text-xs">
                                {repo.owner.login.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900 dark:text-white truncate">{repo.fullName}</span>
                            {repo.isPrivate ? (
                              <Lock className="h-3 w-3 text-slate-500" />
                            ) : (
                              <Globe className="h-3 w-3 text-slate-500" />
                            )}
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            {repo.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                              {repo.language}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(repo.lastUpdated)}
                            </div>
                            <div className="flex items-center gap-3">
                              <span>⭐ {repo.stars}</span>
                              <span>🍴 {repo.forks}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredRepos.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No repositories found</p>
                      <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={resetModal}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!selectedRepo} className="min-w-[140px]">
                  <Code className="h-4 w-4 mr-2" />
                  Import Repository
                </Button>
              </div>
            </div>
          </>
        ) : importError ? (
          // Error State
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Import Failed
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Unable to import repository
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{importError}</p>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Common solutions:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Verify repository permissions</li>
                    <li>• Ensure package.json files are valid</li>
                    <li>• Try again in a few minutes</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetModal}>
                    Cancel
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@devforage.com" className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Contact Support
                    </a>
                  </Button>
                </div>
                <Button onClick={handleRetry} className="min-w-[100px]">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Import Progress
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Importing {selectedRepo?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                  <span className="text-slate-900 dark:text-white font-medium">{Math.round(importProgress)}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {importSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id)
                  const isCurrent = currentStep === index
                  const isPending = index > currentStep

                  return (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : isCurrent ? (
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            isCompleted
                              ? "text-green-700 dark:text-green-400"
                              : isCurrent
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Time Estimate */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Estimated time remaining</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">~{estimatedTime} seconds</span>
                </div>
              </div>

              {/* Cancel Option */}
              <div className="flex justify-center pt-4 border-t">
                <Button variant="outline" onClick={resetModal}>
                  Cancel Import
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
