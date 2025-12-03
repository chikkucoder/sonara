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
  Gavel,
  CreditCard,
  Smartphone,
  Banknote,
  Package,
} from "lucide-react"

// Girvi Private Sale (Auctioned items - No GST)
interface GirviPrivateSale {
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

// Most Private Sale (Normal Inventory - No GST)
interface MostPrivateSale {
  id: number
  invoiceNo: string
  customer: string
  phone: string
  address: string
  itemName: string
  itemCategory: string
  metalType: string
  weight: string
  purity: string
  makingCharges: number
  sellingPrice: number
  paymentMethod: "cash" | "card" | "upi"
  date: string
  status: "completed" | "pending"
  remarks: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Sample Girvi Auctioned Items
const auctionedGirviItems = [
  {
    id: 1,
    name: "Gold Chain Heavy",
    originalOwner: "Vijay Verma",
    metalType: "Gold",
    weight: "100g",
    purity: "22K",
    loanAmount: 400000,
    estimatedValue: 520000,
  },
  {
    id: 2,
    name: "Gold Anklets",
    originalOwner: "Meena Kumari",
    metalType: "Gold",
    weight: "40g",
    purity: "22K",
    loanAmount: 160000,
    estimatedValue: 210000,
  },
  {
    id: 3,
    name: "Gold Bangles Set",
    originalOwner: "Sunita Devi",
    metalType: "Gold",
    weight: "80g",
    purity: "22K",
    loanAmount: 320000,
    estimatedValue: 420000,
  },
]

// Sample Normal Inventory Items
const normalInventoryItems = [
  {
    id: 1,
    name: "Gold Necklace Set",
    category: "Necklace",
    metalType: "Gold",
    weight: "45g",
    purity: "22K",
    makingCharges: 15000,
    price: 270000,
  },
  {
    id: 2,
    name: "Diamond Ring",
    category: "Ring",
    metalType: "Gold",
    weight: "8g",
    purity: "18K",
    makingCharges: 8000,
    price: 110000,
  },
  {
    id: 3,
    name: "Gold Bangles (Pair)",
    category: "Bangles",
    metalType: "Gold",
    weight: "32g",
    purity: "22K",
    makingCharges: 12000,
    price: 195000,
  },
  {
    id: 4,
    name: "Gold Earrings",
    category: "Earrings",
    metalType: "Gold",
    weight: "12g",
    purity: "22K",
    makingCharges: 5000,
    price: 75000,
  },
]

// Initial Girvi Private Sales
const initialGirviSales: GirviPrivateSale[] = [
  {
    id: 1,
    invoiceNo: "GPV-2024-001",
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
]

// Initial Most Private Sales
const initialMostPrivateSales: MostPrivateSale[] = [
  {
    id: 1,
    invoiceNo: "MPV-2024-001",
    customer: "Ravi Kumar",
    phone: "9876543240",
    address: "123, Sector 5, Noida",
    itemName: "Gold Necklace Set",
    itemCategory: "Necklace",
    metalType: "Gold",
    weight: "45g",
    purity: "22K",
    makingCharges: 15000,
    sellingPrice: 265000,
    paymentMethod: "cash",
    date: "2024-12-02",
    status: "completed",
    remarks: "Regular customer - special price",
  },
]

export default function PrivateSalePage() {
  const [activeTab, setActiveTab] = useState("girvi")
  const [girviSales, setGirviSales] = useState<GirviPrivateSale[]>(initialGirviSales)
  const [mostPrivateSales, setMostPrivateSales] = useState<MostPrivateSale[]>(initialMostPrivateSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewGirviSaleOpen, setIsNewGirviSaleOpen] = useState(false)
  const [isNewMostPrivateSaleOpen, setIsNewMostPrivateSaleOpen] = useState(false)

  const [newGirviSale, setNewGirviSale] = useState({
    customer: "",
    phone: "",
    selectedItem: "",
    sellingPrice: 0,
    paymentMethod: "cash" as "cash" | "card" | "upi",
  })

  const [newMostPrivateSale, setNewMostPrivateSale] = useState({
    customer: "",
    phone: "",
    address: "",
    selectedItem: "",
    sellingPrice: 0,
    paymentMethod: "cash" as "cash" | "card" | "upi",
    remarks: "",
  })

  // Filter sales
  const filteredGirviSales = girviSales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMostPrivateSales = mostPrivateSales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculations
  const totalGirviSales = girviSales.reduce((sum, sale) => sum + sale.sellingPrice, 0)
  const totalMostPrivateSales = mostPrivateSales.reduce((sum, sale) => sum + sale.sellingPrice, 0)

  // Handle Add Girvi Private Sale
  const handleAddGirviSale = () => {
    const item = auctionedGirviItems.find((i) => i.name === newGirviSale.selectedItem)
    if (!item) return

    const newSale: GirviPrivateSale = {
      id: girviSales.length + 1,
      invoiceNo: `GPV-2024-${String(girviSales.length + 1).padStart(3, "0")}`,
      customer: newGirviSale.customer,
      phone: newGirviSale.phone,
      girviItemName: item.name,
      girviCustomerName: `${item.originalOwner} (Forfeited)`,
      metalType: item.metalType,
      weight: item.weight,
      purity: item.purity,
      originalLoanAmount: item.loanAmount,
      sellingPrice: newGirviSale.sellingPrice || item.estimatedValue,
      paymentMethod: newGirviSale.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    }

    setGirviSales([newSale, ...girviSales])
    setNewGirviSale({ customer: "", phone: "", selectedItem: "", sellingPrice: 0, paymentMethod: "cash" })
    setIsNewGirviSaleOpen(false)
  }

  // Handle Add Most Private Sale
  const handleAddMostPrivateSale = () => {
    const item = normalInventoryItems.find((i) => i.name === newMostPrivateSale.selectedItem)
    if (!item) return

    const newSale: MostPrivateSale = {
      id: mostPrivateSales.length + 1,
      invoiceNo: `MPV-2024-${String(mostPrivateSales.length + 1).padStart(3, "0")}`,
      customer: newMostPrivateSale.customer,
      phone: newMostPrivateSale.phone,
      address: newMostPrivateSale.address,
      itemName: item.name,
      itemCategory: item.category,
      metalType: item.metalType,
      weight: item.weight,
      purity: item.purity,
      makingCharges: item.makingCharges,
      sellingPrice: newMostPrivateSale.sellingPrice || item.price,
      paymentMethod: newMostPrivateSale.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      remarks: newMostPrivateSale.remarks,
    }

    setMostPrivateSales([newSale, ...mostPrivateSales])
    setNewMostPrivateSale({
      customer: "",
      phone: "",
      address: "",
      selectedItem: "",
      sellingPrice: 0,
      paymentMethod: "cash",
      remarks: "",
    })
    setIsNewMostPrivateSaleOpen(false)
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
      <DashboardHeader title="Private Sale" subtitle="Girvi Auctioned Items & Normal Inventory - Without GST" />

      {/* Info Banner */}
      <Card className="mb-6 border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-800">Private Sale - No GST Applied</p>
              <p className="text-sm text-purple-600">
                Yeh section Girvi ke auctioned items aur Normal Inventory ke private sales ke liye hai. In sales pe GST
                nahi lagta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="girvi" className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            Girvi Private Sale
          </TabsTrigger>
          <TabsTrigger value="most-private" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Most Private Sale
          </TabsTrigger>
        </TabsList>

        {/* Girvi Private Sale Tab */}
        <TabsContent value="girvi" className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Girvi Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalGirviSales)}</p>
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
                  <p className="text-2xl font-bold">{girviSales.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Items</p>
                  <p className="text-2xl font-bold">{auctionedGirviItems.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Sale Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalGirviSales / (girviSales.length || 1))}</p>
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
                <Dialog open={isNewGirviSaleOpen} onOpenChange={setIsNewGirviSaleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 text-white hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Girvi Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>New Girvi Private Sale (No GST)</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Customer Name</Label>
                          <Input
                            value={newGirviSale.customer}
                            onChange={(e) => setNewGirviSale({ ...newGirviSale, customer: e.target.value })}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Phone Number</Label>
                          <Input
                            value={newGirviSale.phone}
                            onChange={(e) => setNewGirviSale({ ...newGirviSale, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Select Auctioned Item</Label>
                        <Select
                          value={newGirviSale.selectedItem}
                          onValueChange={(v) => {
                            const item = auctionedGirviItems.find((i) => i.name === v)
                            setNewGirviSale({
                              ...newGirviSale,
                              selectedItem: v,
                              sellingPrice: item?.estimatedValue || 0,
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select auctioned item" />
                          </SelectTrigger>
                          <SelectContent>
                            {auctionedGirviItems.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                {item.name} - {item.weight} {item.purity} (Est: {formatCurrency(item.estimatedValue)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {newGirviSale.selectedItem && (
                        <Card className="bg-purple-50 border-purple-200">
                          <CardContent className="p-3">
                            {(() => {
                              const item = auctionedGirviItems.find((i) => i.name === newGirviSale.selectedItem)
                              return item ? (
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Original Owner:</span>
                                    <span className="font-medium">{item.originalOwner}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Metal/Purity:</span>
                                    <span className="font-medium">
                                      {item.metalType} - {item.purity}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Weight:</span>
                                    <span className="font-medium">{item.weight}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Original Loan:</span>
                                    <span className="font-medium">{formatCurrency(item.loanAmount)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Estimated Value:</span>
                                    <span className="font-medium">{formatCurrency(item.estimatedValue)}</span>
                                  </div>
                                </div>
                              ) : null
                            })()}
                          </CardContent>
                        </Card>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Selling Price (No GST)</Label>
                          <Input
                            type="number"
                            value={newGirviSale.sellingPrice}
                            onChange={(e) =>
                              setNewGirviSale({
                                ...newGirviSale,
                                sellingPrice: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Enter selling price"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Payment Method</Label>
                          <Select
                            value={newGirviSale.paymentMethod}
                            onValueChange={(v: "cash" | "card" | "upi") =>
                              setNewGirviSale({ ...newGirviSale, paymentMethod: v })
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
                      </div>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Total (No GST):</span>
                            <span>{formatCurrency(newGirviSale.sellingPrice)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewGirviSaleOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddGirviSale}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={
                          !newGirviSale.customer ||
                          !newGirviSale.phone ||
                          !newGirviSale.selectedItem ||
                          !newGirviSale.sellingPrice
                        }
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
                    <TableHead>Girvi Item</TableHead>
                    <TableHead>Original Owner</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGirviSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-xs text-muted-foreground">{sale.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{sale.girviItemName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sale.girviCustomerName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {sale.metalType} - {sale.purity}
                          </p>
                          <p className="text-muted-foreground">{sale.weight}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.originalLoanAmount)}</TableCell>
                      <TableCell className="font-bold text-green-600">{formatCurrency(sale.sellingPrice)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getPaymentIcon(sale.paymentMethod)}
                          {sale.paymentMethod.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.date}</TableCell>
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

        {/* Most Private Sale Tab */}
        <TabsContent value="most-private" className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Most Private Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMostPrivateSales)}</p>
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
                  <p className="text-2xl font-bold">{mostPrivateSales.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Items</p>
                  <p className="text-2xl font-bold">{normalInventoryItems.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Sale Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalMostPrivateSales / (mostPrivateSales.length || 1))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <Card className="mb-6 border-indigo-200 bg-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-800">Most Private Sale - Normal Inventory</p>
                  <p className="text-sm text-indigo-600">
                    Yeh section Normal Inventory items ke private sales ke liye hai - bina GST ke. Regular customers ya
                    special deals ke liye.
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
                    placeholder="Search by customer or invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isNewMostPrivateSaleOpen} onOpenChange={setIsNewMostPrivateSaleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Most Private Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>New Most Private Sale (No GST)</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Customer Name</Label>
                          <Input
                            value={newMostPrivateSale.customer}
                            onChange={(e) => setNewMostPrivateSale({ ...newMostPrivateSale, customer: e.target.value })}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Phone Number</Label>
                          <Input
                            value={newMostPrivateSale.phone}
                            onChange={(e) => setNewMostPrivateSale({ ...newMostPrivateSale, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Address</Label>
                        <Input
                          value={newMostPrivateSale.address}
                          onChange={(e) => setNewMostPrivateSale({ ...newMostPrivateSale, address: e.target.value })}
                          placeholder="Enter customer address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Select Item from Normal Inventory</Label>
                        <Select
                          value={newMostPrivateSale.selectedItem}
                          onValueChange={(v) => {
                            const item = normalInventoryItems.find((i) => i.name === v)
                            setNewMostPrivateSale({
                              ...newMostPrivateSale,
                              selectedItem: v,
                              sellingPrice: item?.price || 0,
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            {normalInventoryItems.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                {item.name} - {item.weight} {item.purity} ({formatCurrency(item.price)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {newMostPrivateSale.selectedItem && (
                        <Card className="bg-indigo-50 border-indigo-200">
                          <CardContent className="p-3">
                            {(() => {
                              const item = normalInventoryItems.find((i) => i.name === newMostPrivateSale.selectedItem)
                              return item ? (
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium">{item.category}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Metal/Purity:</span>
                                    <span className="font-medium">
                                      {item.metalType} - {item.purity}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Weight:</span>
                                    <span className="font-medium">{item.weight}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Making Charges:</span>
                                    <span className="font-medium">{formatCurrency(item.makingCharges)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Regular Price:</span>
                                    <span className="font-medium">{formatCurrency(item.price)}</span>
                                  </div>
                                </div>
                              ) : null
                            })()}
                          </CardContent>
                        </Card>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Selling Price (No GST)</Label>
                          <Input
                            type="number"
                            value={newMostPrivateSale.sellingPrice}
                            onChange={(e) =>
                              setNewMostPrivateSale({
                                ...newMostPrivateSale,
                                sellingPrice: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Enter selling price"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Payment Method</Label>
                          <Select
                            value={newMostPrivateSale.paymentMethod}
                            onValueChange={(v: "cash" | "card" | "upi") =>
                              setNewMostPrivateSale({ ...newMostPrivateSale, paymentMethod: v })
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
                      </div>
                      <div className="grid gap-2">
                        <Label>Remarks (Optional)</Label>
                        <Input
                          value={newMostPrivateSale.remarks}
                          onChange={(e) => setNewMostPrivateSale({ ...newMostPrivateSale, remarks: e.target.value })}
                          placeholder="Enter any remarks..."
                        />
                      </div>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Total (No GST):</span>
                            <span>{formatCurrency(newMostPrivateSale.sellingPrice)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewMostPrivateSaleOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMostPrivateSale}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={
                          !newMostPrivateSale.customer ||
                          !newMostPrivateSale.phone ||
                          !newMostPrivateSale.selectedItem ||
                          !newMostPrivateSale.sellingPrice
                        }
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
                    <TableHead>Details</TableHead>
                    <TableHead>Making Charges</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMostPrivateSales.map((sale) => (
                    <TableRow key={sale.id}>
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
                          <p className="text-xs text-muted-foreground">{sale.itemCategory}</p>
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
                      <TableCell>{formatCurrency(sale.makingCharges)}</TableCell>
                      <TableCell className="font-bold text-green-600">{formatCurrency(sale.sellingPrice)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getPaymentIcon(sale.paymentMethod)}
                          {sale.paymentMethod.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {sale.remarks || "-"}
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
