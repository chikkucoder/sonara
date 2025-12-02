"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  Eye,
  Printer,
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Building2,
  User,
  Gavel,
} from "lucide-react"

interface B2CSale {
  id: number
  invoiceNo: string
  customer: string
  phone: string
  items: { name: string; weight: string; price: number }[]
  total: number
  gstAmount: number
  paymentMethod: "cash" | "card" | "upi"
  date: string
  status: "completed" | "pending" | "cancelled"
}

interface B2BSale {
  id: number
  invoiceNo: string
  businessName: string
  contactPerson: string
  gstNo: string
  phone: string
  address: string
  items: { name: string; weight: string; quantity: number; unitPrice: number; totalPrice: number }[]
  subtotal: number
  discount: number
  gstAmount: number
  total: number
  paymentTerms: "immediate" | "15-days" | "30-days" | "45-days"
  paymentStatus: "paid" | "partial" | "unpaid"
  date: string
}

interface PrivateSale {
  id: number
  invoiceNo: string
  customer: string
  phone: string
  girviItemName: string
  girviCustomerName: string
  metalType: string
  weight: string
  purity: string
  originalLoanAmount: number
  sellingPrice: number
  paymentMethod: "cash" | "card" | "upi"
  date: string
  status: "completed" | "pending"
}

const initialB2CSales: B2CSale[] = [
  {
    id: 1,
    invoiceNo: "INV-2024-001",
    customer: "Priya Sharma",
    phone: "9876543210",
    items: [{ name: "Gold Necklace 22K", weight: "45g", price: 270000 }],
    total: 278100,
    gstAmount: 8100,
    paymentMethod: "card",
    date: "2024-12-02",
    status: "completed",
  },
  {
    id: 2,
    invoiceNo: "INV-2024-002",
    customer: "Amit Patel",
    phone: "9876543211",
    items: [
      { name: "Diamond Ring", weight: "8g", price: 110000 },
      { name: "Gold Earrings", weight: "12g", price: 75000 },
    ],
    total: 190550,
    gstAmount: 5550,
    paymentMethod: "upi",
    date: "2024-12-02",
    status: "completed",
  },
  {
    id: 3,
    invoiceNo: "INV-2024-003",
    customer: "Sunita Devi",
    phone: "9876543212",
    items: [{ name: "Silver Anklet Set", weight: "28g", price: 12500 }],
    total: 12875,
    gstAmount: 375,
    paymentMethod: "cash",
    date: "2024-12-01",
    status: "completed",
  },
  {
    id: 4,
    invoiceNo: "INV-2024-004",
    customer: "Rahul Singh",
    phone: "9876543213",
    items: [{ name: "Gold Bangles (Pair)", weight: "32g", price: 195000 }],
    total: 200850,
    gstAmount: 5850,
    paymentMethod: "card",
    date: "2024-12-01",
    status: "pending",
  },
]

const initialB2BSales: B2BSale[] = [
  {
    id: 1,
    invoiceNo: "B2B-2024-001",
    businessName: "Sharma Jewellers Pvt Ltd",
    contactPerson: "Rajesh Sharma",
    gstNo: "27AABCS1234A1Z5",
    phone: "9876543220",
    address: "Shop No. 45, Jewellers Market, Mumbai",
    items: [
      { name: "Gold Chain 22K", weight: "25g", quantity: 10, unitPrice: 150000, totalPrice: 1500000 },
      { name: "Gold Earrings", weight: "12g", quantity: 20, unitPrice: 75000, totalPrice: 1500000 },
    ],
    subtotal: 3000000,
    discount: 150000,
    gstAmount: 85500,
    total: 2935500,
    paymentTerms: "30-days",
    paymentStatus: "partial",
    date: "2024-12-01",
  },
  {
    id: 2,
    invoiceNo: "B2B-2024-002",
    businessName: "Krishna Gold House",
    contactPerson: "Mohan Krishna",
    gstNo: "29AABCK5678B2Z3",
    phone: "9876543221",
    address: "Main Road, Gold Market, Bangalore",
    items: [{ name: "Diamond Ring", weight: "8g", quantity: 15, unitPrice: 110000, totalPrice: 1650000 }],
    subtotal: 1650000,
    discount: 82500,
    gstAmount: 47025,
    total: 1614525,
    paymentTerms: "15-days",
    paymentStatus: "paid",
    date: "2024-11-28",
  },
]

const initialPrivateSales: PrivateSale[] = [
  {
    id: 1,
    invoiceNo: "PVT-2024-001",
    customer: "Manoj Tiwari",
    phone: "9876543230",
    girviItemName: "Gold Chain Heavy",
    girviCustomerName: "Vijay Verma (Forfeited)",
    metalType: "Gold",
    weight: "100g",
    purity: "22K",
    originalLoanAmount: 400000,
    sellingPrice: 520000,
    paymentMethod: "cash",
    date: "2024-12-01",
    status: "completed",
  },
  {
    id: 2,
    invoiceNo: "PVT-2024-002",
    customer: "Ravi Shankar",
    phone: "9876543231",
    girviItemName: "Gold Anklets",
    girviCustomerName: "Meena Kumari (Forfeited)",
    metalType: "Gold",
    weight: "40g",
    purity: "22K",
    originalLoanAmount: 160000,
    sellingPrice: 210000,
    paymentMethod: "upi",
    date: "2024-12-02",
    status: "completed",
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

const auctionedItems = [
  {
    name: "Gold Chain Heavy",
    originalOwner: "Vijay Verma",
    metalType: "Gold",
    weight: "100g",
    purity: "22K",
    loanAmount: 400000,
    estimatedValue: 520000,
  },
  {
    name: "Gold Anklets",
    originalOwner: "Meena Kumari",
    metalType: "Gold",
    weight: "40g",
    purity: "22K",
    loanAmount: 160000,
    estimatedValue: 210000,
  },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("b2c")
  const [b2cSales, setB2cSales] = useState<B2CSale[]>(initialB2CSales)
  const [b2bSales, setB2bSales] = useState<B2BSale[]>(initialB2BSales)
  const [privateSales, setPrivateSales] = useState<PrivateSale[]>(initialPrivateSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isNewB2CSaleOpen, setIsNewB2CSaleOpen] = useState(false)
  const [isNewB2BSaleOpen, setIsNewB2BSaleOpen] = useState(false)
  const [isNewPrivateSaleOpen, setIsNewPrivateSaleOpen] = useState(false)

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

  const [newPrivateSale, setNewPrivateSale] = useState({
    customer: "",
    phone: "",
    selectedAuctionItem: "",
    sellingPrice: 0,
    paymentMethod: "cash" as "cash" | "card" | "upi",
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

  const filteredPrivateSales = privateSales.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.girviItemName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddB2CSale = () => {
    const item = inventoryItems.find((i) => i.name === newB2CSale.selectedItem)
    if (!item || !newB2CSale.customer) return

    const gstAmount = Math.round(item.price * 0.03)
    const sale: B2CSale = {
      id: b2cSales.length + 1,
      invoiceNo: `INV-2024-${String(b2cSales.length + 1).padStart(3, "0")}`,
      customer: newB2CSale.customer,
      phone: newB2CSale.phone,
      items: [{ name: item.name, weight: "N/A", price: item.price }],
      total: item.price + gstAmount,
      gstAmount,
      paymentMethod: newB2CSale.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    }
    setB2cSales([sale, ...b2cSales])
    setIsNewB2CSaleOpen(false)
    setNewB2CSale({ customer: "", phone: "", selectedItem: "", paymentMethod: "cash" })
  }

  const handleAddB2BSale = () => {
    const item = inventoryItems.find((i) => i.name === newB2BSale.selectedItem)
    if (!item || !newB2BSale.businessName) return

    const totalPrice = item.price * newB2BSale.quantity
    const discountAmount = (totalPrice * newB2BSale.discount) / 100
    const subtotal = totalPrice - discountAmount
    const gstAmount = subtotal * 0.03

    const sale: B2BSale = {
      id: b2bSales.length + 1,
      invoiceNo: `B2B-2024-${String(b2bSales.length + 1).padStart(3, "0")}`,
      businessName: newB2BSale.businessName,
      contactPerson: newB2BSale.contactPerson,
      gstNo: newB2BSale.gstNo,
      phone: newB2BSale.phone,
      address: newB2BSale.address,
      items: [{ name: item.name, weight: "N/A", quantity: newB2BSale.quantity, unitPrice: item.price, totalPrice }],
      subtotal: totalPrice,
      discount: discountAmount,
      gstAmount,
      total: subtotal + gstAmount,
      paymentTerms: newB2BSale.paymentTerms,
      paymentStatus: "unpaid",
      date: new Date().toISOString().split("T")[0],
    }
    setB2bSales([sale, ...b2bSales])
    setIsNewB2BSaleOpen(false)
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
  }

  const handleAddPrivateSale = () => {
    const auctionItem = auctionedItems.find((i) => i.name === newPrivateSale.selectedAuctionItem)
    if (!auctionItem || !newPrivateSale.customer) return

    const sale: PrivateSale = {
      id: privateSales.length + 1,
      invoiceNo: `PVT-2024-${String(privateSales.length + 1).padStart(3, "0")}`,
      customer: newPrivateSale.customer,
      phone: newPrivateSale.phone,
      girviItemName: auctionItem.name,
      girviCustomerName: `${auctionItem.originalOwner} (Forfeited)`,
      metalType: auctionItem.metalType,
      weight: auctionItem.weight,
      purity: auctionItem.purity,
      originalLoanAmount: auctionItem.loanAmount,
      sellingPrice: newPrivateSale.sellingPrice || auctionItem.estimatedValue,
      paymentMethod: newPrivateSale.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    }
    setPrivateSales([sale, ...privateSales])
    setIsNewPrivateSaleOpen(false)
    setNewPrivateSale({ customer: "", phone: "", selectedAuctionItem: "", sellingPrice: 0, paymentMethod: "cash" })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount,
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Partial</Badge>
      case "unpaid":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>
      default:
        return null
    }
  }

  const getPaymentBadge = (method: string) => {
    const variants = {
      cash: "bg-blue-100 text-blue-700",
      card: "bg-purple-100 text-purple-700",
      upi: "bg-green-100 text-green-700",
    }
    return (
      <Badge className={`${variants[method as keyof typeof variants]} hover:opacity-90`}>{method.toUpperCase()}</Badge>
    )
  }

  const getPaymentTermsBadge = (terms: string) => {
    const variants: Record<string, string> = {
      immediate: "bg-green-100 text-green-700",
      "15-days": "bg-blue-100 text-blue-700",
      "30-days": "bg-yellow-100 text-yellow-700",
      "45-days": "bg-orange-100 text-orange-700",
    }
    return (
      <Badge className={`${variants[terms]} hover:opacity-90`}>{terms === "immediate" ? "Immediate" : terms}</Badge>
    )
  }

  const todayB2CSales = b2cSales.filter(
    (s) => s.date === new Date().toISOString().split("T")[0] && s.status === "completed",
  )
  const todayB2CTotal = todayB2CSales.reduce((acc, s) => acc + s.total, 0)
  const totalB2BAmount = b2bSales.reduce((acc, s) => acc + s.total, 0)
  const totalPrivateSales = privateSales.reduce((acc, s) => acc + s.sellingPrice, 0)
  const todayPrivateSales = privateSales.filter(
    (s) => s.date === new Date().toISOString().split("T")[0] && s.status === "completed",
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Removed Sidebar component */}
      <main className="pl-64">
        <div className="p-8">
          <DashboardHeader
            title="Sales Management"
            subtitle="Track and manage your B2B, B2C and Private sales transactions"
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="b2c" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                B2C (Retail)
              </TabsTrigger>
              <TabsTrigger value="b2b" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                B2B (Wholesale)
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Private Sale
              </TabsTrigger>
            </TabsList>

            {/* B2C Sales Tab */}
            <TabsContent value="b2c" className="mt-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{"Today's Sales"}</p>
                      <p className="text-2xl font-bold">{formatCurrency(todayB2CTotal)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{"Today's Orders"}</p>
                      <p className="text-2xl font-bold">{todayB2CSales.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold">{new Set(b2cSales.map((s) => s.customer)).size}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total GST Collected</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(b2cSales.reduce((a, s) => a + s.gstAmount, 0))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Actions */}
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
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isNewB2CSaleOpen} onOpenChange={setIsNewB2CSaleOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground">
                          <Plus className="h-4 w-4 mr-2" />
                          New Retail Sale
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-serif">Create New Retail Sale (with GST)</DialogTitle>
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
                                <SelectValue placeholder="Select an item" />
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
                          {newB2CSale.selectedItem && (
                            <div className="p-3 bg-muted rounded-lg text-sm">
                              <p>
                                Price:{" "}
                                {formatCurrency(
                                  inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0,
                                )}
                              </p>
                              <p>
                                GST (3%):{" "}
                                {formatCurrency(
                                  Math.round(
                                    (inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0) * 0.03,
                                  ),
                                )}
                              </p>
                              <p className="font-semibold">
                                Total:{" "}
                                {formatCurrency(
                                  Math.round(
                                    (inventoryItems.find((i) => i.name === newB2CSale.selectedItem)?.price || 0) * 1.03,
                                  ),
                                )}
                              </p>
                            </div>
                          )}
                          <div className="grid gap-2">
                            <Label>Payment Method</Label>
                            <Select
                              value={newB2CSale.paymentMethod}
                              onValueChange={(v) =>
                                setNewB2CSale({ ...newB2CSale, paymentMethod: v as "cash" | "card" | "upi" })
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
                          <Button onClick={handleAddB2CSale} className="w-full mt-2">
                            Create Sale
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* B2C Sales Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>GST</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredB2CSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono text-sm">{sale.invoiceNo}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(sale.date)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sale.customer}</p>
                              <p className="text-xs text-muted-foreground">{sale.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {sale.items.map((item, idx) => (
                              <p key={idx} className="text-sm">
                                {item.name}
                              </p>
                            ))}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatCurrency(sale.gstAmount)}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
                          <TableCell>{getPaymentBadge(sale.paymentMethod)}</TableCell>
                          <TableCell>{getStatusBadge(sale.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* B2B Sales Tab */}
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
                      <p className="text-2xl font-bold">{formatCurrency(totalB2BAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Businesses</p>
                      <p className="text-2xl font-bold">{new Set(b2bSales.map((s) => s.businessName)).size}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Payments</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          b2bSales.filter((s) => s.paymentStatus !== "paid").reduce((a, s) => a + s.total, 0),
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{b2bSales.length}</p>
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
                        placeholder="Search by business or invoice..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isNewB2BSaleOpen} onOpenChange={setIsNewB2BSaleOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground">
                          <Plus className="h-4 w-4 mr-2" />
                          New Wholesale Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-serif">Create Wholesale Order (with GST)</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Business Name</Label>
                              <Input
                                value={newB2BSale.businessName}
                                onChange={(e) => setNewB2BSale({ ...newB2BSale, businessName: e.target.value })}
                                placeholder="Business name"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Contact Person</Label>
                              <Input
                                value={newB2BSale.contactPerson}
                                onChange={(e) => setNewB2BSale({ ...newB2BSale, contactPerson: e.target.value })}
                                placeholder="Contact person"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>GST Number</Label>
                              <Input
                                value={newB2BSale.gstNo}
                                onChange={(e) => setNewB2BSale({ ...newB2BSale, gstNo: e.target.value })}
                                placeholder="27AABCS1234A1Z5"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Phone</Label>
                              <Input
                                value={newB2BSale.phone}
                                onChange={(e) => setNewB2BSale({ ...newB2BSale, phone: e.target.value })}
                                placeholder="Phone number"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Address</Label>
                            <Textarea
                              value={newB2BSale.address}
                              onChange={(e) => setNewB2BSale({ ...newB2BSale, address: e.target.value })}
                              placeholder="Business address"
                              rows={2}
                            />
                          </div>
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
                          <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={newB2BSale.quantity}
                                onChange={(e) =>
                                  setNewB2BSale({ ...newB2BSale, quantity: Number.parseInt(e.target.value) || 1 })
                                }
                                min={1}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Discount (%)</Label>
                              <Input
                                type="number"
                                value={newB2BSale.discount}
                                onChange={(e) =>
                                  setNewB2BSale({ ...newB2BSale, discount: Number.parseInt(e.target.value) || 0 })
                                }
                                min={0}
                                max={100}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Payment Terms</Label>
                              <Select
                                value={newB2BSale.paymentTerms}
                                onValueChange={(v) => setNewB2BSale({ ...newB2BSale, paymentTerms: v as any })}
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
                          <Button onClick={handleAddB2BSale} className="w-full mt-2">
                            Create Order
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* B2B Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>GST No.</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Terms</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredB2BSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono text-sm">{sale.invoiceNo}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(sale.date)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sale.businessName}</p>
                              <p className="text-xs text-muted-foreground">{sale.contactPerson}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{sale.gstNo}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
                          <TableCell>{getPaymentTermsBadge(sale.paymentTerms)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(sale.paymentStatus)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="private" className="mt-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Gavel className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Private Sales</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalPrivateSales)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items Sold</p>
                      <p className="text-2xl font-bold">{privateSales.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Today Sold</p>
                      <p className="text-2xl font-bold">{todayPrivateSales.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Items</p>
                      <p className="text-2xl font-bold">{auctionedItems.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Banner */}
              <Card className="mb-6 border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Gavel className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Private Sale - No GST</p>
                      <p className="text-sm text-purple-600">
                        Yeh section auctioned/forfeited girvi items ke liye hai. In sales pe GST nahi lagta.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by customer or item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Dialog open={isNewPrivateSaleOpen} onOpenChange={setIsNewPrivateSaleOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 text-white hover:bg-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          New Private Sale
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-serif">Create Private Sale (Without GST)</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                              Yeh sale auctioned girvi items ke liye hai - <strong>GST applicable nahi hai</strong>
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Label>Customer Name</Label>
                            <Input
                              value={newPrivateSale.customer}
                              onChange={(e) => setNewPrivateSale({ ...newPrivateSale, customer: e.target.value })}
                              placeholder="Enter customer name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Phone Number</Label>
                            <Input
                              value={newPrivateSale.phone}
                              onChange={(e) => setNewPrivateSale({ ...newPrivateSale, phone: e.target.value })}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Select Auctioned Item</Label>
                            <Select
                              value={newPrivateSale.selectedAuctionItem}
                              onValueChange={(v) => {
                                const item = auctionedItems.find((i) => i.name === v)
                                setNewPrivateSale({
                                  ...newPrivateSale,
                                  selectedAuctionItem: v,
                                  sellingPrice: item?.estimatedValue || 0,
                                })
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select auctioned item" />
                              </SelectTrigger>
                              <SelectContent>
                                {auctionedItems.map((item) => (
                                  <SelectItem key={item.name} value={item.name}>
                                    {item.name} - {item.weight} {item.purity} (Est:{" "}
                                    {formatCurrency(item.estimatedValue)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {newPrivateSale.selectedAuctionItem && (
                            <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                              {(() => {
                                const item = auctionedItems.find((i) => i.name === newPrivateSale.selectedAuctionItem)
                                return item ? (
                                  <>
                                    <p>Original Owner: {item.originalOwner}</p>
                                    <p>
                                      Metal: {item.metalType} | Weight: {item.weight} | Purity: {item.purity}
                                    </p>
                                    <p>Loan Amount: {formatCurrency(item.loanAmount)}</p>
                                  </>
                                ) : null
                              })()}
                            </div>
                          )}
                          <div className="grid gap-2">
                            <Label>Selling Price (₹) - No GST</Label>
                            <Input
                              type="number"
                              value={newPrivateSale.sellingPrice}
                              onChange={(e) =>
                                setNewPrivateSale({
                                  ...newPrivateSale,
                                  sellingPrice: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Payment Method</Label>
                            <Select
                              value={newPrivateSale.paymentMethod}
                              onValueChange={(v) =>
                                setNewPrivateSale({ ...newPrivateSale, paymentMethod: v as "cash" | "card" | "upi" })
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
                          <Button
                            onClick={handleAddPrivateSale}
                            className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                          >
                            Create Private Sale
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Private Sales Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Item Details</TableHead>
                        <TableHead>Original Owner</TableHead>
                        <TableHead>Loan Amt</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrivateSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono text-sm">{sale.invoiceNo}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(sale.date)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sale.customer}</p>
                              <p className="text-xs text-muted-foreground">{sale.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sale.girviItemName}</p>
                              <p className="text-xs text-muted-foreground">
                                {sale.metalType} | {sale.weight} | {sale.purity}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{sale.girviCustomerName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(sale.originalLoanAmount)}
                          </TableCell>
                          <TableCell className="font-semibold text-purple-700">
                            {formatCurrency(sale.sellingPrice)}
                          </TableCell>
                          <TableCell>{getPaymentBadge(sale.paymentMethod)}</TableCell>
                          <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
