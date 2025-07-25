"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Database,
  Server,
  HardDrive,
  Network,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Save,
} from "lucide-react"

interface AWSService {
  id: string
  name: string
  service: string
  region: string
  [key: string]: any
}

interface ServiceConfigTabProps {
  service: AWSService
}

export function ServiceConfigTab({ service }: ServiceConfigTabProps) {
  const renderServiceConfig = () => {
    switch (service.service) {
      case "Amazon RDS":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Configuration
                </CardTitle>
                <CardDescription>Core database settings and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="db-instance-class">Instance Class</Label>
                    <Input id="db-instance-class" value="db.t3.medium" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="db-engine">Engine Version</Label>
                    <Input id="db-engine" value="PostgreSQL 14.9" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="db-storage">Allocated Storage</Label>
                    <Input id="db-storage" value="100 GB" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="db-iops">Provisioned IOPS</Label>
                    <Input id="db-iops" value="3000" readOnly />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Multi-AZ Deployment</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Enable high availability</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automated Backups</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Daily automated backups</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Performance Insights</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Enhanced monitoring</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Database security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encryption at Rest</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">AES-256 encryption</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SSL/TLS Encryption</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">In-transit encryption</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>VPC Security Groups</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Network access control</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "AWS Lambda":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Function Configuration
                </CardTitle>
                <CardDescription>Runtime and execution settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="runtime">Runtime</Label>
                    <Input id="runtime" value="Node.js 18.x" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="memory">Memory</Label>
                    <Input id="memory" value="512 MB" />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout</Label>
                    <Input id="timeout" value="30 seconds" />
                  </div>
                  <div>
                    <Label htmlFor="concurrent">Concurrent Executions</Label>
                    <Input id="concurrent" value="100" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dead Letter Queue</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Handle failed invocations</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>X-Ray Tracing</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Distributed tracing</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Configuration
                </CardTitle>
                <CardDescription>VPC and networking settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>VPC Configuration</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">vpc-12345678</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Groups</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">sg-abcdef123</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "Amazon S3":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Bucket Configuration
                </CardTitle>
                <CardDescription>Storage settings and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bucket-name">Bucket Name</Label>
                    <Input id="bucket-name" value={service.name} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="storage-class">Default Storage Class</Label>
                    <Input id="storage-class" value="Standard" readOnly />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Versioning</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Keep multiple versions of objects</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Server Access Logging</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Log bucket access requests</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Transfer Acceleration</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Faster uploads via CloudFront</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Lifecycle Management
                </CardTitle>
                <CardDescription>Automated object lifecycle policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Transition to IA</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">After 30 days</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Transition to Glacier</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">After 90 days</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Delete Objects</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">After 365 days</p>
                    </div>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "EC2 Instance":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Instance Configuration
                </CardTitle>
                <CardDescription>Compute and system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instance-type">Instance Type</Label>
                    <Input id="instance-type" value="t3.large" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="ami">AMI ID</Label>
                    <Input id="ami" value="ami-0abcdef1234567890" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="key-pair">Key Pair</Label>
                    <Input id="key-pair" value="my-key-pair" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="subnet">Subnet</Label>
                    <Input id="subnet" value="subnet-12345678" readOnly />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Detailed Monitoring</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">CloudWatch detailed monitoring</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Termination Protection</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Prevent accidental termination</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Groups
                </CardTitle>
                <CardDescription>Network access control rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SSH Access (Port 22)</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">0.0.0.0/0</p>
                    </div>
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Open
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>HTTP Access (Port 80)</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">0.0.0.0/0</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>HTTPS Access (Port 443)</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">0.0.0.0/0</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-600 dark:text-slate-300">
                Configuration options for this service will be displayed here.
              </p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Configuration</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage settings and parameters for {service.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Configuration
          </Button>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Service Configuration */}
      {renderServiceConfig()}
    </div>
  )
}
