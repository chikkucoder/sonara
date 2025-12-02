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
  Filter,
  Edit,
  Trash2,
  Package,
  HandCoins,
  AlertCircle,
  Phone,
  Calendar,
  Percent,
  Gavel,
} from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  weight: string
  purity: string
  quantity: number
  costPrice: number
  sellingPrice: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  inventoryDate: string
}

interface GirviItem {
  id: number
  customerName: string
  customerPhone: string
  customerAddress: string
  aadharNo: string
  itemName: string
  itemType: string
  metalType: "gold" | "silver" | "platinum"
  weight: string
  purity: string
  loanAmount: number
  interestRate: number
  girviDate: string
  dueDate: string
  status: "active" | "redeemed" | "auctioned"
  description: string
}

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Gold Necklace Set",
    category: "Necklace",
    weight: "45g",
    purity: "22K",
    quantity: 12,
    costPrice: 225000,
    sellingPrice: 270000,
    status: "in-stock",
    inventoryDate: "2024-12-01",
  },
  {
    id: 2,
    name: "Diamond Ring",
    category: "Ring",
    weight: "8g",
    purity: "18K",
    quantity: 5,
    costPrice: 85000,
    sellingPrice: 110000,
    status: "low-stock",
    inventoryDate: "2024-12-01",
  },
  {
    id: 3,
    name: "Gold Bangles (Pair)",
    category: "Bangles",
    weight: "32g",
    purity: "22K",
    quantity: 25,
    costPrice: 160000,
    sellingPrice: 195000,
    status: "in-stock",
    inventoryDate: "2024-12-02",
  },
  {
    id: 4,
    name: "Silver Anklet Set",
    category: "Anklet",
    weight: "28g",
    purity: "925",
    quantity: 0,
    costPrice: 8400,
    sellingPrice: 12500,
    status: "out-of-stock",
    inventoryDate: "2024-11-30",
  },
  {
    id: 5,
    name: "Gold Earrings",
    category: "Earrings",
    weight: "12g",
    purity: "22K",
    quantity: 18,
    costPrice: 60000,
    sellingPrice: 75000,
    status: "in-stock",
    inventoryDate: "2024-12-02",
  },
  {
    id: 6,
    name: "Diamond Pendant",
    category: "Pendant",
    weight: "5g",
    purity: "18K",
    quantity: 3,
    costPrice: 125000,
    sellingPrice: 165000,
    status: "low-stock",
    inventoryDate: "2024-12-01",
  },
  {
    id: 7,
    name: "Gold Chain 22K",
    category: "Chain",
    weight: "25g",
    purity: "22K",
    quantity: 8,
    costPrice: 125000,
    sellingPrice: 150000,
    status: "in-stock",
    inventoryDate: "2024-11-29",
  },
  {
    id: 8,
    name: "Silver Ring Set",
    category: "Ring",
    weight: "15g",
    purity: "925",
    quantity: 30,
    costPrice: 4500,
    sellingPrice: 7500,
    status: "in-stock",
    inventoryDate: "2024-12-02",
  },
]

const initialGirviItems: GirviItem[] = [
  {
    id: 1,
    customerName: "Ramesh Kumar",
    customerPhone: "9876543210",
    customerAddress: "123, Gandhi Nagar, Delhi",
    aadharNo: "1234-5678-9012",
    itemName: "Gold Necklace",
    itemType: "Necklace",
    metalType: "gold",
    weight: "50g",
    purity: "22K",
    loanAmount: 200000,
    interestRate: 2,
    girviDate: "2024-10-15",
    dueDate: "2025-04-15",
    status: "active",
    description: "Heavy bridal necklace with kundan work",
  },
  {
    id: 2,
    customerName: "Sunita Devi",
    customerPhone: "9876543211",
    customerAddress: "45, Shanti Nagar, Mumbai",
    aadharNo: "2345-6789-0123",
    itemName: "Gold Bangles (4 pcs)",
    itemType: "Bangles",
    metalType: "gold",
    weight: "80g",
    purity: "22K",
    loanAmount: 320000,
    interestRate: 2.5,
    girviDate: "2024-11-01",
    dueDate: "2025-05-01",
    status: "active",
    description: "Set of 4 traditional bangles",
  },
  {
    id: 3,
    customerName: "Amit Sharma",
    customerPhone: "9876543212",
    customerAddress: "78, Rajendra Nagar, Jaipur",
    aadharNo: "3456-7890-1234",
    itemName: "Silver Utensils Set",
    itemType: "Utensils",
    metalType: "silver",
    weight: "500g",
    purity: "925",
    loanAmount: 25000,
    interestRate: 1.5,
    girviDate: "2024-09-20",
    dueDate: "2025-03-20",
    status: "redeemed",
    description: "Silver thali, glass and bowl set",
  },
  {
    id: 4,
    customerName: "Priya Gupta",
    customerPhone: "9876543213",
    customerAddress: "90, MG Road, Bangalore",
    aadharNo: "4567-8901-2345",
    itemName: "Diamond Earrings",
    itemType: "Earrings",
    metalType: "gold",
    weight: "15g",
    purity: "18K",
    loanAmount: 150000,
    interestRate: 2,
    girviDate: "2024-11-15",
    dueDate: "2025-05-15",
    status: "active",
    description: "Diamond studded jhumka earrings",
  },
  {
    id: 5,
    customerName: "Vijay Verma",
    customerPhone: "9876543214",
    customerAddress: "12, Civil Lines, Lucknow",
    aadharNo: "5678-9012-3456",
    itemName: "Gold Chain Heavy",
    itemType: "Chain",
    metalType: "gold",
    weight: "100g",
    purity: "22K",
    loanAmount: 400000,
    interestRate: 2,
    girviDate: "2024-06-01",
    dueDate: "2024-12-01",
    status: "auctioned",
    description: "Heavy gold chain - due date passed, forfeited",
  },
  {
    id: 6,
    customerName: "Meena Kumari",
    customerPhone: "9876543215",
    customerAddress: "34, Ashok Nagar, Chennai",
    aadharNo: "6789-0123-4567",
    itemName: "Gold Anklets",
    itemType: "Anklet",
    metalType: "gold",
    weight: "40g",
    purity: "22K",
    loanAmount: 160000,
    interestRate: 2.5,
    girviDate: "2024-05-15",
    dueDate: "2024-11-15",
    status: "auctioned",
    description: "Traditional gold anklets - auctioned",
  },
]

const categories = ["All", "Necklace", "Ring", "Bangles", "Earrings", "Chain", "Pendant", "Anklet"]
const girviCategories = [
  "All",
  "Necklace",
  "Bangles",
  "Earrings",
  "Ring",
  "Chain",
  "Utensils",
  "Coins",
  "Anklet",
  "Other",
]

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("normal")
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [girviItems, setGirviItems] = useState<GirviItem[]>(initialGirviItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddGirviOpen, setIsAddGirviOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Necklace",
    weight: "",
    purity: "22K",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    inventoryDate: new Date().toISOString().split("T")[0],
  })

  const [newGirvi, setNewGirvi] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    aadharNo: "",
    itemName: "",
    itemType: "Necklace",
    metalType: "gold" as "gold" | "silver" | "platinum",
    weight: "",
    purity: "22K",
    loanAmount: 0,
    interestRate: 2,
    girviDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    description: "",
  })

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredGirvi = girviItems.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.itemType === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    const status = newItem.quantity === 0 ? "out-of-stock" : newItem.quantity < 5 ? "low-stock" : "in-stock"
    const item: InventoryItem = {
      id: inventory.length + 1,
      ...newItem,
      status,
    }
    setInventory([...inventory, item])
    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "Necklace",
      weight: "",
      purity: "22K",
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      inventoryDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleAddGirvi = () => {
    const item: GirviItem = {
      id: girviItems.length + 1,
      ...newGirvi,
      status: "active",
    }
    setGirviItems([...girviItems, item])
    setIsAddGirviOpen(false)
    setNewGirvi({
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      aadharNo: "",
      itemName: "",
      itemType: "Necklace",
      metalType: "gold",
      weight: "",
      purity: "22K",
      loanAmount: 0,
      interestRate: 2,
      girviDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      description: "",
    })
  }

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const handleDeleteGirvi = (id: number) => {
    setGirviItems(girviItems.filter((item) => item.id !== id))
  }

  const handleRedeemGirvi = (id: number) => {
    setGirviItems(girviItems.map((item) => (item.id === id ? { ...item, status: "redeemed" as const } : item)))
  }

  const handleAuctionGirvi = (id: number) => {
    setGirviItems(girviItems.map((item) => (item.id === id ? { ...item, status: "auctioned" as const } : item)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return null
    }
  }

  const getGirviStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Active</Badge>
      case "redeemed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Redeemed</Badge>
      case "auctioned":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Auctioned</Badge>
      default:
        return null
    }
  }

  const getMetalBadge = (metal: string) => {
    switch (metal) {
      case "gold":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Gold</Badge>
      case "silver":
        return <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Silver</Badge>
      case "platinum":
        return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">Platinum</Badge>
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount,
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  // Calculate girvi stats
  const activeGirvi = girviItems.filter((i) => i.status === "active")
  const auctionedGirvi = girviItems.filter((i) => i.status === "auctioned")
  const totalLoanAmount = activeGirvi.reduce((acc, i) => acc + i.loanAmount, 0)

  return (
    <div className="p-8">
      <DashboardHeader title="Inventory Management" subtitle="Manage your jewelry stock and mortgage items" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="normal" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Normal Inventory
          </TabsTrigger>
          <TabsTrigger value="girvi" className="flex items-center gap-2">
            <HandCoins className="h-4 w-4" />
            Girvi Inventory
          </TabsTrigger>
        </TabsList>

        {/* Normal Inventory Tab */}
        <TabsContent value="normal" className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{inventory.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold">{inventory.filter((i) => i.status === "in-stock").length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">{inventory.filter((i) => i.status === "low-stock").length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today Added</p>
                  <p className="text-2xl font-bold">
                    {inventory.filter((i) => i.inventoryDate === new Date().toISOString().split("T")[0]).length}
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
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif">Add New Item</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Inventory Date</Label>
                        <Input
                          type="date"
                          value={newItem.inventoryDate}
                          onChange={(e) => setNewItem({ ...newItem, inventoryDate: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Item Name</Label>
                        <Input
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Gold Necklace Set"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Select
                            value={newItem.category}
                            onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories
                                .filter((c) => c !== "All")
                                .map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Purity</Label>
                          <Select value={newItem.purity} onValueChange={(v) => setNewItem({ ...newItem, purity: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="24K">24K</SelectItem>
                              <SelectItem value="22K">22K</SelectItem>
                              <SelectItem value="18K">18K</SelectItem>
                              <SelectItem value="925">Silver 925</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Weight</Label>
                          <Input
                            value={newItem.weight}
                            onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                            placeholder="25g"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Cost Price (₹)</Label>
                          <Input
                            type="number"
                            value={newItem.costPrice}
                            onChange={(e) =>
                              setNewItem({ ...newItem, costPrice: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Selling Price (₹)</Label>
                          <Input
                            type="number"
                            value={newItem.sellingPrice}
                            onChange={(e) =>
                              setNewItem({ ...newItem, sellingPrice: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddItem} className="w-full mt-2">
                        Add to Inventory
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table - Added Date Column */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Purity</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(item.inventoryDate)}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.weight}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.purity}</Badge>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Girvi Inventory Tab */}
        <TabsContent value="girvi" className="mt-6">
          {/* Girvi Stats - Added Auctioned count */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HandCoins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Girvi Items</p>
                  <p className="text-2xl font-bold">{girviItems.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold">{activeGirvi.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auctioned Items</p>
                  <p className="text-2xl font-bold">{auctionedGirvi.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Loan Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(totalLoanAmount)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Girvi Filters */}
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {girviCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddGirviOpen} onOpenChange={setIsAddGirviOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      New Girvi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif">Add New Girvi Entry</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Customer Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Customer Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Customer Name</Label>
                            <Input
                              value={newGirvi.customerName}
                              onChange={(e) => setNewGirvi({ ...newGirvi, customerName: e.target.value })}
                              placeholder="Full Name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Phone Number</Label>
                            <Input
                              value={newGirvi.customerPhone}
                              onChange={(e) => setNewGirvi({ ...newGirvi, customerPhone: e.target.value })}
                              placeholder="9876543210"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Address</Label>
                          <Textarea
                            value={newGirvi.customerAddress}
                            onChange={(e) => setNewGirvi({ ...newGirvi, customerAddress: e.target.value })}
                            placeholder="Full address"
                            rows={2}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Aadhar Number</Label>
                          <Input
                            value={newGirvi.aadharNo}
                            onChange={(e) => setNewGirvi({ ...newGirvi, aadharNo: e.target.value })}
                            placeholder="XXXX-XXXX-XXXX"
                          />
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="space-y-3 pt-2 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Item Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Item Name</Label>
                            <Input
                              value={newGirvi.itemName}
                              onChange={(e) => setNewGirvi({ ...newGirvi, itemName: e.target.value })}
                              placeholder="Gold Necklace"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Item Type</Label>
                            <Select
                              value={newGirvi.itemType}
                              onValueChange={(v) => setNewGirvi({ ...newGirvi, itemType: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {girviCategories
                                  .filter((c) => c !== "All")
                                  .map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label>Metal Type</Label>
                            <Select
                              value={newGirvi.metalType}
                              onValueChange={(v) =>
                                setNewGirvi({ ...newGirvi, metalType: v as "gold" | "silver" | "platinum" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="silver">Silver</SelectItem>
                                <SelectItem value="platinum">Platinum</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Weight</Label>
                            <Input
                              value={newGirvi.weight}
                              onChange={(e) => setNewGirvi({ ...newGirvi, weight: e.target.value })}
                              placeholder="50g"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Purity</Label>
                            <Select
                              value={newGirvi.purity}
                              onValueChange={(v) => setNewGirvi({ ...newGirvi, purity: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="24K">24K</SelectItem>
                                <SelectItem value="22K">22K</SelectItem>
                                <SelectItem value="18K">18K</SelectItem>
                                <SelectItem value="925">Silver 925</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newGirvi.description}
                            onChange={(e) => setNewGirvi({ ...newGirvi, description: e.target.value })}
                            placeholder="Detailed description of the item"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Loan Details */}
                      <div className="space-y-3 pt-2 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Loan Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Loan Amount (₹)</Label>
                            <Input
                              type="number"
                              value={newGirvi.loanAmount}
                              onChange={(e) =>
                                setNewGirvi({ ...newGirvi, loanAmount: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Interest Rate (%/month)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={newGirvi.interestRate}
                              onChange={(e) =>
                                setNewGirvi({ ...newGirvi, interestRate: Number.parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Girvi Date</Label>
                            <Input
                              type="date"
                              value={newGirvi.girviDate}
                              onChange={(e) => setNewGirvi({ ...newGirvi, girviDate: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <Input
                              type="date"
                              value={newGirvi.dueDate}
                              onChange={(e) => setNewGirvi({ ...newGirvi, dueDate: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleAddGirvi} className="w-full mt-2">
                        Add Girvi Entry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Girvi Table with Auction button */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Metal</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Loan Amt</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Girvi Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGirvi.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.customerName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {item.customerPhone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground">{item.itemType}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getMetalBadge(item.metalType)}</TableCell>
                      <TableCell>
                        {item.weight} ({item.purity})
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.loanAmount)}</TableCell>
                      <TableCell>{item.interestRate}%/mo</TableCell>
                      <TableCell>{formatDate(item.girviDate)}</TableCell>
                      <TableCell>{formatDate(item.dueDate)}</TableCell>
                      <TableCell>{getGirviStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {item.status === "active" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                onClick={() => handleRedeemGirvi(item.id)}
                              >
                                Redeem
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                onClick={() => handleAuctionGirvi(item.id)}
                              >
                                <Gavel className="h-3 w-3 mr-1" />
                                Auction
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteGirvi(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>
    </div>
  )
}
