"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Users, Plus, DollarSign } from "lucide-react"

interface SavingsGroup {
  id: string
  name: string
  description: string
  target_amount: number
  current_amount: number
  member_count: number
  contribution_frequency: string
  contribution_amount: number
  created_at: string
  is_member: boolean
}

export function SavingsGroups() {
  const [groups, setGroups] = useState<SavingsGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    target_amount: "",
    contribution_frequency: "weekly",
    contribution_amount: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      // Mock data for demonstration
      setGroups([
        {
          id: "1",
          name: "Family Savings Circle",
          description: "Saving for family emergencies and celebrations",
          target_amount: 5000,
          current_amount: 2450,
          member_count: 8,
          contribution_frequency: "weekly",
          contribution_amount: 50,
          created_at: "2024-01-01",
          is_member: true,
        },
        {
          id: "2",
          name: "Business Growth Fund",
          description: "Supporting small business expansion in our community",
          target_amount: 10000,
          current_amount: 3200,
          member_count: 12,
          contribution_frequency: "monthly",
          contribution_amount: 200,
          created_at: "2024-01-05",
          is_member: true,
        },
        {
          id: "3",
          name: "Education Support Group",
          description: "Helping members pay for education expenses",
          target_amount: 8000,
          current_amount: 1800,
          member_count: 15,
          contribution_frequency: "bi-weekly",
          contribution_amount: 75,
          created_at: "2024-01-10",
          is_member: false,
        },
      ])
    } catch (error) {
      console.error("Error fetching groups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here you would create the group in Supabase
      console.log("Creating group:", newGroup)
      setShowCreateDialog(false)
      setNewGroup({
        name: "",
        description: "",
        target_amount: "",
        contribution_frequency: "weekly",
        contribution_amount: "",
      })
      // Refresh groups
      fetchGroups()
    } catch (error) {
      console.error("Error creating group:", error)
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      // Here you would join the group in Supabase
      console.log("Joining group:", groupId)
      // Refresh groups
      fetchGroups()
    } catch (error) {
      console.error("Error joining group:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Groups</h1>
            <p className="text-gray-600">Join or create savings groups to reach your financial goals together.</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Savings Group</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="target_amount">Target Amount (₵)</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    value={newGroup.target_amount}
                    onChange={(e) => setNewGroup({ ...newGroup, target_amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contribution_amount">Contribution Amount (₵)</Label>
                  <Input
                    id="contribution_amount"
                    type="number"
                    value={newGroup.contribution_amount}
                    onChange={(e) => setNewGroup({ ...newGroup, contribution_amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Contribution Frequency</Label>
                  <select
                    id="frequency"
                    value={newGroup.contribution_frequency}
                    onChange={(e) => setNewGroup({ ...newGroup, contribution_frequency: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Create Group
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  {group.is_member && <Badge variant="secondary">Member</Badge>}
                </div>
                <p className="text-sm text-gray-600">{group.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{((group.current_amount / group.target_amount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(group.current_amount / group.target_amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₵{group.current_amount.toFixed(2)}</span>
                    <span>₵{group.target_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{group.member_count} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>
                      ₵{group.contribution_amount} {group.contribution_frequency}
                    </span>
                  </div>
                </div>

                {!group.is_member ? (
                  <Button className="w-full" onClick={() => handleJoinGroup(group.id)}>
                    Join Group
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
