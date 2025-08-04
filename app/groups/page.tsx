import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SavingsGroups } from "@/components/savings-groups"

export default async function GroupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SavingsGroups />
}
