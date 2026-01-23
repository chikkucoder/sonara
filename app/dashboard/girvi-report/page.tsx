"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, IndianRupee, Package, CheckCircle, XCircle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GirviItem {
  _id: string
  customer_name: string
  customer_phone: string
  item_name: string
  metal_type: string
  weight: number
  purity: string
  loan_amount: number
  interest_rate: number
  girvi_date: string
  due_date: string
  status: "Active" | "Redeemed" | "Auctioned"
  created_at: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function GirviReportPage() {
  const { toast } = useToast()
  const [girviItems, setGirviItems] = useState<GirviItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    fetchGirviData()
  }, [])

  const fetchGirviData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/inventory/girvi")
      if (!response.ok) throw new Error("Failed to fetch girvi data")
      const data = await response.json()
      setGirviItems(data.inventory || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load girvi data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    return girviItems.filter((item) => {
      // Status filter
      if (selectedStatus !== "All" && item.status !== selectedStatus) {
        return false
      }

      // Date range filter
      if (startDate && new Date(item.girvi_date) < new Date(startDate)) {
        return false
      }
      if (endDate && new Date(item.girvi_date) > new Date(endDate)) {
        return false
      }

      return true
    })
  }, [girviItems, selectedStatus, startDate, endDate])

  const summary = useMemo(() => {
    const totalItems = filteredData.length
    const activeLoans = filteredData.filter((item) => item.status === "Active").length
    const redeemedItems = filteredData.filter((item) => item.status === "Redeemed").length
    const auctionedItems = filteredData.filter((item) => item.status === "Auctioned").length
    const totalLoanAmount = filteredData.reduce((acc, item) => acc + item.loan_amount, 0)

    return { totalItems, activeLoans, redeemedItems, auctionedItems, totalLoanAmount }
  }, [filteredData])

  const exportToCSV = () => {
    const headers = [
      "Customer Name",
      "Customer Phone",
      "Item Name",
      "Metal Type",
      "Weight (g)",
      "Purity",
      "Loan Amount",
      "Interest Rate (%)",
      "Girvi Date",
      "Due Date",
      "Status",
    ]

    const csvData = filteredData.map((item) => [
      item.customer_name,
      item.customer_phone,
      item.item_name,
      item.metal_type,
      item.weight,
      item.purity,
      item.loan_amount,
      item.interest_rate,
      formatDate(item.girvi_date),
      formatDate(item.due_date),
      item.status,
    ])

    const csv = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `girvi-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Girvi report exported to CSV",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-blue-500">Active</Badge>
      case "Redeemed":
        return <Badge className="bg-green-500">Redeemed</Badge>
      case "Auctioned":
        return <Badge className="bg-red-500">Auctioned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-8">
      <DashboardHeader title="Girvi Report" subtitle="Comprehensive report of all girvi (pledge) transactions" />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <label className="font-medium">From:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[160px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">To:</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[160px]" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">Status:</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Redeemed">Redeemed</SelectItem>
                  <SelectItem value="Auctioned">Auctioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <Button variant="outline" className="gap-2" onClick={exportToCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Girvi Items</p>
              <p className="text-2xl font-bold">{summary.totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Loans</p>
              <p className="text-2xl font-bold">{summary.activeLoans}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Redeemed Items</p>
              <p className="text-2xl font-bold">{summary.redeemedItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auctioned Items</p>
              <p className="text-2xl font-bold">{summary.auctionedItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Loan Amount</p>
              <p className="text-lg font-bold">{formatCurrency(summary.totalLoanAmount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Girvi Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-serif">Girvi Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No girvi items found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Metal Type</TableHead>
                  <TableHead className="text-right">Weight (g)</TableHead>
                  <TableHead>Purity</TableHead>
                  <TableHead className="text-right">Loan Amount</TableHead>
                  <TableHead className="text-center">Interest Rate</TableHead>
                  <TableHead>Girvi Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.customer_name}</TableCell>
                    <TableCell>{item.customer_phone}</TableCell>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.metal_type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.weight}g</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.purity}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.loan_amount)}</TableCell>
                    <TableCell className="text-center">{item.interest_rate}%</TableCell>
                    <TableCell>{formatDate(item.girvi_date)}</TableCell>
                    <TableCell>{formatDate(item.due_date)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Footer Summary */}
      {filteredData.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">
                    Active: <strong>{summary.activeLoans}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">
                    Redeemed: <strong>{summary.redeemedItems}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">
                    Auctioned: <strong>{summary.auctionedItems}</strong>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Loan Amount</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(summary.totalLoanAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
