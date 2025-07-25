"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Send,
  Smile,
  Paperclip,
  Hash,
  Users,
  Search,
  MoreHorizontal,
  Reply,
  ThumbsUp,
  Phone,
  Video,
  Settings,
} from "lucide-react"

// Mock data
const mockChannels = [
  { id: 1, name: "general", description: "General team discussions", unread: 3, type: "public" },
  { id: 2, name: "development", description: "Development discussions", unread: 0, type: "public" },
  { id: 3, name: "design", description: "Design reviews and feedback", unread: 1, type: "public" },
  { id: 4, name: "random", description: "Random conversations", unread: 0, type: "public" },
]

const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    role: "Admin",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "away",
    role: "Developer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    role: "Developer",
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "offline",
    role: "Designer",
  },
]

const mockMessages = [
  {
    id: 1,
    user: "Sarah Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    message:
      "Hey team! Just pushed the latest changes to the main branch. The new authentication flow is ready for testing.",
    timestamp: "10:30 AM",
    reactions: [
      { emoji: "👍", count: 2, users: ["Alex Chen", "Mike Johnson"] },
      { emoji: "🚀", count: 1, users: ["Emma Davis"] },
    ],
  },
  {
    id: 2,
    user: "Alex Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Great work @Sarah Wilson! I'll review the PR this afternoon. The login flow looks much cleaner now.",
    timestamp: "10:35 AM",
    mentions: ["Sarah Wilson"],
    reactions: [{ emoji: "❤️", count: 1, users: ["Sarah Wilson"] }],
  },
  {
    id: 3,
    user: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "I'm getting a 404 error on the staging environment. Anyone else experiencing this?",
    timestamp: "11:15 AM",
    reactions: [],
  },
  {
    id: 4,
    user: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    message:
      "I can help debug that! Let me check the deployment logs. Also, here's the updated design mockup for the dashboard:",
    timestamp: "11:18 AM",
    hasFile: true,
    fileName: "dashboard-mockup-v2.figma",
    reactions: [{ emoji: "🙏", count: 1, users: ["Mike Johnson"] }],
  },
  {
    id: 5,
    user: "Sarah Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    message:
      "The staging deployment failed because of a missing environment variable. I've added it and triggered a new deployment.",
    timestamp: "11:45 AM",
    reactions: [
      { emoji: "✅", count: 2, users: ["Alex Chen", "Mike Johnson"] },
      { emoji: "🎉", count: 1, users: ["Emma Davis"] },
    ],
  },
]

export function TeamChatContent() {
  const [selectedChannel, setSelectedChannel] = useState(1)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mockMessages])

  // Simulate typing indicator
  useEffect(() => {
    if (message.length > 0 && !isTyping) {
      setIsTyping(true)
      // Simulate other users typing
      const timer = setTimeout(() => {
        setTypingUsers(["Mike Johnson"])
        setTimeout(() => setTypingUsers([]), 3000)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (message.length === 0) {
      setIsTyping(false)
    }
  }, [message, isTyping])

  const handleSendMessage = () => {
    if (!message.trim()) return

    toast({
      title: "Message sent",
      description: "Your message has been sent to the channel",
    })

    setMessage("")
    setIsTyping(false)
    setTypingUsers([])
  }

  const handleReaction = (messageId: number, emoji: string) => {
    toast({
      title: "Reaction added",
      description: `Added ${emoji} reaction to message`,
    })
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
      case "away":
        return <div className="h-3 w-3 bg-yellow-500 rounded-full border-2 border-white dark:border-slate-800" />
      case "offline":
        return <div className="h-3 w-3 bg-slate-400 rounded-full border-2 border-white dark:border-slate-800" />
      default:
        return null
    }
  }

  const selectedChannelData = mockChannels.find((c) => c.id === selectedChannel)

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-slate-50 dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Chat</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search messages..." className="pl-10" />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Channels Section */}
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Channels
                </h3>
                <div className="space-y-1">
                  {mockChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedChannel === channel.id
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {channel.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Members Section */}
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members ({mockTeamMembers.filter((m) => m.status === "online").length} online)
                </h3>
                <div className="space-y-2">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">{getStatusIndicator(member.status)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{member.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-slate-500" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">#{selectedChannelData?.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedChannelData?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{mockTeamMembers.length} members</Badge>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                      <AvatarFallback>
                        {msg.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">{msg.user}</span>
                        <span className="text-xs text-slate-500">{msg.timestamp}</span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 mb-2">
                        {msg.mentions && <span className="text-blue-600 dark:text-blue-400">@{msg.mentions[0]} </span>}
                        {msg.message}
                      </div>
                      {msg.hasFile && (
                        <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg mb-2 w-fit">
                          <Paperclip className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{msg.fileName}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {msg.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => handleReaction(msg.id, reaction.emoji)}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-slate-600 dark:text-slate-400">{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleReaction(msg.id, "👍")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${selectedChannelData?.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
