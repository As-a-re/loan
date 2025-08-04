"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { User, Star, TrendingUp, TrendingDown, DollarSign, Edit } from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  rating: number
  total_loans_given: number
  total_loans_received: number
  total_amount_lent: number
  total_amount_borrowed: number
  member_since: string
}

interface Transaction {
  id: string
  type: "loan_given" | "loan_received" | "contribution"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "overdue"
}

export function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
    fetchTransactions()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Mock data for demonstration
      const mockProfile: UserProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || "John Doe",
        email: user.email || "",
        phone: user.user_metadata?.phone || "+233 24 123 4567",
        rating: 4.7,
        total_loans_given: 5,
        total_loans_received: 2,
        total_amount_lent: 3500,
        total_amount_borrowed: 1200,
        member_since: "2023-06-15",
      }

      setProfile(mockProfile)
      setEditForm({
        full_name: mockProfile.full_name,
        phone: mockProfile.phone,
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      // Mock data for demonstration
      setTransactions([
        {
          id: "1",
          type: "loan_given",
          amount: 500,
          description: "Loan to Grace Osei for school fees",
          date: "2024-01-15",
          status: "pending",
        },
        {
          id: "2",
          type: "contribution",
          amount: 50,
          description: "Weekly contribution to Family Savings Group",
          date: "2024-01-14",
          status: "completed",
        },
        {
          id: "3",
          type: "loan_received",
          amount: 800,
          description: "Business expansion loan from Michael Asante",
          date: "2024-01-10",
          status: "completed",
        },
        {
          id: "4",
          type: "loan_given",
          amount: 300,
          description: "Emergency loan to James Mensah",
          date: "2024-01-08",
          status: "completed",
        },
      ])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here you would update the profile in Supabase
      console.log("Updating profile:", editForm)

      if (profile) {
        setProfile({
          ...profile,
          full_name: editForm.full_name,
          phone: editForm.phone,
        })
      }

      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "loan_given":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "loan_received":
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      case "contribution":
        return <DollarSign className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your activity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-gray-600">{profile.phone}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">{renderStars(profile.rating)}</div>
                    <p className="text-sm text-gray-600">Rating: {profile.rating}/5</p>
                  </div>

                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-medium">{new Date(profile.member_since).toLocaleDateString()}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profile.total_loans_given}</p>
                  <p className="text-sm text-gray-600">Loans Given</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingDown className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profile.total_loans_received}</p>
                  <p className="text-sm text-gray-600">Loans Received</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₵{profile.total_amount_lent}</p>
                  <p className="text-sm text-gray-600">Amount Lent</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₵{profile.total_amount_borrowed}</p>
                  <p className="text-sm text-gray-600">Amount Borrowed</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₵{transaction.amount.toFixed(2)}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
