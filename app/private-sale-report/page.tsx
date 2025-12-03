"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IndianRupee, TrendingUp, Gavel, Package, Download } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Sample Data - Girvi Private Sales
const girviPrivateSalesData = [
  {
    id: 1,
    invoiceNo: "GPV-2024-001",
    customer: "Manoj Tiwari",
    phone: "9876543230",
    girviItemName: "Gold Chain Heavy",
    girviCustomerName: "Vijay Verma",
    metalType: "Gold",
    weight: "100g",
    purity: "22K",
    originalLoanAmount: 400000,
    sellingPrice: 520000,
    profit: 120000,
    paymentMethod: "cash",
    date: "2024-12-01",
  },
  {
    id: 2,
    invoiceNo: "GPV-2024-002",
    customer: "Ravi Shankar",
    phone: "9876543231",
    girviItemName: "Gold Anklets",
    girviCustomerName: "Meena Kumari",
    metalType: "Gold",
    weight: "40g",
    purity: "22K",
    originalLoanAmount: 160000,
    sellingPrice: 210000,
    profit: 50000,
    paymentMethod: "upi",
    date: "2024-12-02",
  },
  {
    id: 3,
    invoiceNo: "GPV-2024-003",
    customer: "Suresh Patel",
    phone: "9876543232",
    girviItemName: "Gold Bangles Set",
    girviCustomerName: "Sunita Devi",
    metalType: "Gold",
    weight: "80g",
    purity: "22K",
    originalLoanAmount: 320000,
    sellingPrice: 420000,
    profit: 100000,
    paymentMethod: "card",
    date: "2024-12-03",
  },
]

// Sample Data - Most Private Sales
const mostPrivateSalesData = [
  {
    id: 1,
    invoiceNo: "MPV-2024-001",
    customer: "Ravi Kumar",
    phone: "9876543240",
    itemName: "Gold Necklace Set",
    category: "Necklace",
    metalType: "Gold",
    weight: "45g",
    purity: "22K",
    regularPrice: 270000,
    sellingPrice: 265000,
    discount: 5000,
    paymentMethod: "cash",
    date: "2024-12-02",
    remarks: "Regular customer",
  },
  {
    id: 2,
    invoiceNo: "MPV-2024-002",
    customer: "Priya Singh",
    phone: "9876543241",
    itemName: "Gold Bangles (Pair)",
    category: "Bangles",
    metalType: "Gold",
    weight: "32g",
    purity: "22K",
    regularPrice: 195000,
    sellingPrice: 190000,
    discount: 5000,
    paymentMethod: "upi",
    date: "2024-12-03",
    remarks: "Special deal",
  },
]

export default function PrivateSaleReportPage() {
  const [activeTab, setActiveTab] = useState("girvi")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")

  // Filter by date range
  const filterByDate = <T extends { date: string }>(data: T[]) => {
    return data.filter((item) => {
      if (startDate && endDate) {
        return item.date >= startDate && item.date <= endDate
      }
      if (selectedMonth !== "all") {
        const itemMonth = item.date.substring(0, 7)
        return itemMonth === selectedMonth
      }
      return true
    })
  }

  const filteredGirviSales = filterByDate(girviPrivateSalesData)
  const filteredMostPrivateSales = filterByDate(mostPrivateSalesData)

  // Calculations - Girvi
  const totalGirviSales = filteredGirviSales.reduce((sum, s) => sum + s.sellingPrice, 0)
  const totalGirviProfit = filteredGirviSales.reduce((sum, s) => sum + s.profit, 0)
  const totalGirviLoanRecovered = filteredGirviSales.reduce((sum, s) => sum + s.originalLoanAmount, 0)

  // Calculations - Most Private
  const totalMostPrivateSales = filteredMostPrivateSales.reduce((sum, s) => sum + s.sellingPrice, 0)
  const totalMostPrivateDiscount = filteredMostPrivateSales.reduce((sum, s) => sum + s.discount, 0)

  // Combined totals
  const grandTotalSales = totalGirviSales + totalMostPrivateSales

  return (
    <div className="p-6">
      <DashboardHeader title="Private Sale Report" subtitle="Girvi Private Sales & Most Private Sales Reports" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Total Private Sales</p>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(grandTotalSales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Gavel className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Girvi Sales</p>
              <p className="text-2xl font-bold">{formatCurrency(totalGirviSales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Private Sales</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMostPrivateSales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Girvi Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGirviProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setSelectedMonth("all")
                }}
                className="w-[180px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setSelectedMonth("all")
                }}
                className="w-[180px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Or Select Month</Label>
              <Select
                value={selectedMonth}
                onValueChange={(v) => {
                  setSelectedMonth(v)
                  setStartDate("")
                  setEndDate("")
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                  <SelectItem value="2024-10">October 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setStartDate("")
                setEndDate("")
                setSelectedMonth("all")
              }}
            >
              Clear Filters
            </Button>
            <Button className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="girvi" className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            Girvi Private Sale
          </TabsTrigger>
          <TabsTrigger value="most-private" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Most Private Sale
          </TabsTrigger>
        </TabsList>

        {/* Girvi Private Sale Report */}
        <TabsContent value="girvi">
          {/* Girvi Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{formatCurrency(totalGirviSales)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Loan Recovered</p>
                <p className="text-xl font-bold">{formatCurrency(totalGirviLoanRecovered)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalGirviProfit)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-xl font-bold">{filteredGirviSales.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Girvi Private Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Girvi Item</TableHead>
                    <TableHead>Original Owner</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGirviSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-xs text-muted-foreground">{sale.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{sale.girviItemName}</TableCell>
                      <TableCell className="text-muted-foreground">{sale.girviCustomerName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {sale.metalType} - {sale.purity}
                          </p>
                          <p className="text-muted-foreground">{sale.weight}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.originalLoanAmount)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.sellingPrice)}</TableCell>
                      <TableCell className="font-bold text-green-600">{formatCurrency(sale.profit)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod.toUpperCase()}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={6} className="text-right">
                      Total:
                    </TableCell>
                    <TableCell>{formatCurrency(totalGirviLoanRecovered)}</TableCell>
                    <TableCell>{formatCurrency(totalGirviSales)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(totalGirviProfit)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Most Private Sale Report */}
        <TabsContent value="most-private">
          {/* Most Private Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{formatCurrency(totalMostPrivateSales)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Discount Given</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalMostPrivateDiscount)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Avg. Sale Value</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalMostPrivateSales / (filteredMostPrivateSales.length || 1))}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-xl font-bold">{filteredMostPrivateSales.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Most Private Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Regular Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMostPrivateSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-xs text-muted-foreground">{sale.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.itemName}</p>
                          <p className="text-xs text-muted-foreground">{sale.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {sale.metalType} - {sale.purity}
                          </p>
                          <p className="text-muted-foreground">{sale.weight}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.regularPrice)}</TableCell>
                      <TableCell className="text-red-600">-{formatCurrency(sale.discount)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.sellingPrice)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                        {sale.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={5} className="text-right">
                      Total:
                    </TableCell>
                    <TableCell>
                      {formatCurrency(filteredMostPrivateSales.reduce((sum, s) => sum + s.regularPrice, 0))}
                    </TableCell>
                    <TableCell className="text-red-600">-{formatCurrency(totalMostPrivateDiscount)}</TableCell>
                    <TableCell>{formatCurrency(totalMostPrivateSales)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
