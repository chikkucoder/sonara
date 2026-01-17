"use client"

import { useState, useEffect } from "react"
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
  FileDown,
  BarChart3,
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
  _id?: string
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

interface PurchaseItem {
  supplier_name: string
  item_name: string
  category: string
  purity: string
  purchase_date: string
}





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
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [girviItems, setGirviItems] = useState<GirviItem[]>([])
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddGirviOpen, setIsAddGirviOpen] = useState(false)
  const [isInventoryReportOpen, setIsInventoryReportOpen] = useState(false)
  const [reportDateFrom, setReportDateFrom] = useState("")
  const [reportDateTo, setReportDateTo] = useState(new Date().toISOString().split("T")[0])
  const [reportCategory, setReportCategory] = useState("All")

  // Fetch inventory from MongoDB
  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory/normal")
      const data = await response.json()
      if (response.ok) {
        // Transform MongoDB data to match component interface
        const transformedData = (data.data || []).map((item: any, index: number) => ({
          id: index + 1,
          name: item.item_name || "",
          category: item.category || "",
          weight: item.weight ? `${item.weight}g` : "",
          purity: item.purity || "",
          quantity: item.quantity || 0,
          costPrice: item.rate || 0,
          sellingPrice: item.total_value || 0,
          status: item.quantity === 0 ? "out-of-stock" : item.quantity < 5 ? "low-stock" : "in-stock",
          inventoryDate: item.inventory_date 
            ? new Date(item.inventory_date).toISOString().split("T")[0] 
            : item.created_at 
            ? new Date(item.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }))
        setInventory(transformedData)
      }
    } catch (error) {
      console.error("Fetch inventory error:", error)
    }
  }

  // Fetch girvi from MongoDB
  const fetchGirvi = async () => {
    try {
      const response = await fetch("/api/inventory/girvi")
      const data = await response.json()
      if (response.ok) {
        // Transform MongoDB data to match component interface
        const transformedData = (data.data || []).map((item: any, index: number) => ({
          id: index + 1,
          _id: item._id,
          customerName: item.customer_name || "",
          customerPhone: item.customer_phone || "",
          customerAddress: item.customer_address || "",
          aadharNo: item.aadhar_no || "",
          itemName: item.item_name || "",
          itemType: item.item_type || "",
          metalType: item.metal_type || "gold",
          weight: item.weight ? `${item.weight}g` : "",
          purity: item.purity || "",
          loanAmount: item.loan_amount || 0,
          interestRate: item.interest_rate || 2,
          girviDate: item.girvi_date ? new Date(item.girvi_date).toISOString().split("T")[0] : "",
          dueDate: item.due_date ? new Date(item.due_date).toISOString().split("T")[0] : "",
          status: item.status || "active",
          description: item.description || "",
        }))
        setGirviItems(transformedData)
      }
    } catch (error) {
      console.error("Fetch girvi error:", error)
    }
  }

  // Fetch purchases from MongoDB
  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchase")
      const data = await response.json()
      if (response.ok) {
        setPurchases(data.data || [])
      }
    } catch (error) {
      console.error("Fetch purchases error:", error)
    }
  }

  useEffect(() => {
    fetchInventory()
    fetchGirvi()
    fetchPurchases()
  }, [])

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

  const handleAddGirvi = async () => {
    try {
      const response = await fetch("/api/inventory/girvi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: newGirvi.customerName,
          customer_phone: newGirvi.customerPhone,
          customer_address: newGirvi.customerAddress,
          aadhar_no: newGirvi.aadharNo,
          item_name: newGirvi.itemName,
          item_type: newGirvi.itemType,
          metal_type: newGirvi.metalType,
          weight: parseFloat(newGirvi.weight) || 0,
          purity: newGirvi.purity,
          loan_amount: newGirvi.loanAmount,
          interest_rate: newGirvi.interestRate,
          girvi_date: newGirvi.girviDate,
          due_date: newGirvi.dueDate,
          description: newGirvi.description,
          status: "active",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to add girvi item")
        return
      }

      alert("Girvi item added successfully!")
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
      // Refresh girvi list
      fetchGirvi()
    } catch (error) {
      console.error("Add girvi error:", error)
      alert("Failed to add girvi item. Please try again.")
    }
  }

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const handleDeleteGirvi = async (id: number) => {
    const item = girviItems.find((i) => i.id === id)
    if (!item?._id) return

    try {
      const response = await fetch("/api/inventory/girvi", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item._id }),
      })

      if (response.ok) {
        alert("Girvi item deleted successfully!")
        fetchGirvi()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete girvi item")
      }
    } catch (error) {
      console.error("Delete girvi error:", error)
      alert("Failed to delete girvi item. Please try again.")
    }
  }

  const handleRedeemGirvi = async (id: number) => {
    const item = girviItems.find((i) => i.id === id)
    if (!item?._id) return

    try {
      const response = await fetch("/api/inventory/girvi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item._id, status: "redeemed" }),
      })

      if (response.ok) {
        alert("Girvi item marked as redeemed!")
        fetchGirvi()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update girvi item")
      }
    } catch (error) {
      console.error("Redeem girvi error:", error)
      alert("Failed to update girvi item. Please try again.")
    }
  }

  const handleAuctionGirvi = async (id: number) => {
    const item = girviItems.find((i) => i.id === id)
    if (!item?._id) return

    try {
      const response = await fetch("/api/inventory/girvi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item._id, status: "auctioned" }),
      })

      if (response.ok) {
        alert("Girvi item marked as auctioned!")
        fetchGirvi()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update girvi item")
      }
    } catch (error) {
      console.error("Auction girvi error:", error)
      alert("Failed to update girvi item. Please try again.")
    }
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
      <DashboardHeader 
        title="Inventory Stock" 
        subtitle="View current inventory - Add items via Purchase section" 
      />

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
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsInventoryReportOpen(true)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Inventory Report
                </Button>
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

      {/* Inventory Report Dialog */}
      <Dialog open={isInventoryReportOpen} onOpenChange={setIsInventoryReportOpen}>
        <DialogContent className="max-w-[98vw] w-full max-h-[98vh] h-[98vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Inventory Report - Detailed Analysis
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={reportDateFrom}
                      onChange={(e) => setReportDateFrom(e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={reportDateTo}
                      onChange={(e) => setReportDateTo(e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={reportCategory} onValueChange={setReportCategory}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        const filteredData = inventory.filter((item) => {
                          const matchesCategory = reportCategory === "All" || item.category === reportCategory
                          if (!reportDateFrom && !reportDateTo) return matchesCategory
                          const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                          const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                          const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                          const matchesDate = itemDate >= fromDate && itemDate <= toDate
                          return matchesCategory && matchesDate
                        })

                        // Generate CSV
                        const headers = [
                          "Date",
                          "Item Name",
                          "Supplier Name",
                          "Purchase Date",
                          "Category",
                          "Weight",
                          "Purity",
                          "Quantity",
                          "Cost Price",
                          "Selling Price",
                          "Total Cost",
                          "Total Value",
                          "Status",
                        ]
                        const csvData = filteredData.map((item) => {
                          const matchingPurchase = purchases.find(
                            (p) =>
                              p.item_name === item.name &&
                              p.category === item.category &&
                              p.purity === item.purity
                          )
                          return [
                            item.inventoryDate,
                            item.name,
                            matchingPurchase?.supplier_name || "N/A",
                            matchingPurchase?.purchase_date ? new Date(matchingPurchase.purchase_date).toLocaleDateString("en-IN") : "N/A",
                            item.category,
                            item.weight,
                            item.purity,
                            item.quantity,
                            item.costPrice,
                            item.sellingPrice,
                            item.costPrice * item.quantity,
                            item.sellingPrice * item.quantity,
                            item.status,
                          ]
                        })

                        const csv = [
                          headers.join(","),
                          ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
                        ].join("\\n")

                        const blob = new Blob([csv], { type: "text/csv" })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`
                        a.click()
                      }}
                      className="gap-2 w-full"
                    >
                      <FileDown className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">
                        {inventory.filter((item) => {
                          const matchesCategory = reportCategory === "All" || item.category === reportCategory
                          if (!reportDateFrom && !reportDateTo) return matchesCategory
                          const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                          const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                          const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                          const matchesDate = itemDate >= fromDate && itemDate <= toDate
                          return matchesCategory && matchesDate
                        }).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Quantity</p>
                      <p className="text-2xl font-bold">
                        {inventory
                          .filter((item) => {
                            const matchesCategory = reportCategory === "All" || item.category === reportCategory
                            if (!reportDateFrom && !reportDateTo) return matchesCategory
                            const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                            const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                            const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                            const matchesDate = itemDate >= fromDate && itemDate <= toDate
                            return matchesCategory && matchesDate
                          })
                          .reduce((acc, item) => acc + item.quantity, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          inventory
                            .filter((item) => {
                              const matchesCategory = reportCategory === "All" || item.category === reportCategory
                              if (!reportDateFrom && !reportDateTo) return matchesCategory
                              const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                              const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                              const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                              const matchesDate = itemDate >= fromDate && itemDate <= toDate
                              return matchesCategory && matchesDate
                            })
                            .reduce((acc, item) => acc + item.costPrice * item.quantity, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Value</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          inventory
                            .filter((item) => {
                              const matchesCategory = reportCategory === "All" || item.category === reportCategory
                              if (!reportDateFrom && !reportDateTo) return matchesCategory
                              const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                              const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                              const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                              const matchesDate = itemDate >= fromDate && itemDate <= toDate
                              return matchesCategory && matchesDate
                            })
                            .reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Report Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date Added</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Purity</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory
                      .filter((item) => {
                        const matchesCategory = reportCategory === "All" || item.category === reportCategory
                        if (!reportDateFrom && !reportDateTo) return matchesCategory
                        const itemDate = item.inventoryDate ? new Date(item.inventoryDate) : new Date()
                        const fromDate = reportDateFrom ? new Date(reportDateFrom) : new Date("2000-01-01")
                        const toDate = reportDateTo ? new Date(reportDateTo) : new Date()
                        const matchesDate = itemDate >= fromDate && itemDate <= toDate
                        return matchesCategory && matchesDate
                      })
                      .map((item) => {
                        // Find matching purchase to get supplier info
                        const matchingPurchase = purchases.find(
                          (p) =>
                            p.item_name === item.name &&
                            p.category === item.category &&
                            p.purity === item.purity
                        )
                        
                        return (
                        <TableRow key={item.id}>
                          <TableCell className="text-sm">{formatDate(item.inventoryDate)}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            {matchingPurchase ? (
                              <div className="text-sm">
                                <p className="font-medium">{matchingPurchase.supplier_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(matchingPurchase.purchase_date).toLocaleDateString("en-IN")}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.weight}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.purity}</Badge>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                          <TableCell>{formatCurrency(item.sellingPrice)}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(item.costPrice * item.quantity)}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(item.sellingPrice * item.quantity)}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
