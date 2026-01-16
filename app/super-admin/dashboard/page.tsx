import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserManagement } from "@/components/super-admin/user-management"
import { Shield } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Shop from "@/lib/models/Shop"

async function getSuperAdminData() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/super-admin/login")
  }

  // Check if user is super admin
  if ((session.user as any).role !== "super_admin") {
    redirect("/super-admin/login")
  }

  await dbConnect()

  // Fetch all users
  const users = await User.find({}).select("-password").sort({ created_at: -1 }).lean()

  // Fetch shop details for each user
  const usersWithShops = await Promise.all(
    users.map(async (user) => {
      const shop = await Shop.findOne({ user_id: user._id.toString() }).lean()
      return {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        enabled: user.enabled,
        shop_name: shop?.shop_name || null,
        shop_address: shop?.shop_address || null,
        shop_phone: shop?.shop_phone || null,
        shop_gst: shop?.shop_gst || null,
        created_at: user.created_at?.toString() || new Date().toString(),
      }
    })
  )

  return {
    user: session.user,
    users: usersWithShops,
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
