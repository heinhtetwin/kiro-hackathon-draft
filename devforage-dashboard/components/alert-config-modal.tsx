"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, Trash2, Edit, Mail, MessageSquare } from "lucide-react"

interface AWSService {
  id: string
  name: string
  service: string
  alerts: number
  [key: string]: any
}

interface AlertConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: AWSService[]
}

interface Alert {
  id: string
  name: string
  service: string
  metric: string
  condition: string
  threshold: number
  enabled: boolean
  notifications: string[]
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    name: "High CPU Usage",
    service: "production-db",
    metric: "CPU Utilization",
    condition: "greater than",
    threshold: 80,
    enabled: true,
    notifications: ["email", "slack"],
  },
  {
    id: "2",
    name: "Lambda Error Rate",
    service: "api-handler",
    metric: "Error Rate",
    condition: "greater than",
    threshold: 5,
    enabled: true,
    notifications: ["email"],
  },
  {
    id: "3",
    name: "S3 Storage Cost",
    service: "app-assets-bucket",
    metric: "Monthly Cost",
    condition: "greater than",
    threshold: 50,
    enabled: false,
    notifications: ["email"],
  },
]

export function AlertConfigModal({ open, onOpenChange, services }: AlertConfigModalProps) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [activeTab, setActiveTab] = useState("alerts")
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)

  const totalAlerts = alerts.length
  const activeAlerts = alerts.filter((alert) => alert.enabled).length

  const handleToggleAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Configuration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="create">Create Alert</TabsTrigger>
            <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="alerts" className="h-full overflow-auto space-y-4">
              {/* Alert Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalAlerts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activeAlerts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Disabled</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-600">{totalAlerts - activeAlerts}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Alert List */}
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{alert.name}</h4>
                            <Badge variant={alert.enabled ? "default" : "secondary"}>
                              {alert.enabled ? "Active" : "Disabled"}
                            </Badge>
                            <Badge variant="outline">{alert.service}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {alert.metric} {alert.condition} {alert.threshold}
                            {alert.metric.includes("Cost") ? "" : "%"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {alert.notifications.map((notification) => (
                              <Badge key={notification} variant="outline" className="text-xs">
                                {notification === "email" ? (
                                  <Mail className="w-3 h-3 mr-1" />
                                ) : (
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                )}
                                {notification}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={alert.enabled} onCheckedChange={() => handleToggleAlert(alert.id)} />
                          <Button variant="ghost" size="sm" onClick={() => setEditingAlert(alert)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="h-full overflow-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Alert</CardTitle>
                  <CardDescription>Set up monitoring alerts for your AWS services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alert-name">Alert Name</Label>
                      <Input id="alert-name" placeholder="Enter alert name" />
                    </div>
                    <div>
                      <Label htmlFor="service-select">Service</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} ({service.service})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="metric-select">Metric</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpu">CPU Utilization</SelectItem>
                          <SelectItem value="memory">Memory Usage</SelectItem>
                          <SelectItem value="disk">Disk Usage</SelectItem>
                          <SelectItem value="network">Network I/O</SelectItem>
                          <SelectItem value="cost">Monthly Cost</SelectItem>
                          <SelectItem value="errors">Error Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition-select">Condition</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater">Greater than</SelectItem>
                          <SelectItem value="less">Less than</SelectItem>
                          <SelectItem value="equal">Equal to</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="threshold">Threshold</Label>
                      <Input id="threshold" type="number" placeholder="Enter threshold value" />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input id="duration" type="number" placeholder="5" />
                    </div>
                  </div>

                  <div>
                    <Label>Notification Methods</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="email-notifications" />
                        <Label htmlFor="email-notifications">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="slack-notifications" />
                        <Label htmlFor="slack-notifications">Slack</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="sms-notifications" />
                        <Label htmlFor="sms-notifications">SMS</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="h-full overflow-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and where you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="email-address">Email Address</Label>
                        <Input id="email-address" type="email" placeholder="your-email@example.com" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="email-enabled" defaultChecked />
                        <Label htmlFor="email-enabled">Enable email notifications</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Slack Integration</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="slack-webhook">Webhook URL</Label>
                        <Input id="slack-webhook" placeholder="https://hooks.slack.com/..." />
                      </div>
                      <div>
                        <Label htmlFor="slack-channel">Channel</Label>
                        <Input id="slack-channel" placeholder="#alerts" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="slack-enabled" />
                        <Label htmlFor="slack-enabled">Enable Slack notifications</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">SMS Notifications</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input id="phone-number" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="sms-enabled" />
                        <Label htmlFor="sms-enabled">Enable SMS notifications</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
