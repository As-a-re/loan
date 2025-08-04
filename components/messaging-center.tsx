"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { MessageCircle, Send, User } from "lucide-react"

interface Message {
  id: string
  sender_name: string
  content: string
  timestamp: string
  is_own: boolean
}

interface Conversation {
  id: string
  participant_name: string
  last_message: string
  last_message_time: string
  unread_count: number
  loan_type: "offer" | "request"
  loan_amount: number
}

export function MessagingCenter() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      // Mock data for demonstration
      setConversations([
        {
          id: "1",
          participant_name: "Sarah Johnson",
          last_message: "I can offer you the loan at 8% interest rate.",
          last_message_time: "2024-01-15T10:30:00Z",
          unread_count: 2,
          loan_type: "offer",
          loan_amount: 1000,
        },
        {
          id: "2",
          participant_name: "Grace Osei",
          last_message: "Thank you for considering my loan request.",
          last_message_time: "2024-01-14T15:45:00Z",
          unread_count: 0,
          loan_type: "request",
          loan_amount: 800,
        },
        {
          id: "3",
          participant_name: "Michael Asante",
          last_message: "When would you need the funds?",
          last_message_time: "2024-01-13T09:20:00Z",
          unread_count: 1,
          loan_type: "offer",
          loan_amount: 500,
        },
      ])
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      // Mock data for demonstration
      const mockMessages: Record<string, Message[]> = {
        "1": [
          {
            id: "1",
            sender_name: "Sarah Johnson",
            content: "Hi! I saw your loan request and I might be able to help.",
            timestamp: "2024-01-15T09:00:00Z",
            is_own: false,
          },
          {
            id: "2",
            sender_name: "You",
            content: "That would be great! What are your terms?",
            timestamp: "2024-01-15T09:15:00Z",
            is_own: true,
          },
          {
            id: "3",
            sender_name: "Sarah Johnson",
            content: "I can offer you the loan at 8% interest rate.",
            timestamp: "2024-01-15T10:30:00Z",
            is_own: false,
          },
        ],
        "2": [
          {
            id: "1",
            sender_name: "You",
            content: "Hi Grace, I can help with your education loan request.",
            timestamp: "2024-01-14T14:00:00Z",
            is_own: true,
          },
          {
            id: "2",
            sender_name: "Grace Osei",
            content: "Thank you for considering my loan request.",
            timestamp: "2024-01-14T15:45:00Z",
            is_own: false,
          },
        ],
        "3": [
          {
            id: "1",
            sender_name: "Michael Asante",
            content: "When would you need the funds?",
            timestamp: "2024-01-13T09:20:00Z",
            is_own: false,
          },
        ],
      }

      setMessages(mockMessages[conversationId] || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message: Message = {
        id: Date.now().toString(),
        sender_name: "You",
        content: newMessage,
        timestamp: new Date().toISOString(),
        is_own: true,
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Here you would send the message to Supabase
      console.log("Sending message:", message)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
              <div className="bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with lenders and borrowers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{conversation.participant_name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={conversation.loan_type === "offer" ? "default" : "outline"}
                              className="text-xs"
                            >
                              {conversation.loan_type === "offer" ? "Lender" : "Borrower"}
                            </Badge>
                            <span className="text-xs text-gray-500">₵{conversation.loan_amount}</span>
                          </div>
                        </div>
                      </div>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conversation.last_message}</p>
                    <p className="text-xs text-gray-500">{formatDate(conversation.last_message_time)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">
                    {conversations.find((c) => c.id === selectedConversation)?.participant_name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.is_own ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.is_own ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
