"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Package,
  FileText,
  Search,
  Calendar,
} from "lucide-react"

interface Transaction {
  _id: string
  type: "sale" | "purchase" | "expense" | "girvi" | "private_sale"
  date: string
  amount: number
  description: string
  payment_method?: string
  status: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("summary")
  const [sales, setSales] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [girvi, setGirvi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [salesRes, purchasesRes, girviRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/purchase"),
        fetch("/api/girvi"),
      ])

      const salesData = await salesRes.json()
      const purchasesData = await purchasesRes.json()
      const girviData = await girviRes.json()

      setSales(Array.isArray(salesData.data) ? salesData.data : [])
      setPurchases(Array.isArray(purchasesData.data) ? purchasesData.data : [])
      setGirvi(Array.isArray(girviData.data) ? girviData.data : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setSales([])
      setPurchases([])
      setGirvi([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0)
  const totalPurchases = purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0)
  const totalGirvi = girvi.reduce((sum, g) => sum + (g.amount || 0), 0)
  const totalRevenue = totalSales
  const totalExpenses = totalPurchases

  // Today's data
  const today = new Date().toISOString().split("T")[0]
  const todaySales = sales.filter((s) => s.sale_date?.split("T")[0] === today)
  const todayPurchases = purchases.filter((p) => p.purchase_date?.split("T")[0] === today)
  const todayGirvi = girvi.filter((g) => g.date?.split("T")[0] === today)
  
  const todayTotalSales = todaySales.reduce((sum, s) => sum + (s.total || 0), 0)
  const todayTotalPurchases = todayPurchases.reduce((sum, p) => sum + (p.total_amount || 0), 0)
  const todayTotalGirvi = todayGirvi.reduce((sum, g) => sum + (g.amount || 0), 0)

  // Dues
  const pendingGirvi = girvi.filter((g) => g.status === "active")
  const girviDues = pendingGirvi.reduce((sum, g) => sum + (g.amount || 0), 0)
  const salesDues = sales.reduce((sum, s) => sum + (s.amount_pending || 0), 0)
  const totalDues = girviDues + salesDues

  // All transactions combined
  const allTransactions = [
    ...sales.map((s) => ({
      _id: s._id,
      type: "sale" as const,
      date: s.sale_date,
      amount: s.total,
      description: `Sale - ${s.invoice_no}`,
      payment_method: s.payment_method,
      status: s.payment_status,
    })),
    ...purchases.map((p) => ({
      _id: p._id,
      type: "purchase" as const,
      date: p.purchase_date,
      amount: p.total_amount,
      description: `Purchase - ${p.supplier_name}`,
      payment_method: p.payment_mode,
      status: "completed",
    })),
    ...girvi.map((g) => ({
      _id: g._id,
      type: "girvi" as const,
      date: g.date,
      amount: g.amount,
      description: `Girvi - ${g.customer_name}`,
      payment_method: "cash",
      status: g.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredTransactions = allTransactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-8">
      <DashboardHeader
        title="Business Reports"
        subtitle="Comprehensive insights and analytics"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="summary">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Calendar className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                  <p className="text-xs text-muted-foreground">{sales.length} transactions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPurchases)}</p>
                  <p className="text-xs text-muted-foreground">{purchases.length} orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Girvi</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalGirvi)}</p>
                  <p className="text-xs text-muted-foreground">{girvi.length} items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue - totalExpenses)}</p>
                  <p className="text-xs text-muted-foreground">Profit</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales History */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4">Recent Sales</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : sales.slice(0, 5).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No sales yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.slice(0, 5).map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell className="font-medium">{sale.invoice_no}</TableCell>
                          <TableCell>{formatDate(sale.sale_date)}</TableCell>
                          <TableCell>{formatCurrency(sale.total)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4">Recent Purchases</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : purchases.slice(0, 5).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No purchases yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchases.slice(0, 5).map((purchase) => (
                        <TableRow key={purchase._id}>
                          <TableCell className="font-medium">{purchase.supplier_name}</TableCell>
                          <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                          <TableCell>{formatCurrency(purchase.total_amount)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(todayTotalSales)}</p>
                  <p className="text-xs text-muted-foreground">{todaySales.length} orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Purchases</p>
                  <p className="text-2xl font-bold">{formatCurrency(todayTotalPurchases)}</p>
                  <p className="text-xs text-muted-foreground">{todayPurchases.length} items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Girvi</p>
                  <p className="text-2xl font-bold">{formatCurrency(todayTotalGirvi)}</p>
                  <p className="text-xs text-muted-foreground">{todayGirvi.length} items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Dues</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDues)}</p>
                  <p className="text-xs text-muted-foreground">
                    Sales: {formatCurrency(salesDues)} | Girvi: {formatCurrency(girviDues)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Daily Trends</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Today</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Sales</TableCell>
                    <TableCell>{formatCurrency(todayTotalSales)}</TableCell>
                    <TableCell>{formatCurrency(totalSales)}</TableCell>
                    <TableCell>{formatCurrency(sales.length > 0 ? totalSales / sales.length : 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Purchases</TableCell>
                    <TableCell>{formatCurrency(todayTotalPurchases)}</TableCell>
                    <TableCell>{formatCurrency(totalPurchases)}</TableCell>
                    <TableCell>{formatCurrency(purchases.length > 0 ? totalPurchases / purchases.length : 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Girvi</TableCell>
                    <TableCell>{formatCurrency(todayTotalGirvi)}</TableCell>
                    <TableCell>{formatCurrency(totalGirvi)}</TableCell>
                    <TableCell>{formatCurrency(girvi.length > 0 ? totalGirvi / girvi.length : 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dues/Payments</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{formatCurrency(totalDues)}</TableCell>
                    <TableCell>{pendingGirvi.length} pending</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Loading transactions...</TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.type === "sale"
                                ? "bg-green-100 text-green-700"
                                : transaction.type === "purchase"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }
                          >
                            {transaction.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.payment_method?.toUpperCase() || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.status === "paid" || transaction.status === "completed" ? "default" : "secondary"}
                            className={
                              transaction.status === "paid" || transaction.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : transaction.status === "active"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
