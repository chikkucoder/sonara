"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Diamond, Gavel, FileBarChart, ArrowLeft, TrendingUp, Package, Banknote, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Hidden sidebar for private zone
const privateNavigation = [
  { name: "Private Sale", href: "/dashboard/private-zone", icon: Gavel },
  { name: "Private Sale Report", href: "/dashboard/private-zone/report", icon: FileBarChart },
]

function PrivateSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
            <Diamond className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Private</h1>
            <p className="text-xs text-slate-500">Zone</p>
          </div>
        </div>

        {/* Back to Main */}
        <div className="px-3 py-4 border-b border-slate-200">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {privateNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Warning */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-3">
            <p className="text-xs text-purple-700 text-center font-medium">
              Confidential Area
              <br />
              <span className="text-slate-600">All transactions are private</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

interface PrivateSale {
  _id: string
  sale_type: "girvi" | "most-private"
  item_name: string
  customer_name?: string
  total_amount: number
  sale_date: string
  payment_mode: string
}

interface Statistics {
  totalSales: number
  totalTransactions: number
  girviSales: {
    total: number
    count: number
  }
  mostPrivateSales: {
    total: number
    count: number
  }
}

export default function PrivateSaleReportPage() {
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [filterType, setFilterType] = useState<"all" | "girvi" | "most-private">("all")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Data from database
  const [allSales, setAllSales] = useState<PrivateSale[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalSales: 0,
    totalTransactions: 0,
    girviSales: { total: 0, count: 0 },
    mostPrivateSales: { total: 0, count: 0 }
  })

  // Fetch reports when filters change
  useEffect(() => {
    fetchReports()
  }, [startDate, endDate, filterType])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        sale_type: filterType
      })

      const response = await fetch(`/api/private-sales/reports?${params}`)
      const result = await response.json()

      if (response.ok) {
        setAllSales(result.data.sales)
        setStatistics(result.data.statistics)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PrivateSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Private Sale Report</h1>
            <p className="text-slate-600 mt-1">Confidential sales analytics and records</p>
          </div>

          {/* Date Filters */}
          <Card className="bg-white border-slate-200 shadow-lg mb-6">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 w-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 w-40"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className={filterType === "all" ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" : "border-slate-300 text-slate-700"}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "girvi" ? "default" : "outline"}
                    onClick={() => setFilterType("girvi")}
                    className={
                      filterType === "girvi" ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-slate-300 text-slate-700"
                    }
                  >
                    Girvi Only
                  </Button>
                  <Button
                    variant={filterType === "most-private" ? "default" : "outline"}
                    onClick={() => setFilterType("most-private")}
                    className={
                      filterType === "most-private"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-slate-300 text-slate-700"
                    }
                  >
                    Most Private Only
                  </Button>
                </div>
                <Button variant="outline" className="border-slate-300 text-slate-700 ml-auto hover:bg-slate-100">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
                    <Banknote className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Private Sales</p>
                    <p className="text-2xl font-bold text-slate-900">₹{statistics.totalSales.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-100">
                    <Gavel className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Girvi Sales</p>
                    <p className="text-2xl font-bold text-slate-900">₹{statistics.girviSales.total.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{statistics.girviSales.count} transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Most Private Sales</p>
                    <p className="text-2xl font-bold text-slate-900">₹{statistics.mostPrivateSales.total.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{statistics.mostPrivateSales.count} transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-slate-900">{statistics.totalTransactions}</p>
                    <p className="text-xs text-slate-500">in selected period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Table */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600">
              <CardTitle className="text-white font-serif">Transaction Details</CardTitle>
              <CardDescription className="text-purple-100">
                All private sales from {startDate} to {endDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-100">
                      <TableHead className="text-slate-700 font-semibold">ID</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Date</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Type</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Item</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Customer</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Payment</TableHead>
                      <TableHead className="text-slate-700 font-semibold text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : allSales.length > 0 ? (
                      allSales.map((sale) => (
                        <TableRow key={sale._id} className="hover:bg-slate-50">
                          <TableCell className="text-slate-600 font-mono">{sale._id.slice(-6)}</TableCell>
                          <TableCell className="text-slate-700">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={sale.sale_type === "girvi" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"}>
                              {sale.sale_type === "girvi" ? "Girvi" : "Most Private"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-900 font-medium">{sale.item_name}</TableCell>
                          <TableCell className="text-slate-700">{sale.customer_name || "Cash Customer"}</TableCell>
                          <TableCell className="text-slate-700">{sale.payment_mode}</TableCell>
                          <TableCell className="text-green-600 font-semibold text-right">
                            ₹{sale.total_amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          No transactions found for the selected period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Total Row */}
              {allSales.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Grand Total</span>
                  <span className="text-2xl font-bold text-green-600">₹{statistics.totalSales.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
