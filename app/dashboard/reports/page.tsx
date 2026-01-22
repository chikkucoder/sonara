"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Package,
  FileText,
  Search,
  Calendar,
  Download,
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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [selectedTransactionType, setSelectedTransactionType] = useState("all")

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
      invoice_no: s.invoice_no,
      customer_name: s.customer_name,
      amount_paid: s.amount_paid,
      amount_pending: s.amount_pending,
    })),
    ...purchases.map((p) => ({
      _id: p._id,
      type: "purchase" as const,
      date: p.purchase_date,
      amount: p.total_amount,
      description: `Purchase - ${p.supplier_name}`,
      payment_method: p.payment_mode,
      status: p.payment_status || "completed",
      invoice_no: p.invoice_number || "N/A",
      customer_name: p.supplier_name,
      amount_paid: p.amount_paid || p.total_amount,
      amount_pending: 0,
    })),
    ...girvi.map((g) => ({
      _id: g._id,
      type: "girvi" as const,
      date: g.date,
      amount: g.amount,
      description: `Girvi - ${g.customer_name}`,
      payment_method: "cash",
      status: g.status,
      invoice_no: g.girvi_no || "N/A",
      customer_name: g.customer_name,
      amount_paid: g.amount,
      amount_pending: 0,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDateRange = (!startDate || new Date(t.date) >= new Date(startDate)) &&
      (!endDate || new Date(t.date) <= new Date(endDate))
    
    const matchesPaymentStatus = selectedPaymentStatus === "all" || 
      t.status?.toLowerCase() === selectedPaymentStatus.toLowerCase()
    
    const matchesTransactionType = selectedTransactionType === "all" ||
      t.type === selectedTransactionType
    
    return matchesSearch && matchesDateRange && matchesPaymentStatus && matchesTransactionType
  })

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const exportToCSV = () => {
    const headers = ["Transaction ID", "Date & Time", "Bill No.", "Transaction", "Amount", "Mode", "Payment Status", "Customer"]
    const csvData = filteredTransactions.map(t => [
      t._id,
      formatDateTime(t.date),
      t.invoice_no,
      t.type.toUpperCase(),
      t.amount,
      t.payment_method?.toUpperCase() || "N/A",
      t.status?.toUpperCase() || "N/A",
      t.customer_name || "N/A",
    ])
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const exportTrendsToCSV = () => {
    const headers = ["Date", "Total Payments", "Total Refunds", "Net Collection", "Total Dues", "Cash Payments", "Card Payments", "UPI Payments", "Bank Transfer", "Others", "Girvi", "Transactions"]
    const csvData = [[
      formatDate(new Date().toISOString()),
      todayTotalSales,
      0,
      todayTotalSales,
      todaySales.reduce((sum, s) => sum + (s.amount_pending || 0), 0),
      todaySales.filter(s => s.payment_method?.toLowerCase() === 'cash').reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      todaySales.filter(s => s.payment_method?.toLowerCase() === 'card').reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      todaySales.filter(s => s.payment_method?.toLowerCase() === 'upi').reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      todaySales.filter(s => s.payment_method?.toLowerCase() === 'bank_transfer').reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      todaySales.filter(s => !['cash', 'card', 'upi', 'bank_transfer'].includes(s.payment_method?.toLowerCase() || '')).reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      todayTotalGirvi,
      todaySales.length + todayPurchases.length + todayGirvi.length,
    ]]
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trends_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const exportSummaryToCSV = () => {
    const headers = ["Type", "Metric", "Value", "Count"]
    const csvData = [
      ["Sales", "Total Sales", totalSales, sales.length],
      ["Purchases", "Total Purchases", totalPurchases, purchases.length],
      ["Girvi", "Total Girvi", totalGirvi, girvi.length],
      ["Revenue", "Net Revenue", totalRevenue - totalExpenses, "-"],
      ["Payment", "Cash Received", sales.filter(s => s.payment_method?.toLowerCase() === 'cash').reduce((sum, s) => sum + (s.amount_paid || 0), 0), "-"],
      ["Payment", "Card Received", sales.filter(s => s.payment_method?.toLowerCase() === 'card').reduce((sum, s) => sum + (s.amount_paid || 0), 0), "-"],
      ["Payment", "UPI Received", sales.filter(s => s.payment_method?.toLowerCase() === 'upi').reduce((sum, s) => sum + (s.amount_paid || 0), 0), "-"],
      ["Payment", "Bank Transfer Received", sales.filter(s => s.payment_method?.toLowerCase() === 'bank_transfer').reduce((sum, s) => sum + (s.amount_paid || 0), 0), "-"],
    ]
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `summary_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

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
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="summary-start-date" className="text-sm font-medium">Start Date</Label>
                  <Input
                    id="summary-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary-end-date" className="text-sm font-medium">End Date</Label>
                  <Input
                    id="summary-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary-transaction-type" className="text-sm font-medium">Transaction Type</Label>
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger id="summary-transaction-type">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="sale">SALE</SelectItem>
                      <SelectItem value="purchase">PURCHASE</SelectItem>
                      <SelectItem value="girvi">GIRVI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary-payment-status" className="text-sm font-medium">Payment Status</Label>
                  <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                    <SelectTrigger id="summary-payment-status">
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button onClick={exportSummaryToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

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

          {/* Payment Methods Breakdown */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
                Payment Methods Breakdown
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payments Received */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-green-700">Payments Received</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">CASH</span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'cash').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">UPI</span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'upi').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">CARD</span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'card').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">BANK TRANSFER</span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'bank_transfer').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Refunds Given */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-red-700">Refunds Given</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">CASH</span>
                      <span className="font-bold text-red-600 text-xl">
                        {formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="trends-start-date" className="text-sm font-medium">Start Date</Label>
                  <Input
                    id="trends-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trends-end-date" className="text-sm font-medium">End Date</Label>
                  <Input
                    id="trends-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trends-transaction-type" className="text-sm font-medium">Transaction Type</Label>
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger id="trends-transaction-type">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="sale">SALE</SelectItem>
                      <SelectItem value="purchase">PURCHASE</SelectItem>
                      <SelectItem value="girvi">GIRVI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trends-payment-status" className="text-sm font-medium">Payment Status</Label>
                  <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                    <SelectTrigger id="trends-payment-status">
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button onClick={exportTrendsToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daily Trends
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Total Payments</TableHead>
                      <TableHead className="whitespace-nowrap">Total Refunds</TableHead>
                      <TableHead className="whitespace-nowrap">Net Collection</TableHead>
                      <TableHead className="whitespace-nowrap">Total Dues</TableHead>
                      <TableHead className="whitespace-nowrap">Cash Payments</TableHead>
                      <TableHead className="whitespace-nowrap">Card Payments</TableHead>
                      <TableHead className="whitespace-nowrap">UPI Payments</TableHead>
                      <TableHead className="whitespace-nowrap">Bank Transfer</TableHead>
                      <TableHead className="whitespace-nowrap">Others</TableHead>
                      <TableHead className="whitespace-nowrap">Girvi</TableHead>
                      <TableHead className="whitespace-nowrap">Transactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">Loading trends...</TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {/* Today's Row */}
                        <TableRow>
                          <TableCell className="font-medium whitespace-nowrap">{formatDate(new Date().toISOString())}</TableCell>
                          <TableCell className="text-green-600 font-semibold whitespace-nowrap">
                            {formatCurrency(todayTotalSales)}
                          </TableCell>
                          <TableCell className="text-red-600 font-semibold whitespace-nowrap">
                            {formatCurrency(0)}
                          </TableCell>
                          <TableCell className="text-blue-600 font-semibold whitespace-nowrap">
                            {formatCurrency(todayTotalSales)}
                          </TableCell>
                          <TableCell className="text-amber-600 font-semibold whitespace-nowrap">
                            {formatCurrency(todaySales.reduce((sum, s) => sum + (s.amount_pending || 0), 0))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(todaySales.filter(s => s.payment_method?.toLowerCase() === 'cash').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(todaySales.filter(s => s.payment_method?.toLowerCase() === 'card').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(todaySales.filter(s => s.payment_method?.toLowerCase() === 'upi').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(todaySales.filter(s => s.payment_method?.toLowerCase() === 'bank_transfer').reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(todaySales.filter(s => !['cash', 'card', 'upi', 'bank_transfer'].includes(s.payment_method?.toLowerCase() || '')).reduce((sum, s) => sum + (s.amount_paid || 0), 0))}
                          </TableCell>
                          <TableCell className="text-amber-600 font-semibold whitespace-nowrap">
                            {formatCurrency(todayTotalGirvi)}
                          </TableCell>
                          <TableCell className="font-semibold whitespace-nowrap">
                            {todaySales.length + todayPurchases.length + todayGirvi.length}
                          </TableCell>
                        </TableRow>
                        {/* Additional historical rows can be added here */}
                        {sales.length === 0 && purchases.length === 0 && girvi.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                              No data available for trends
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-type" className="text-sm font-medium">Transaction Type</Label>
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="sale">SALE</SelectItem>
                      <SelectItem value="purchase">PURCHASE</SelectItem>
                      <SelectItem value="girvi">GIRVI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-status" className="text-sm font-medium">Payment Status</Label>
                  <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                    <SelectTrigger id="payment-status">
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button onClick={exportToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* All Transactions Table */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                All Transactions
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="whitespace-nowrap">Transaction ID</TableHead>
                      <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                      <TableHead className="whitespace-nowrap">Bill No.</TableHead>
                      <TableHead className="whitespace-nowrap">Transaction</TableHead>
                      <TableHead className="whitespace-nowrap">Amount</TableHead>
                      <TableHead className="whitespace-nowrap">Mode</TableHead>
                      <TableHead className="whitespace-nowrap">Booking Status</TableHead>
                      <TableHead className="whitespace-nowrap">Payment Status</TableHead>
                      <TableHead className="whitespace-nowrap">Booking Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">Loading transactions...</TableCell>
                      </TableRow>
                    ) : filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="font-mono text-xs whitespace-nowrap">
                            {transaction._id.slice(-12).toUpperCase()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {formatDateTime(transaction.date)}
                          </TableCell>
                          <TableCell className="text-primary font-medium whitespace-nowrap">
                            {transaction.invoice_no}
                          </TableCell>
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
                          <TableCell className="font-semibold whitespace-nowrap">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="uppercase">
                              {transaction.payment_method?.toUpperCase() || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={
                                transaction.status === "active" || transaction.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {transaction.status === "active" || transaction.type === "girvi" ? "ACTIVE" : "COMPLETED"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.status === "paid" || transaction.status === "completed" ? "default" : "secondary"}
                              className={
                                transaction.status === "paid" || transaction.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : transaction.status === "partial"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }
                            >
                              {transaction.amount_pending && transaction.amount_pending > 0
                                ? `PARTIAL: ${formatCurrency(transaction.amount_pending)}`
                                : transaction.status?.toUpperCase() || "PAID"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <p className="font-medium">Total: {formatCurrency(transaction.amount)}</p>
                              <p className="text-muted-foreground text-xs">
                                Paid: {formatCurrency(transaction.amount_paid || 0)}
                              </p>
                              {transaction.amount_pending > 0 && (
                                <p className="text-red-600 text-xs">
                                  Due: {formatCurrency(transaction.amount_pending)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
