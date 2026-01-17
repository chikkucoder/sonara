import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Sale from "@/lib/models/Sale"
import Inventory from "@/lib/models/Inventory"
import { unstable_cache } from "next/cache"

// Cache dashboard data for 60 seconds
const getCachedDashboardData = unstable_cache(
  async (userId: string) => {
    await dbConnect()

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Run queries in parallel for better performance
    const [profile, todaySales, inventoryCount, recentSales, lowStock] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      Sale.find({
        user_id: userId,
        sale_date: { $gte: today, $lt: tomorrow },
      }).lean(),
      Inventory.countDocuments({ user_id: userId }),
      Sale.find({ user_id: userId }).sort({ created_at: -1 }).limit(5).lean(),
      Inventory.find({ user_id: userId, quantity: { $lte: 10 } })
        .sort({ quantity: 1 })
        .limit(5)
        .lean(),
    ])

    // Calculate today's sales total
    const todayTotal = todaySales.reduce((sum, sale) => sum + Number(sale.total_amount), 0)

    return {
      profile,
      todayTotal,
      inventoryCount,
      todaySalesCount: todaySales.length,
      recentSales,
      lowStock,
    }
  },
  ['dashboard-data'],
  { revalidate: 60, tags: ['dashboard'] }
)

async function getDashboardData() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id
  const data = await getCachedDashboardData(userId)

  return {
    user: session.user,
    ...data,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="p-6 lg:p-8">
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back, ${data.profile?.full_name || "User"}! Here's your store overview.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Sales"
          value={`₹${data.todayTotal.toLocaleString("en-IN")}`}
          change={`${data.todaySalesCount} orders`}
          changeType="positive"
          icon={IndianRupee}
        />
        <StatsCard
          title="Total Inventory"
          value={data.inventoryCount.toString()}
          change="Active items"
          changeType="positive"
          icon={Package}
        />
        <StatsCard
          title="Orders Today"
          value={data.todaySalesCount.toString()}
          change="Today"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Low Stock Items"
          value={data.lowStock.length.toString()}
          change="Need attention"
          changeType={data.lowStock.length > 0 ? "negative" : "positive"}
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Recent Sales</CardTitle>
            <Badge variant="secondary" className="font-normal">
              Latest
            </Badge>
          </CardHeader>
          <CardContent>
            {data.recentSales.length > 0 ? (
              <div className="space-y-4">
                {data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{sale.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{sale.item_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-card-foreground">
                        ₹{Number(sale.total_amount).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sales yet</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Low Stock Alert</CardTitle>
            {data.lowStock.length > 0 && (
              <Badge variant="destructive" className="font-normal">
                Action Required
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {data.lowStock.length > 0 ? (
              <div className="space-y-4">
                {data.lowStock.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="font-medium text-sm text-card-foreground">{item.item_name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-destructive border-destructive">
                      {item.quantity} left
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">All items well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
