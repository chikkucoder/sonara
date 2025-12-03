"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Eye,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  User,
  Building2,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
} from "lucide-react"

interface B2CSale {
  id: number
  invoiceNo: string
  customer: string
  phone: string
  item: string
  amount: number
  gst: number
  total: number
  paymentMethod: "cash" | "card" | "upi"
  date: string
  status: "completed" | "pending"
}

interface B2BSale {
  id: number
  invoiceNo: string
  businessName: string
  contactPerson: string
  gstNo: string
  phone: string
  address: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  discount: number
  gst: number
  total: number
  paymentTerms: "immediate" | "15-days" | "30-days" | "45-days"
  paymentStatus: "paid" | "pending" | "overdue"
  date: string
  dueDate: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const initialB2CSales: B2CSale[] = [
  {
    id: 1,
    invoiceNo: "INV-2024-001",
    customer: "Priya Sharma",
    phone: "9876543210",
    item: "Gold Necklace Set",
    amount: 250000,
    gst: 7500,
    total: 257500,
    paymentMethod: "card",
    date: "2024-12-01",
    status: "completed",
  },
  {
    id: 2,
    invoiceNo: "INV-2024-002",
    customer: "Amit Patel",
    phone: "9876543211",
    item: "Diamond Ring",
    amount: 95000,
    gst: 2850,
    total: 97850,
    paymentMethod: "upi",
    date: "2024-12-02",
    status: "completed",
  },
  {
    id: 3,
    invoiceNo: "INV-2024-003",
    customer: "Sunita Verma",
    phone: "9876543212",
    item: "Gold Bangles",
    amount: 180000,
    gst: 5400,
    total: 185400,
    paymentMethod: "cash",
    date: "2024-12-03",
    status: "pending",
  },
]

const initialB2BSales: B2BSale[] = [
  {
    id: 1,
    invoiceNo: "B2B-2024-001",
    businessName: "Sharma Jewellers",
    contactPerson: "Rakesh Sharma",
    gstNo: "27AABCS1234F1ZX",
    phone: "9876543220",
    address: "Shop 12, Gold Market, Mumbai",
    items: [
      { name: "Gold Chain 22K", quantity: 5, price: 150000 },
      { name: "Gold Earrings", quantity: 10, price: 75000 },
    ],
    subtotal: 1500000,
    discount: 75000,
    gst: 42750,
    total: 1467750,
    paymentTerms: "30-days",
    paymentStatus: "pending",
    date: "2024-12-01",
    dueDate: "2024-12-31",
  },
  {
    id: 2,
    invoiceNo: "B2B-2024-002",
    businessName: "Royal Gold House",
    contactPerson: "Vijay Kumar",
    gstNo: "27AABCR5678G2ZY",
    phone: "9876543221",
    address: "A-15, Jewellery Complex, Delhi",
    items: [
      { name: "Diamond Pendant", quantity: 3, price: 165000 },
      { name: "Gold Necklace Set", quantity: 2, price: 270000 },
    ],
    subtotal: 1035000,
    discount: 51750,
    gst: 29498,
    total: 1012748,
    paymentTerms: "15-days",
    paymentStatus: "paid",
    date: "2024-11-28",
    dueDate: "2024-12-13",
  },
]

const inventoryItems = [
  { name: "Gold Necklace Set", price: 270000 },
  { name: "Diamond Ring", price: 110000 },
  { name: "Gold Bangles (Pair)", price: 195000 },
  { name: "Gold Earrings", price: 75000 },
  { name: "Diamond Pendant", price: 165000 },
  { name: "Gold Chain 22K", price: 150000 },
  { name: "Silver Anklet Set", price: 12500 },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("b2c")
  const [b2cSales, setB2CSales] = useState<B2CSale[]>(initialB2CSales)
  const [b2bSales, setB2BSales] = useState<B2BSale[]>(initialB2BSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isNewB2CSaleOpen, setIsNewB2CSaleOpen] = useState(false)
  const [isNewB2BSaleOpen, setIsNewB2BSaleOpen] = useState(false)

  const [newB2CSale, setNewB2CSale] = useState({
    customer: "",
    phone: "",
    selectedItem: "",
    paymentMethod: "cash" as "cash" | "card" | "upi",
  })

  const [newB2BSale, setNewB2BSale] = useState({
    businessName: "",
    contactPerson: "",
    gstNo: "",
    phone: "",
    address: "",
    selectedItem: "",
    quantity: 1,
    discount: 0,
    paymentTerms: "immediate" as "immediate" | "15-days" | "30-days" | "45-days",
  })

  const filteredB2CSales = b2cSales.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const filteredB2BSales = b2bSales.filter((sale) => {
    const matchesSearch =
      sale.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.paymentStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Calculations
  const totalB2CSales = b2cSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalB2BSales = b2bSales.reduce((sum, sale) => sum + sale.total, 0)

  const todayB2CSales = b2cSales.filter((s) => s.date === new Date().toISOString().split("T")[0])
  const todayB2BSales = b2bSales.filter((s) => s.date === new Date().toISOString().split("T")[0])

  const handleAddB2CSale = () => {
    const item = inventoryItems.find((i) => i.name === newB2CSale.selectedItem)
    if (!item) return

    const gst = item.price * 0.03
    const newSale: B2CSale = {
      id: b2cSales.length + 1,
      invoiceNo: `INV-2024-${String(b2cSales.length + 1).padStart(3, "0")}`,
      customer: newB2CSale.customer,
      phone: newB2CSale.phone,
      item: item.name,
      amount: item.price,
      gst: gst,
      total: item.price + gst,
      paymentMethod: newB2CSale.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    }

    setB2CSales([newSale, ...b2cSales])
    setNewB2CSale({ customer: "", phone: "", selectedItem: "", paymentMethod: "cash" })
    setIsNewB2CSaleOpen(false)
  }

  const handleAddB2BSale = () => {
    const item = inventoryItems.find((i) => i.name === newB2BSale.selectedItem)
    if (!item) return

    const subtotal = item.price * newB2BSale.quantity
    const discountAmount = subtotal * (newB2BSale.discount / 100)
    const afterDiscount = subtotal - discountAmount
    const gst = afterDiscount * 0.03

    const dueDate = new Date()
    if (newB2BSale.paymentTerms === "15-days") dueDate.setDate(dueDate.getDate() + 15)
    else if (newB2BSale.paymentTerms === "30-days") dueDate.setDate(dueDate.getDate() + 30)
    else if (newB2BSale.paymentTerms === "45-days") dueDate.setDate(dueDate.getDate() + 45)

    const newSale: B2BSale = {
      id: b2bSales.length + 1,
      invoiceNo: `B2B-2024-${String(b2bSales.length + 1).padStart(3, "0")}`,
      businessName: newB2BSale.businessName,
      contactPerson: newB2BSale.contactPerson,
      gstNo: newB2BSale.gstNo,
      phone: newB2BSale.phone,
      address: newB2BSale.address,
      items: [{ name: item.name, quantity: newB2BSale.quantity, price: item.price }],
      subtotal: subtotal,
      discount: discountAmount,
      gst: gst,
      total: afterDiscount + gst,
      paymentTerms: newB2BSale.paymentTerms,
      paymentStatus: newB2BSale.paymentTerms === "immediate" ? "paid" : "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
    }

    setB2BSales([newSale, ...b2bSales])
    setNewB2BSale({
      businessName: "",
      contactPerson: "",
      gstNo: "",
      phone: "",
      address: "",
      selectedItem: "",
      quantity: 1,
      discount: 0,
      paymentTerms: "immediate",
    })
    setIsNewB2BSaleOpen(false)
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "upi":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Banknote className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6">
      <DashboardHeader title="Sales Management" subtitle="Manage B2C and B2B sales transactions" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="b2c" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            B2C (Retail)
          </TabsTrigger>
          <TabsTrigger value="b2b" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
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
                <Dialog open={isNewB2CSaleOpen} onOpenChange={setIsNewB2CSaleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      New B2C Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>New B2C Sale</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Customer Name</Label>
                        <Input
                          value={newB2CSale.customer}
                          onChange={(e) => setNewB2CSale({ ...newB2CSale, customer: e.target.value })}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={newB2CSale.phone}
                          onChange={(e) => setNewB2CSale({ ...newB2CSale, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Select Item</Label>
                        <Select
                          value={newB2CSale.selectedItem}
                          onValueChange={(v) => setNewB2CSale({ ...newB2CSale, selectedItem: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventoryItems.map((item) => (
                              <SelectItem key={item.name} value={item.name}>
                                {item.name} - {formatCurrency(item.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Payment Method</Label>
                        <Select
                          value={newB2CSale.paymentMethod}
                          onValueChange={(v: "cash" | "card" | "upi") =>
                            setNewB2CSale({ ...newB2CSale, paymentMethod: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newB2CSale.selectedItem && (
                        <Card className="bg-muted/50">
                          <CardContent className="p-3">
                            <div className="flex justify-between text-sm">
                              <span>Amount:</span>
                              <span>
                                {formatCurrency(
                                  inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>GST (3%):</span>
                              <span>
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0) * 0.03,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                              <span>Total:</span>
                              <span>
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0) * 1.03,
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewB2CSaleOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddB2CSale}
                        disabled={!newB2CSale.customer || !newB2CSale.phone || !newB2CSale.selectedItem}
                      >
                        Create Sale
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredB2CSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-xs text-muted-foreground">{sale.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{sale.item}</TableCell>
                      <TableCell>{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>{formatCurrency(sale.gst)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getPaymentIcon(sale.paymentMethod)}
                          {sale.paymentMethod.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={sale.status === "completed" ? "default" : "secondary"}
                          className={
                            sale.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <Building2 className="h-5 w-5 text-green-600" />
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
                  <p className="text-2xl font-bold">{b2bSales.filter((s) => s.paymentStatus === "pending").length}</p>
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
                <Dialog open={isNewB2BSaleOpen} onOpenChange={setIsNewB2BSaleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      New B2B Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>New B2B Sale</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Business Name</Label>
                          <Input
                            value={newB2BSale.businessName}
                            onChange={(e) => setNewB2BSale({ ...newB2BSale, businessName: e.target.value })}
                            placeholder="Enter business name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Contact Person</Label>
                          <Input
                            value={newB2BSale.contactPerson}
                            onChange={(e) => setNewB2BSale({ ...newB2BSale, contactPerson: e.target.value })}
                            placeholder="Enter contact person"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>GST Number</Label>
                          <Input
                            value={newB2BSale.gstNo}
                            onChange={(e) => setNewB2BSale({ ...newB2BSale, gstNo: e.target.value })}
                            placeholder="Enter GST number"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Phone Number</Label>
                          <Input
                            value={newB2BSale.phone}
                            onChange={(e) => setNewB2BSale({ ...newB2BSale, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Address</Label>
                        <Input
                          value={newB2BSale.address}
                          onChange={(e) => setNewB2BSale({ ...newB2BSale, address: e.target.value })}
                          placeholder="Enter business address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Select Item</Label>
                          <Select
                            value={newB2BSale.selectedItem}
                            onValueChange={(v) => setNewB2BSale({ ...newB2BSale, selectedItem: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryItems.map((item) => (
                                <SelectItem key={item.name} value={item.name}>
                                  {item.name} - {formatCurrency(item.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min={1}
                            value={newB2BSale.quantity}
                            onChange={(e) =>
                              setNewB2BSale({
                                ...newB2BSale,
                                quantity: Number.parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Discount (%)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={newB2BSale.discount}
                            onChange={(e) =>
                              setNewB2BSale({
                                ...newB2BSale,
                                discount: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Payment Terms</Label>
                          <Select
                            value={newB2BSale.paymentTerms}
                            onValueChange={(v: "immediate" | "15-days" | "30-days" | "45-days") =>
                              setNewB2BSale({ ...newB2BSale, paymentTerms: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate</SelectItem>
                              <SelectItem value="15-days">15 Days</SelectItem>
                              <SelectItem value="30-days">30 Days</SelectItem>
                              <SelectItem value="45-days">45 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {newB2BSale.selectedItem && (
                        <Card className="bg-muted/50">
                          <CardContent className="p-3">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2BSale.selectedItem)?.price || 0) *
                                    newB2BSale.quantity,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-red-600">
                              <span>Discount ({newB2BSale.discount}%):</span>
                              <span>
                                -
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2BSale.selectedItem)?.price || 0) *
                                    newB2BSale.quantity *
                                    (newB2BSale.discount / 100),
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>GST (3%):</span>
                              <span>
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2BSale.selectedItem)?.price || 0) *
                                    newB2BSale.quantity *
                                    (1 - newB2BSale.discount / 100) *
                                    0.03,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                              <span>Total:</span>
                              <span>
                                {formatCurrency(
                                  (inventoryItems.find((i) => i.name === newB2BSale.selectedItem)?.price || 0) *
                                    newB2BSale.quantity *
                                    (1 - newB2BSale.discount / 100) *
                                    1.03,
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewB2BSaleOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddB2BSale}
                        disabled={!newB2BSale.businessName || !newB2BSale.gstNo || !newB2BSale.selectedItem}
                      >
                        Create Sale
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredB2BSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.businessName}</p>
                          <p className="text-xs text-muted-foreground">{sale.gstNo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {sale.items.map((item, idx) => (
                            <p key={idx}>
                              {item.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sale.paymentTerms === "immediate" ? "Immediate" : sale.paymentTerms}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            sale.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : sale.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {sale.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
