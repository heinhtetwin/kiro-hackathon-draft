"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Code2, Users, Shield, MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleGitHubSignIn = () => {
    setIsSigningIn(true)
    // Simulate OAuth flow
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">DevForage</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Your Developer Platform
            <span className="block text-blue-600 dark:text-blue-400">Simplified</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            Manage your projects, dependencies, AWS services, and team collaboration all in one place. Built for
            developers, by developers.
          </p>

          {/* Sign In Card */}
          <Card className="max-w-md mx-auto mb-16 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>Sign in with your GitHub account to access your developer dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGitHubSignIn}
                disabled={isSigningIn}
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Github className="mr-2 h-5 w-5" />
                {isSigningIn ? "Signing in..." : "Sign in with GitHub"}
              </Button>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-left">
              <CardHeader>
                <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <CardTitle className="text-lg">Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Organize and track your development projects with ease
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                <CardTitle className="text-lg">AWS Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Seamlessly manage your AWS services and deployments
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Chat and collaborate with your team members in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                <CardTitle className="text-lg">Smart Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Stay updated with intelligent notifications and inbox management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
