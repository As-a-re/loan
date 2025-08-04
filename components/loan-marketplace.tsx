"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Star, MessageCircle, TrendingUp, TrendingDown } from "lucide-react"

interface LoanOffer {
  id: string
  lender_name: string
  amount: number
  interest_rate: number
  repayment_period: number
  description: string
  rating: number
  created_at: string
}

interface LoanRequest {
  id: string
  borrower_name: string
  amount: number
  purpose: string
  repayment_plan: string
  rating: number
  created_at: string
}

export function LoanMarketplace() {
  const [offers, setOffers] = useState<LoanOffer[]>([])
  const [requests, setRequests] = useState<LoanRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [newOffer, setNewOffer] = useState({
    amount: "",
    interest_rate: "",
    repayment_period: "",
    description: "",
  })
  const [newRequest, setNewRequest] = useState({
    amount: "",
    purpose: "",
    repayment_plan: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchMarketplaceData()
  }, [])

  const fetchMarketplaceData = async () => {
    try {
      // Mock data for demonstration
      setOffers([
        {
          id: "1",
          lender_name: "Sarah Johnson",
          amount: 1000,
          interest_rate: 8,
          repayment_period: 6,
          description: "Quick loan for small business needs. Flexible terms available.",
          rating: 4.8,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          lender_name: "Michael Asante",
          amount: 500,
          interest_rate: 10,
          repayment_period: 3,
          description: "Emergency loan available. Fast approval process.",
          rating: 4.5,
          created_at: "2024-01-14",
        },
      ])

      setRequests([
        {
          id: "1",
          borrower_name: "Grace Osei",
          amount: 800,
          purpose: "School fees for my daughter",
          repayment_plan: "Monthly payments over 8 months",
          rating: 4.7,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          borrower_name: "James Mensah",
          amount: 1200,
          purpose: "Expand my tailoring business",
          repayment_plan: "Weekly payments over 12 weeks",
          rating: 4.9,
          created_at: "2024-01-13",
        },
      ])
    } catch (error) {
      console.error("Error fetching marketplace data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Creating loan offer:", newOffer)
      setShowOfferDialog(false)
      setNewOffer({
        amount: "",
        interest_rate: "",
        repayment_period: "",
        description: "",
      })
      fetchMarketplaceData()
    } catch (error) {
      console.error("Error creating offer:", error)
    }
  }

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Creating loan request:", newRequest)
      setShowRequestDialog(false)
      setNewRequest({
        amount: "",
        purpose: "",
        repayment_plan: "",
      })
      fetchMarketplaceData()
    } catch (error) {
      console.error("Error creating request:", error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Marketplace</h1>
            <p className="text-gray-600">Connect with lenders and borrowers in your community.</p>
          </div>

          <div className="flex space-x-2">
            <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
              <DialogTrigger asChild>
                <Button>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Post Offer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Loan Offer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateOffer} className="space-y-4">
                  <div>
                    <Label htmlFor="offer-amount">Loan Amount (₵)</Label>
                    <Input
                      id="offer-amount"
                      type="number"
                      value={newOffer.amount}
                      onChange={(e) => setNewOffer({ ...newOffer, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={newOffer.interest_rate}
                      onChange={(e) => setNewOffer({ ...newOffer, interest_rate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="repayment-period">Repayment Period (months)</Label>
                    <Input
                      id="repayment-period"
                      type="number"
                      value={newOffer.repayment_period}
                      onChange={(e) => setNewOffer({ ...newOffer, repayment_period: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="offer-description">Description</Label>
                    <Textarea
                      id="offer-description"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Post Offer
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Request Loan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Loan Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="request-amount">Loan Amount (₵)</Label>
                    <Input
                      id="request-amount"
                      type="number"
                      value={newRequest.amount}
                      onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={newRequest.purpose}
                      onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="repayment-plan">Repayment Plan</Label>
                    <Textarea
                      id="repayment-plan"
                      value={newRequest.repayment_plan}
                      onChange={(e) => setNewRequest({ ...newRequest, repayment_plan: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Post Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="offers">Loan Offers</TabsTrigger>
            <TabsTrigger value="requests">Loan Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.lender_name}</CardTitle>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(offer.rating)}
                          <span className="text-sm text-gray-600 ml-2">{offer.rating}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">Lender</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold">₵{offer.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="font-semibold">{offer.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Repayment Period</p>
                        <p className="font-semibold">{offer.repayment_period} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="font-semibold">{new Date(offer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">{offer.description}</p>

                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Lender
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.borrower_name}</CardTitle>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(request.rating)}
                          <span className="text-sm text-gray-600 ml-2">{request.rating}</span>
                        </div>
                      </div>
                      <Badge variant="outline">Borrower</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount Needed</p>
                        <p className="font-semibold">₵{request.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="font-semibold">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Purpose</p>
                      <p className="text-sm font-medium">{request.purpose}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Repayment Plan</p>
                      <p className="text-sm">{request.repayment_plan}</p>
                    </div>

                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Borrower
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
