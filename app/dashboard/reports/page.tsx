"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndianRupee, TrendingUp, TrendingDown, Download, Calendar, Package, ShoppingCart, Users } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const salesData = [
  { month: "Jan", sales: 2400000, orders: 45 },
  { month: "Feb", sales: 1800000, orders: 38 },
  { month: "Mar", sales: 3200000, orders: 62 },
  { month: "Apr", sales: 2800000, orders: 55 },
  { month: "May", sales: 3600000, orders: 72 },
  { month: "Jun", sales: 3100000, orders: 58 },
  { month: "Jul", sales: 4200000, orders: 85 },
  { month: "Aug", sales: 3800000, orders: 75 },
  { month: "Sep", sales: 4500000, orders: 92 },
  { month: "Oct", sales: 4100000, orders: 82 },
  { month: "Nov", sales: 5200000, orders: 105 },
  { month: "Dec", sales: 4800000, orders: 98 },
]

const categoryData = [
  { name: "Gold Jewelry", value: 45, amount: 18500000 },
  { name: "Diamond", value: 25, amount: 12000000 },
  { name: "Silver", value: 15, amount: 4500000 },
  { name: "Platinum", value: 10, amount: 6000000 },
  { name: "Others", value: 5, amount: 2000000 },
]

const COLORS = ["#C9A962", "#E8D5B7", "#8B7355", "#A68B5B", "#D4C4A8"]

const topProducts = [
  { name: "Gold Necklace Set 22K", sold: 45, revenue: 12150000 },
  { name: "Diamond Ring Collection", sold: 38, revenue: 4180000 },
  { name: "Gold Bangles (Pair)", sold: 52, revenue: 10140000 },
  { name: "Diamond Pendant", sold: 28, revenue: 4620000 },
  { name: "Gold Chain 22K", sold: 65, revenue: 9750000 },
]

const topCustomers = [
  { name: "Priya Sharma", purchases: 8, totalSpent: 1850000 },
  { name: "Amit Patel", purchases: 6, totalSpent: 1420000 },
  { name: "Sunita Devi", purchases: 5, totalSpent: 980000 },
  { name: "Rahul Singh", purchases: 4, totalSpent: 875000 },
  { name: "Meera Joshi", purchases: 4, totalSpent: 720000 },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("year")

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`
    }
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount,
    )
  }

  const totalRevenue = salesData.reduce((acc, d) => acc + d.sales, 0)
  const totalOrders = salesData.reduce((acc, d) => acc + d.orders, 0)
  const avgOrderValue = totalRevenue / totalOrders

  return (
    <div className="min-h-screen bg-background">
      {/* MainLayout handles Sidebar */}
      <main>
        <div className="p-8">
          <DashboardHeader
            title="Reports & Analytics"
            subtitle="Comprehensive business insights and performance metrics"
          />

          {/* Time Range Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18.5% from last year
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.3% from last year
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.2% from last year
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Customers</p>
                    <p className="text-2xl font-bold">248</p>
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1% from last year
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="sales" className="mb-6">
            <TabsList>
              <TabsTrigger value="sales">Sales Trend</TabsTrigger>
              <TabsTrigger value="categories">Category Wise</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Monthly Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" tickFormatter={(v) => `₹${v / 100000}L`} />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Sales"]}
                          contentStyle={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#C9A962"
                          fill="#C9A962"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {categoryData.map((cat, index) => (
                        <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(cat.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          formatter={(value) => [value, "Orders"]}
                          contentStyle={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" }}
                        />
                        <Bar dataKey="orders" fill="#C9A962" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif">Top Selling Products</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.sold}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif">Top Customers</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Purchases</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell className="text-right">{customer.purchases}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(customer.totalSpent)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
