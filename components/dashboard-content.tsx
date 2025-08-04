"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { PiggyBank, Users, TrendingUp, DollarSign, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalSavings: number
  activeGroups: number
  loansGiven: number
  loansReceived: number
}

interface RecentActivity {
  id: string
  type: "contribution" | "loan_offer" | "loan_request" | "payment"
  description: string
  amount: number
  date: string
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSavings: 0,
    activeGroups: 0,
    loansGiven: 0,
    loansReceived: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user stats (mock data for now)
      setStats({
        totalSavings: 2450.0,
        activeGroups: 3,
        loansGiven: 2,
        loansReceived: 1,
      })

      // Fetch recent activity (mock data for now)
      setRecentActivity([
        {
          id: "1",
          type: "contribution",
          description: "Weekly contribution to Family Savings Group",
          amount: 50.0,
          date: "2024-01-15",
        },
        {
          id: "2",
          type: "loan_offer",
          description: "New loan offer posted",
          amount: 500.0,
          date: "2024-01-14",
        },
        {
          id: "3",
          type: "payment",
          description: "Loan repayment received from John Doe",
          amount: 125.0,
          date: "2024-01-13",
        },
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contribution":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "loan_offer":
        return <DollarSign className="h-4 w-4 text-blue-600" />
      case "loan_request":
        return <ArrowDownRight className="h-4 w-4 text-orange-600" />
      case "payment":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{stats.totalSavings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">Contributing regularly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loans Given</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loansGiven}</div>
              <p className="text-xs text-muted-foreground">Active lending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loans Received</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loansReceived}</div>
              <p className="text-xs text-muted-foreground">Currently borrowing</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/groups">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Join a Savings Group
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Loan Offer
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Request a Loan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                      <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm font-medium">₵{activity.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Save Before You Spend</h3>
              <p className="text-blue-800 text-sm">
                Try to save at least 10% of your income before spending on non-essential items. This habit will help you
                build a strong financial foundation over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
