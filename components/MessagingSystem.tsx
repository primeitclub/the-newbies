"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "image" | "file"
  propertyId?: string
}

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    userType: "student" | "landlord"
    online: boolean
  }[]
  lastMessage?: Message
  unreadCount: number
  propertyTitle?: string
}

export function MessagingSystem() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    // Mock conversations - in real app, fetch from API
    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        participants: [
          {
            id: "landlord-1",
            name: "Ram Sharma",
            userType: "landlord",
            online: true,
          },
          {
            id: user!.$id,
            name: user!.name,
            userType: user!.userType as "student" | "landlord",
            online: true,
          },
        ],
        lastMessage: {
          id: "msg-1",
          senderId: "landlord-1",
          receiverId: user!.$id,
          content: "The room is available from next week. Would you like to visit?",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          type: "text",
        },
        unreadCount: 2,
        propertyTitle: "Modern Room in Baneshwor",
      },
      {
        id: "conv-2",
        participants: [
          {
            id: "student-1",
            name: "Sita Poudel",
            userType: "student",
            online: false,
          },
          {
            id: user!.$id,
            name: user!.name,
            userType: user!.userType as "student" | "landlord",
            online: true,
          },
        ],
        lastMessage: {
          id: "msg-2",
          senderId: user!.$id,
          receiverId: "student-1",
          content: "Sure, you can visit tomorrow at 2 PM.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          type: "text",
        },
        unreadCount: 0,
        propertyTitle: "Cozy Student Room in Koteshwor",
      },
    ]

    setConversations(mockConversations)
    if (mockConversations.length > 0) {
      setActiveConversation(mockConversations[0].id)
    }
  }

  const loadMessages = async (conversationId: string) => {
    // Mock messages - in real app, fetch from API
    const mockMessages: Message[] = [
      {
        id: "msg-1",
        senderId: "landlord-1",
        receiverId: user!.$id,
        content: "Hello! I saw your interest in my property. Are you still looking for accommodation?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        type: "text",
      },
      {
        id: "msg-2",
        senderId: user!.$id,
        receiverId: "landlord-1",
        content: "Yes, I'm very interested. Can you tell me more about the facilities?",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        read: true,
        type: "text",
      },
      {
        id: "msg-3",
        senderId: "landlord-1",
        receiverId: user!.$id,
        content: "Of course! The room has WiFi, attached bathroom, and a study table. It's very close to colleges.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        type: "text",
      },
      {
        id: "msg-4",
        senderId: "landlord-1",
        receiverId: user!.$id,
        content: "The room is available from next week. Would you like to visit?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        type: "text",
      },
    ]

    setMessages(mockMessages)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user!.$id,
      receiverId: getOtherParticipant()?.id || "",
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Update conversation's last message
    setConversations((prev) =>
      prev.map((conv) => (conv.id === activeConversation ? { ...conv, lastMessage: message } : conv)),
    )
  }

  const getOtherParticipant = () => {
    const conversation = conversations.find((c) => c.id === activeConversation)
    return conversation?.participants.find((p) => p.id !== user!.$id)
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!user) return null

  return (
    <div className="flex h-[600px] bg-white rounded-lg border overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.id !== user.$id)
              return (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversation === conversation.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{otherParticipant?.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {otherParticipant?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{otherParticipant?.name}</h4>
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {conversation.propertyTitle && (
                        <p className="text-xs text-blue-600 truncate">{conversation.propertyTitle}</p>
                      )}
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getOtherParticipant()?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{getOtherParticipant()?.name}</h4>
                  <p className="text-sm text-gray-600">{getOtherParticipant()?.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.$id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.$id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${message.senderId === user.$id ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="resize-none"
                    rows={1}
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
