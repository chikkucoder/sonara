import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserManagement } from "@/components/super-admin/user-management"
import { Shield } from "lucide-react"

async function getSuperAdminData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/super-admin/login")
  }

  // Check if user is super admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "super_admin") {
    redirect("/super-admin/login")
  }

  // Fetch all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return {
    user,
    users: users || [],
  }
}

export default async function SuperAdminDashboard() {
  const data = await getSuperAdminData()

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-slate-100">Super Admin Panel</h1>
              <p className="text-sm text-slate-400">User Management System</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <UserManagement users={data.users} />
      </div>
    </div>
  )
}
