import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const recentSales = [
  { id: 1, customer: "Priya Sharma", item: "Gold Necklace 22K", amount: "₹1,25,000", time: "2 min ago" },
  { id: 2, customer: "Amit Patel", item: "Diamond Ring", amount: "₹85,000", time: "15 min ago" },
  { id: 3, customer: "Sunita Devi", item: "Silver Anklet Set", amount: "₹12,500", time: "1 hour ago" },
  { id: 4, customer: "Rahul Singh", item: "Gold Bangles 22K", amount: "₹2,45,000", time: "2 hours ago" },
]

const lowStockItems = [
  { name: "Gold Chain 22K", stock: 3, category: "Chains" },
  { name: "Diamond Studs", stock: 5, category: "Earrings" },
  { name: "Silver Rings", stock: 8, category: "Rings" },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader title="Dashboard" subtitle="Welcome back, Rajesh! Here's your store overview." />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Sales"
          value="₹4,67,500"
          change="12% from yesterday"
          changeType="positive"
          icon={IndianRupee}
        />
        <StatsCard title="Total Inventory" value="1,234" change="23 items added" changeType="positive" icon={Package} />
        <StatsCard
          title="Orders Today"
          value="28"
          change="5% from yesterday"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Monthly Revenue"
          value="₹45.8L"
          change="8% from last month"
          changeType="positive"
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
              Today
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{sale.customer}</p>
                      <p className="text-sm text-muted-foreground">{sale.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-card-foreground">{sale.amount}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Low Stock Alert</CardTitle>
            <Badge variant="destructive" className="font-normal">
              Action Required
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                >
                  <div className="flex items-center gap-3">
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive">
                    {item.stock} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
