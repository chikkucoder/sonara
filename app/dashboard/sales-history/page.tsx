"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Eye,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  Printer,
} from "lucide-react"

interface Sale {
  _id: string
  invoice_no: string
  sale_type: "b2c" | "b2b"
  customer_name?: string
  customer_phone?: string
  customer_address?: string
  business_name?: string
  contact_person?: string
  gst_no?: string
  business_phone?: string
  business_address?: string
  items: {
    product_id: string
    item_name: string
    quantity: number
    rate: number
    amount: number
  }[]
  subtotal: number
  discount: number
  gst: number
  total: number
  amount_paid?: number
  amount_pending?: number
  payment_method?: string
  payment_terms?: string
  payment_status: string
  sale_date: string
  due_date?: string
  status: string
  warranty_years?: number
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

export default function SalesHistoryPage() {
  const [activeTab, setActiveTab] = useState("b2c")
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sales")
      if (!response.ok) throw new Error("Failed to fetch sales")
      
      const result = await response.json()
      const salesData = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : []
      setSales(salesData)
    } catch (error) {
      console.error("Error fetching sales:", error)
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  const b2cSales = sales.filter(s => s.sale_type === "b2c")
  const b2bSales = sales.filter(s => s.sale_type === "b2b")

  const filteredB2CSales = b2cSales.filter((sale) => {
    const matchesSearch =
      sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.payment_status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const filteredB2BSales = b2bSales.filter((sale) => {
    const matchesSearch =
      sale.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.payment_status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Calculations
  const totalB2CSales = b2cSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalB2BSales = b2bSales.reduce((sum, sale) => sum + sale.total, 0)

  const today = new Date().toISOString().split("T")[0]
  const todayB2CSales = b2cSales.filter((s) => s.sale_date?.split("T")[0] === today)
  const todayB2BSales = b2bSales.filter((s) => s.sale_date?.split("T")[0] === today)

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "upi":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6">
      <DashboardHeader title="Sales History" subtitle="View all past B2C and B2B sales transactions" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="b2c" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            B2C (Retail)
          </TabsTrigger>
          <TabsTrigger value="b2b" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            B2B (Wholesale)
          </TabsTrigger>
        </TabsList>

        {/* B2C Tab Content */}
        <TabsContent value="b2c" className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total B2C Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalB2CSales)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{b2cSales.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today Sales</p>
                  <p className="text-2xl font-bold">{todayB2CSales.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalB2CSales / (b2cSales.length || 1))}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer or invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Dues</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8">Loading sales...</TableCell>
                    </TableRow>
                  ) : filteredB2CSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        No B2C sales found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredB2CSales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">{sale.invoice_no}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{sale.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {sale.items.map((item, idx) => (
                              <p key={idx}>
                                {item.item_name} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(sale.subtotal)}</TableCell>
                        <TableCell>{formatCurrency(sale.gst)}</TableCell>
                        <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(sale.amount_paid || 0)}
                        </TableCell>
                        <TableCell className={sale.amount_pending && sale.amount_pending > 0 ? "text-red-600 font-semibold" : ""}>
                          {sale.amount_pending && sale.amount_pending > 0 ? formatCurrency(sale.amount_pending) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getPaymentIcon(sale.payment_method || "cash")}
                            {(sale.payment_method || "cash").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(sale.sale_date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sale.payment_status === "PAID" || sale.payment_status === "paid" 
                                ? "default" 
                                : sale.payment_status === "PARTIAL"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              sale.payment_status === "PAID" || sale.payment_status === "paid"
                                ? "bg-green-100 text-green-700"
                                : sale.payment_status === "PARTIAL"
                                ? "bg-orange-100 text-orange-700 border-orange-300"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {sale.payment_status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedSale(sale)} title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => window.open(`/api/sales/bill?id=${sale._id}`, '_blank')}
                              title="Print Bill"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* B2B Tab Content */}
        <TabsContent value="b2b" className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total B2B Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalB2BSales)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{b2bSales.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">{b2bSales.filter((s) => s.payment_status === "pending").length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalB2BSales / (b2bSales.length || 1))}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by business name or invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Dues</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">Loading sales...</TableCell>
                    </TableRow>
                  ) : filteredB2BSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No B2B sales found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredB2BSales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">{sale.invoice_no}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.business_name}</p>
                            <p className="text-xs text-muted-foreground">{sale.gst_no}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {sale.items.map((item, idx) => (
                              <p key={idx}>
                                {item.item_name} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(sale.amount_paid || 0)}
                        </TableCell>
                        <TableCell className={sale.amount_pending && sale.amount_pending > 0 ? "text-red-600 font-semibold" : ""}>
                          {sale.amount_pending && sale.amount_pending > 0 ? formatCurrency(sale.amount_pending) : "-"}
                        </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sale.payment_terms === "immediate" ? "Immediate" : sale.payment_terms}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.due_date ? formatDate(sale.due_date) : "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sale.payment_status === "PAID" || sale.payment_status === "paid" 
                              ? "default" 
                              : sale.payment_status === "PARTIAL"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            sale.payment_status === "PAID" || sale.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : sale.payment_status === "PARTIAL"
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : sale.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {sale.payment_status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSale(sale)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(`/api/sales/bill?id=${sale._id}`, '_blank')}
                            title="Print Bill"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Sale Details Dialog */}
      {selectedSale && (
        <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sale Details - {selectedSale.invoice_no}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedSale.sale_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">{formatCurrency(selectedSale.total)}</p>
                </div>
              </div>
              
              {selectedSale.sale_type === "b2c" ? (
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedSale.customer_name}</p>
                  <p className="text-sm">{selectedSale.customer_phone}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Business</p>
                  <p className="font-medium">{selectedSale.business_name}</p>
                  <p className="text-sm">GST: {selectedSale.gst_no}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="border rounded-lg divide-y">
                  {selectedSale.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.item_name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.rate)}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>GST (3%):</span>
                  <span>{formatCurrency(selectedSale.gst)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
                {selectedSale.amount_paid !== undefined && (
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>Amount Paid:</span>
                    <span>{formatCurrency(selectedSale.amount_paid)}</span>
                  </div>
                )}
                {selectedSale.amount_pending && selectedSale.amount_pending > 0 && (
                  <div className="flex justify-between text-sm text-red-600 font-bold border-t pt-2">
                    <span>Dues Amount:</span>
                    <span>{formatCurrency(selectedSale.amount_pending)}</span>
                  </div>
                )}
                {selectedSale.warranty_years && selectedSale.warranty_years > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Warranty:</span>
                    <span>{selectedSale.warranty_years} {selectedSale.warranty_years === 1 ? 'Year' : 'Years'}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
