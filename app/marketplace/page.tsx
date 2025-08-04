import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoanMarketplace } from "@/components/loan-marketplace"

export default async function MarketplacePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <LoanMarketplace />
}
