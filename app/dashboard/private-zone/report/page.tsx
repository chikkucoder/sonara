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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-900 text-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-zinc-700 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <Diamond className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-red-500">Private</h1>
            <p className="text-xs text-zinc-400">Zone</p>
          </div>
        </div>

        {/* Back to Main */}
        <div className="px-3 py-4 border-b border-zinc-700">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
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
                  isActive ? "bg-red-600/20 text-red-500" : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Warning */}
        <div className="border-t border-zinc-700 p-4">
          <div className="rounded-lg bg-red-600/10 border border-red-600/20 p-3">
            <p className="text-xs text-red-400 text-center">
              Confidential Area
              <br />
              <span className="text-zinc-500">All transactions are private</span>
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
    <div className="min-h-screen bg-zinc-950">
      <PrivateSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">Private Sale Report</h1>
            <p className="text-zinc-400 mt-1">Confidential sales analytics and records</p>
          </div>

          {/* Date Filters */}
          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white w-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white w-40"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className={filterType === "all" ? "bg-red-600 hover:bg-red-700" : "border-zinc-700 text-zinc-300"}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "girvi" ? "default" : "outline"}
                    onClick={() => setFilterType("girvi")}
                    className={
                      filterType === "girvi" ? "bg-orange-600 hover:bg-orange-700" : "border-zinc-700 text-zinc-300"
                    }
                  >
                    Girvi Only
                  </Button>
                  <Button
                    variant={filterType === "most-private" ? "default" : "outline"}
                    onClick={() => setFilterType("most-private")}
                    className={
                      filterType === "most-private"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-zinc-700 text-zinc-300"
                    }
                  >
                    Most Private Only
                  </Button>
                </div>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 ml-auto bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-600/20">
                    <Banknote className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Private Sales</p>
                    <p className="text-2xl font-bold text-white">₹{statistics.totalSales.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-600/20">
                    <Gavel className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Girvi Sales</p>
                    <p className="text-2xl font-bold text-white">₹{statistics.girviSales.total.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500">{statistics.girviSales.count} transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-600/20">
                    <Package className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Most Private Sales</p>
                    <p className="text-2xl font-bold text-white">₹{statistics.mostPrivateSales.total.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500">{statistics.mostPrivateSales.count} transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-600/20">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Transactions</p>
                    <p className="text-2xl font-bold text-white">{statistics.totalTransactions}</p>
                    <p className="text-xs text-zinc-500">in selected period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Table */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white font-serif">Transaction Details</CardTitle>
              <CardDescription className="text-zinc-400">
                All private sales from {startDate} to {endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400">ID</TableHead>
                      <TableHead className="text-zinc-400">Date</TableHead>
                      <TableHead className="text-zinc-400">Type</TableHead>
                      <TableHead className="text-zinc-400">Item</TableHead>
                      <TableHead className="text-zinc-400">Customer</TableHead>
                      <TableHead className="text-zinc-400">Payment</TableHead>
                      <TableHead className="text-zinc-400 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : allSales.length > 0 ? (
                      allSales.map((sale) => (
                        <TableRow key={sale._id} className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableCell className="text-zinc-300 font-mono">{sale._id.slice(-6)}</TableCell>
                          <TableCell className="text-zinc-300">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={sale.sale_type === "girvi" ? "bg-orange-600" : "bg-purple-600"}>
                              {sale.sale_type === "girvi" ? "Girvi" : "Most Private"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium">{sale.item_name}</TableCell>
                          <TableCell className="text-zinc-300">{sale.customer_name || "Cash Customer"}</TableCell>
                          <TableCell className="text-zinc-300">{sale.payment_mode}</TableCell>
                          <TableCell className="text-green-400 font-semibold text-right">
                            ₹{sale.total_amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                          No transactions found for the selected period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Total Row */}
              {allSales.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 flex justify-between items-center">
                  <span className="text-zinc-400 font-medium">Grand Total</span>
                  <span className="text-2xl font-bold text-green-400">₹{statistics.totalSales.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
