import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagingCenter } from "@/components/messaging-center"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <MessagingCenter />
}
