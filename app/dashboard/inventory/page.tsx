"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Calendar,
  FileDown,
  BarChart3,
  Bell,
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

interface PurchaseItem {
  supplier_name: string
  item_name: string
  category: string
  purity: string
  purchase_date: string
}





const categories = ["All", "Necklace", "Ring", "Bangles", "Earrings", "Chain", "Pendant", "Anklet"]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
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
    fetchPurchases()
  }, [])

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount,
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="p-8">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between pb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Inventory Stock</h1>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsInventoryReportOpen(true)}
          >
            <BarChart3 className="h-4 w-4" />
            Inventory Report
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="relative bg-transparent">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

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

      {/* Inventory Report Dialog */}
      <Dialog open={isInventoryReportOpen} onOpenChange={setIsInventoryReportOpen}>
        <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !m-0 !p-0 rounded-none border-0 flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Inventory Report - Detailed Analysis
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 px-6">
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
