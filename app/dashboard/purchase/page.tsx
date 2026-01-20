"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  User,
  Phone,
  MapPin,
  FileText,
  Calendar,
  IndianRupee,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react"

interface PurchaseItem {
  id: number
  supplier_name: string
  supplier_phone: string
  supplier_address: string
  supplier_gst: string
  item_name: string
  category: string
  weight: string
  purity: string
  quantity: number
  rate: number
  total_value: number
  purchase_date: string
  invoice_no: string
  payment_mode: string
  payment_status: string
  location: string
  notes: string
}

interface SupplierStats {
  name: string
  phone: string
  totalPurchases: number
  totalValue: number
  pendingAmount: number
  lastPurchaseDate: string
}

const categories = ["Necklace", "Ring", "Bangles", "Earrings", "Chain", "Pendant", "Bracelet", "Anklet", "Other"]
const purityOptions = ["24K", "22K", "18K", "14K", "10K", "925 Silver", "999 Silver"]

export default function PurchasePage() {
  const { toast } = useToast()
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<PurchaseItem | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [isSupplierDetailOpen, setIsSupplierDetailOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("purchases")
  
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_phone: "",
    supplier_address: "",
    supplier_gst: "",
    supplier_type: "",
    item_name: "",
    category: "",
    item_type: "",
    metal_type: "",
    weight: "",
    gross_weight: "",
    net_weight: "",
    purity: "",
    quantity: "1",
    rate: "",
    total_value: "0",
    purchase_date: new Date().toISOString().split('T')[0],
    invoice_no: "",
    payment_mode: "cash",
    payment_status: "paid",
    due_amount: "",
    due_date: "",
    attachment: null as File | null,
    location: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    
    // Auto-calculate total value
    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(newData.quantity) || 0
      const rate = parseFloat(newData.rate) || 0
      newData.total_value = (qty * rate).toString()
    }
    
    setFormData(newData)
  }

  const handleAddPurchase = async () => {
    // Validation
    if (!formData.supplier_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter supplier name",
        variant: "destructive",
      })
      return
    }
    if (!formData.item_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter item name",
        variant: "destructive",
      })
      return
    }
    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select category",
        variant: "destructive",
      })
      return
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid quantity",
        variant: "destructive",
      })
      return
    }
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid rate",
        variant: "destructive",
      })
      return
    }
    if (formData.supplier_phone && !/^[0-9]{10}$/.test(formData.supplier_phone)) {
      toast({
        title: "Validation Error",
        description: "Please enter valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    try {
      const subtotal = parseFloat(formData.total_value)
      
      const purchasePayload = {
        supplier_name: formData.supplier_name,
        supplier_phone: formData.supplier_phone,
        supplier_address: formData.supplier_address,
        supplier_gst: formData.supplier_gst,
        item_name: formData.item_name,
        category: formData.category,
        weight: parseFloat(formData.weight) || 0,
        purity: formData.purity,
        metal_type: formData.purity ? "GOLD" : undefined,
        quantity: parseFloat(formData.quantity),
        rate_per_unit: parseFloat(formData.rate),
        subtotal: subtotal,
        gst_rate: 3,
        gst_type: "INTRASTATE",
        payment_mode: formData.payment_mode.toUpperCase(),
        amount_paid: formData.payment_status === "paid" ? subtotal * 1.03 : 0, // Including GST
        purchase_date: formData.purchase_date,
        invoice_number: formData.invoice_no,
        location: formData.location,
        notes: formData.notes,
      }

      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchasePayload),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorDetails = data.details?.join("\n") || data.error || "Failed to add purchase"
        toast({
          title: "Purchase Error",
          description: errorDetails,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: data.message || "Purchase added and inventory updated successfully!",
      })
      setIsAddDialogOpen(false)
      resetForm()
      // Refresh purchases list
      fetchPurchases()
    } catch (error) {
      console.error("Add purchase error:", error)
      toast({
        title: "Error",
        description: "Failed to add purchase. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPurchase = async () => {
    if (!editingPurchase) return

    const purchaseId = editingPurchase._id || editingPurchase.id
    
    if (!purchaseId) {
      toast({
        title: "Error",
        description: "Purchase ID is missing. Cannot update.",
        variant: "destructive",
      })
      return
    }

    try {
      const purchasePayload = {
        id: purchaseId,
        payment_status: formData.payment_status,
        payment_mode: formData.payment_mode,
        amount_paid: formData.payment_status === "PAID" ? parseFloat(formData.total_value) : (parseFloat(formData.due_amount) || 0),
        payment_date: formData.purchase_date,
        notes: formData.notes,
        location: formData.location,
        invoice_number: formData.invoice_no,
      }

      const response = await fetch(`/api/purchase`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchasePayload),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Update Error",
          description: data.error || "Failed to update purchase",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Purchase updated successfully!",
      })
      setIsEditDialogOpen(false)
      setEditingPurchase(null)
      resetForm()
      fetchPurchases()
    } catch (error) {
      console.error("Update purchase error:", error)
      toast({
        title: "Error",
        description: "Failed to update purchase. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const openEditDialog = (purchase: any) => {
    console.log("Opening edit dialog with purchase:", purchase)
    console.log("Purchase ID:", purchase._id || purchase.id)
    
    setEditingPurchase(purchase)
    setFormData({
      supplier_name: purchase.supplier_name || "",
      supplier_phone: purchase.supplier_phone || "",
      supplier_address: purchase.supplier_address || "",
      supplier_gst: purchase.supplier_gst || "",
      supplier_type: purchase.supplier_type || "",
      item_name: purchase.item_name || "",
      category: purchase.category || "",
      item_type: purchase.item_type || "",
      metal_type: purchase.metal_type || "",
      weight: purchase.weight?.toString() || "",
      gross_weight: purchase.gross_weight?.toString() || "",
      net_weight: purchase.net_weight?.toString() || "",
      purity: purchase.purity || "",
      quantity: purchase.quantity?.toString() || "1",
      rate: (purchase.rate_per_unit || purchase.rate)?.toString() || "",
      total_value: (purchase.total_value || purchase.subtotal || 0).toString(),
      purchase_date: purchase.purchase_date ? new Date(purchase.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      invoice_no: purchase.invoice_number || purchase.invoice_no || "",
      payment_mode: purchase.payment_mode?.toLowerCase() || "cash",
      payment_status: purchase.payment_status || "paid",
      due_amount: purchase.due_amount?.toString() || "",
      due_date: purchase.due_date ? new Date(purchase.due_date).toISOString().split('T')[0] : "",
      attachment: null,
      location: purchase.location || "",
      notes: purchase.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      supplier_name: "",
      supplier_phone: "",
      supplier_address: "",
      supplier_gst: "",
      supplier_type: "",
      item_name: "",
      category: "",
      item_type: "",
      metal_type: "",
      weight: "",
      gross_weight: "",
      net_weight: "",
      purity: "",
      quantity: "1",
      rate: "",
      total_value: "0",
      purchase_date: new Date().toISOString().split('T')[0],
      invoice_no: "",
      payment_mode: "cash",
      payment_status: "paid",
      due_amount: "",
      due_date: "",
      attachment: null,
      location: "",
      notes: "",
    })
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate supplier stats
  const supplierStats: SupplierStats[] = purchases.reduce((acc, purchase) => {
    const purchaseValue = purchase.total_value || purchase.subtotal || 0
    const existing = acc.find(s => s.name === purchase.supplier_name)
    if (existing) {
      existing.totalPurchases += 1
      existing.totalValue += purchaseValue
      if (purchase.payment_status === "pending" || purchase.payment_status === "partial") {
        existing.pendingAmount += purchaseValue
      }
      if (new Date(purchase.purchase_date) > new Date(existing.lastPurchaseDate)) {
        existing.lastPurchaseDate = purchase.purchase_date
      }
    } else {
      acc.push({
        name: purchase.supplier_name,
        phone: purchase.supplier_phone,
        totalPurchases: 1,
        totalValue: purchaseValue,
        pendingAmount: (purchase.payment_status === "pending" || purchase.payment_status === "partial") ? purchaseValue : 0,
        lastPurchaseDate: purchase.purchase_date,
      })
    }
    return acc
  }, [] as SupplierStats[])

  const supplierPurchases = selectedSupplier
    ? purchases.filter(p => p.supplier_name === selectedSupplier)
    : []

  return (
    <div className="p-8">
      <DashboardHeader
        title="Purchase Management"
        subtitle="Manage purchases and supplier relationships"
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Supplier Report
          </TabsTrigger>
        </TabsList>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="mt-6">
      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by item or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Add New Purchase
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Supplier Information */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2 text-primary text-lg">
                      <User className="h-5 w-5" />
                      Supplier Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier_name" className="flex items-center gap-1">
                          Supplier Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="supplier_name"
                          value={formData.supplier_name}
                          onChange={(e) => handleInputChange("supplier_name", e.target.value)}
                          placeholder="Enter supplier name"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier_phone">Supplier Phone</Label>
                        <Input
                          id="supplier_phone"
                          value={formData.supplier_phone}
                          onChange={(e) => handleInputChange("supplier_phone", e.target.value)}
                          placeholder="10-digit phone number"
                          maxLength={10}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="supplier_address">Supplier Address</Label>
                        <Textarea
                          id="supplier_address"
                          value={formData.supplier_address}
                          onChange={(e) => handleInputChange("supplier_address", e.target.value)}
                          placeholder="Enter supplier address"
                          rows={2}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier_gst">GST Number</Label>
                        <Input
                          id="supplier_gst"
                          value={formData.supplier_gst}
                          onChange={(e) => handleInputChange("supplier_gst", e.target.value)}
                          placeholder="Enter GST number"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoice_no">Invoice Number</Label>
                        <Input
                          id="invoice_no"
                          value={formData.invoice_no}
                          onChange={(e) => handleInputChange("invoice_no", e.target.value)}
                          placeholder="Enter invoice number"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier_type">Supplier Type</Label>
                        <Select value={formData.supplier_type} onValueChange={(v) => handleInputChange("supplier_type", v)}>
                          <SelectTrigger id="supplier_type" className="border-2">
                            <SelectValue placeholder="Select supplier type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUPPLIER">SUPPLIER</SelectItem>
                            <SelectItem value="WHOLESALER">WHOLESALER</SelectItem>
                            <SelectItem value="KARIGAR">KARIGAR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2 text-primary text-lg">
                      <Package className="h-5 w-5" />
                      Product Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="item_name" className="flex items-center gap-1">
                          Item Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="item_name"
                          value={formData.item_name}
                          onChange={(e) => handleInputChange("item_name", e.target.value)}
                          placeholder="Enter item name"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="flex items-center gap-1">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                          <SelectTrigger id="category" className="border-2">
                            <SelectValue placeholder="Select category" />
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
                      <div className="space-y-2">
                        <Label htmlFor="item_type">Item Type</Label>
                        <Select value={formData.item_type} onValueChange={(v) => handleInputChange("item_type", v)}>
                          <SelectTrigger id="item_type" className="border-2">
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RAW">RAW</SelectItem>
                            <SelectItem value="JEWELLERY">JEWELLERY</SelectItem>
                            <SelectItem value="JOBWORK">JOBWORK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metal_type">Metal Type</Label>
                        <Select value={formData.metal_type} onValueChange={(v) => handleInputChange("metal_type", v)}>
                          <SelectTrigger id="metal_type" className="border-2">
                            <SelectValue placeholder="Select metal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gold">Gold</SelectItem>
                            <SelectItem value="Silver">Silver</SelectItem>
                            <SelectItem value="Diamond">Diamond</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purity">Purity</Label>
                        <Select value={formData.purity} onValueChange={(v) => handleInputChange("purity", v)}>
                          <SelectTrigger id="purity" className="border-2">
                            <SelectValue placeholder="Select purity" />
                          </SelectTrigger>
                          <SelectContent>
                            {purityOptions.map((pur) => (
                              <SelectItem key={pur} value={pur}>
                                {pur}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gross_weight">Gross Weight (grams)</Label>
                        <Input
                          id="gross_weight"
                          type="number"
                          step="0.001"
                          value={formData.gross_weight}
                          onChange={(e) => handleInputChange("gross_weight", e.target.value)}
                          placeholder="Enter gross weight"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="net_weight">Net Weight (grams)</Label>
                        <Input
                          id="net_weight"
                          type="number"
                          step="0.001"
                          value={formData.net_weight}
                          onChange={(e) => handleInputChange("net_weight", e.target.value)}
                          placeholder="Enter net weight"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="flex items-center gap-1">
                          Quantity <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange("quantity", e.target.value)}
                          placeholder="Enter quantity"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rate" className="flex items-center gap-1">
                          Rate per gram (₹) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.rate}
                          onChange={(e) => handleInputChange("rate", e.target.value)}
                          placeholder="Enter rate per gram"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="total_value">Total Value (₹)</Label>
                        <Input
                          id="total_value"
                          type="number"
                          value={formData.total_value}
                          readOnly
                          className="bg-muted font-semibold text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment & Other Details */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2 text-primary text-lg">
                      <IndianRupee className="h-5 w-5" />
                      Payment & Other Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchase_date" className="flex items-center gap-1">
                          Purchase Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="purchase_date"
                          type="date"
                          value={formData.purchase_date}
                          onChange={(e) => handleInputChange("purchase_date", e.target.value)}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_mode">Payment Mode</Label>
                        <Select value={formData.payment_mode} onValueChange={(v) => handleInputChange("payment_mode", v)}>
                          <SelectTrigger id="payment_mode" className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_status" className="flex items-center gap-1">
                          Payment Status <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.payment_status} onValueChange={(v) => handleInputChange("payment_status", v)}>
                          <SelectTrigger id="payment_status" className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="e.g., Shelf A, Locker 1"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_amount">Due Amount (₹)</Label>
                        <Input
                          id="due_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.due_amount}
                          onChange={(e) => handleInputChange("due_amount", e.target.value)}
                          placeholder="Enter due amount"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => handleInputChange("due_date", e.target.value)}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="attachment">Attachment (Bill/Invoice)</Label>
                        <Input
                          id="attachment"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setFormData({ ...formData, attachment: file })
                          }}
                          className="border-2"
                        />
                        {formData.attachment && (
                          <p className="text-xs text-muted-foreground">Selected: {formData.attachment.name}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any additional notes..."
                          rows={2}
                          className="border-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPurchase}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Purchase & Update Inventory
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Purchase Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                    <Edit className="h-6 w-6" />
                    Edit Purchase
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Supplier Information */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2 text-primary text-lg">
                      <User className="h-5 w-5" />
                      Supplier Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit_supplier_name">Supplier Name</Label>
                        <Input
                          id="edit_supplier_name"
                          value={formData.supplier_name}
                          onChange={(e) => handleInputChange("supplier_name", e.target.value)}
                          placeholder="Enter supplier name"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_supplier_phone">Supplier Phone</Label>
                        <Input
                          id="edit_supplier_phone"
                          value={formData.supplier_phone}
                          onChange={(e) => handleInputChange("supplier_phone", e.target.value)}
                          placeholder="10-digit phone number"
                          maxLength={10}
                          className="border-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2 text-primary text-lg">
                      <IndianRupee className="h-5 w-5" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit_payment_status" className="flex items-center gap-1">
                          Payment Status <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.payment_status} onValueChange={(v) => handleInputChange("payment_status", v)}>
                          <SelectTrigger id="edit_payment_status" className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="UNPAID">Unpaid</SelectItem>
                            <SelectItem value="PARTIAL">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_payment_mode">Payment Mode</Label>
                        <Select value={formData.payment_mode} onValueChange={(v) => handleInputChange("payment_mode", v)}>
                          <SelectTrigger id="edit_payment_mode" className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_due_amount">Due Amount (₹)</Label>
                        <Input
                          id="edit_due_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.due_amount}
                          onChange={(e) => handleInputChange("due_amount", e.target.value)}
                          placeholder="Enter due amount"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_due_date">Due Date</Label>
                        <Input
                          id="edit_due_date"
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => handleInputChange("due_date", e.target.value)}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit_notes">Notes</Label>
                        <Textarea
                          id="edit_notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any additional notes..."
                          rows={2}
                          className="border-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Purchase Details */}
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold text-lg">Current Purchase Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Item</p>
                        <p className="font-medium">{formData.item_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-medium">₹{formData.total_value}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingPurchase(null)
                    resetForm()
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditPurchase}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Purchase
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Purchase Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Item Details</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No purchases yet</p>
                    <p className="text-sm">Add your first purchase to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>
                      {new Date(purchase.purchase_date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{purchase.supplier_name}</p>
                        <p className="text-xs text-muted-foreground">{purchase.supplier_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{purchase.item_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {purchase.category} • {purchase.purity} • {purchase.weight || 0}g
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{purchase.quantity || 0}</TableCell>
                    <TableCell>₹{(purchase.rate_per_unit || purchase.rate || 0).toLocaleString("en-IN")}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{(purchase.total_value || purchase.subtotal || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={purchase.payment_status === "paid" ? "default" : "secondary"}>
                        {purchase.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(purchase)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
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

        {/* Supplier Report Tab */}
        <TabsContent value="suppliers" className="mt-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Supplier Statistics</h2>
              <div className="space-y-4">
                {supplierStats.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No suppliers yet</p>
                    <p className="text-sm">Add your first purchase to see supplier statistics</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Supplier Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Total Purchases</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Pending Dues</TableHead>
                        <TableHead>Last Purchase</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierStats.map((supplier, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {supplier.phone || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{supplier.totalPurchases || 0}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₹{(supplier.totalValue || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            {(supplier.pendingAmount || 0) > 0 ? (
                              <Badge variant="destructive">
                                ₹{(supplier.pendingAmount || 0).toLocaleString("en-IN")}
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700">Cleared</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(supplier.lastPurchaseDate).toLocaleDateString("en-IN")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSupplier(supplier.name)
                                setIsSupplierDetailOpen(true)
                              }}
                            >
                              View History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supplier Detail Dialog */}
      <Dialog open={isSupplierDetailOpen} onOpenChange={setIsSupplierDetailOpen}>
        <DialogContent className="max-w-[98vw] w-full max-h-[98vh] h-[98vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Supplier Purchase History - {selectedSupplier}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Purchases</p>
                      <p className="text-2xl font-bold">{supplierPurchases.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">
                        ₹{supplierPurchases.reduce((acc, p) => acc + (p.total_value || p.subtotal || 0), 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Dues</p>
                      <p className="text-2xl font-bold">
                        ₹{supplierPurchases.filter(p => p.payment_status === "pending" || p.payment_status === "partial").reduce((acc, p) => acc + (p.total_value || p.subtotal || 0), 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Purchase History Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Item Details</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierPurchases.map((purchase, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {new Date(purchase.purchase_date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{purchase.item_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {purchase.category} • {purchase.purity} • {purchase.weight || 0}g
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{purchase.quantity || 0}</TableCell>
                        <TableCell>₹{(purchase.rate_per_unit || purchase.rate || 0).toLocaleString("en-IN")}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{(purchase.total_value || purchase.subtotal || 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={purchase.payment_status === "paid" ? "default" : "destructive"}>
                            {purchase.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {purchase.invoice_no || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button variant="outline" onClick={() => setIsSupplierDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
