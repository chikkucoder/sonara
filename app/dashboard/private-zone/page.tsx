"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Diamond, Gavel, FileBarChart, Search, ArrowLeft, ShoppingBag, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Hidden sidebar for private zone
const privateNavigation = [
  { name: "Private Sale", href: "/dashboard/private-zone", icon: Gavel },
  { name: "Private Sale Report", href: "/dashboard/private-zone/report", icon: FileBarChart },
]

function PrivateSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-900 text-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-zinc-700 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <Diamond className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-red-500">Private</h1>
            <p className="text-xs text-zinc-400">Zone</p>
          </div>
        </div>

        {/* Back to Main */}
        <div className="px-3 py-4 border-b border-zinc-700">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {privateNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-red-600/20 text-red-500" : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Warning */}
        <div className="border-t border-zinc-700 p-4">
          <div className="rounded-lg bg-red-600/10 border border-red-600/20 p-3">
            <p className="text-xs text-red-400 text-center">
              Confidential Area
              <br />
              <span className="text-zinc-500">All transactions are private</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Girvi Private Sale Interface
interface GirviItem {
  _id: string
  customer_name: string
  item_name: string
  metal_type: string
  weight: number
  purity: string
  loan_amount: number
  status: string
}

// Normal Inventory Item for Most Private Sale
interface NormalItem {
  _id: string
  item_name: string
  category: string
  metal_type?: string
  weight?: number
  purity?: string
  rate: number
  quantity: number
}

// Private Sale Record
interface PrivateSale {
  _id: string
  sale_type: "girvi" | "most-private"
  item_name: string
  customer_name?: string
  total_amount: number
  sale_date: string
  payment_mode: string
}

export default function PrivateZonePage() {
  const [activeTab, setActiveTab] = useState("girvi")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GirviItem | NormalItem | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // State for data from database
  const [girviItems, setGirviItems] = useState<GirviItem[]>([])
  const [normalItems, setNormalItems] = useState<NormalItem[]>([])
  const [privateSales, setPrivateSales] = useState<PrivateSale[]>([])

  // Fetch Girvi items (auctioned ones)
  useEffect(() => {
    fetchGirviItems()
  }, [])

  // Fetch Normal inventory items
  useEffect(() => {
    fetchNormalItems()
  }, [])

  // Fetch recent private sales
  useEffect(() => {
    fetchPrivateSales()
  }, [])

  const fetchGirviItems = async () => {
    try {
      const response = await fetch("/api/girvi")
      const result = await response.json()
      if (response.ok) {
        // Filter only auctioned or defaulted girvi items
        const auctionedItems = result.data.filter(
          (item: GirviItem) => item.status === "auctioned" || item.status === "defaulted"
        )
        setGirviItems(auctionedItems)
      }
    } catch (error) {
      console.error("Failed to fetch girvi items:", error)
    }
  }

  const fetchNormalItems = async () => {
    try {
      const response = await fetch("/api/inventory/normal")
      const result = await response.json()
      if (response.ok) {
        // Filter items with quantity > 0
        const availableItems = result.data.filter((item: NormalItem) => item.quantity > 0)
        setNormalItems(availableItems)
      }
    } catch (error) {
      console.error("Failed to fetch inventory items:", error)
    }
  }

  const fetchPrivateSales = async () => {
    try {
      const response = await fetch("/api/private-sales")
      const result = await response.json()
      if (response.ok) {
        setPrivateSales(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch private sales:", error)
    }
  }

  // Sale form state
  const [saleForm, setSaleForm] = useState({
    customerName: "",
    salePrice: "",
    paymentMethod: "Cash",
  })

  const handleSale = async () => {
    if (!selectedItem || !saleForm.salePrice) {
      toast({
        title: "Error",
        description: "Please enter sale price",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const isGirvi = "_id" in selectedItem && "loan_amount" in selectedItem
      const itemId = selectedItem._id
      const itemName = "item_name" in selectedItem ? selectedItem.item_name : ""

      const saleData = {
        item_id: itemId,
        source_type: isGirvi ? "girvi" : "inventory",
        sale_type: activeTab === "girvi" ? "girvi" : "most-private",
        item_name: itemName,
        customer_name: saleForm.customerName || "Cash Customer",
        customer_phone: "",
        quantity: 1,
        weight: "weight" in selectedItem ? selectedItem.weight : undefined,
        metal_type: "metal_type" in selectedItem ? selectedItem.metal_type : undefined,
        purity: "purity" in selectedItem ? selectedItem.purity : undefined,
        rate: Number.parseFloat(saleForm.salePrice),
        total_amount: Number.parseFloat(saleForm.salePrice),
        sale_date: new Date().toISOString(),
        payment_mode: saleForm.paymentMethod,
      }

      const response = await fetch("/api/private-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        throw new Error("Failed to create private sale")
      }

      toast({
        title: "Success",
        description: "Private sale completed successfully",
      })

      // Refresh data
      fetchGirviItems()
      fetchNormalItems()
      fetchPrivateSales()

      // Reset form
      setIsDialogOpen(false)
      setSelectedItem(null)
      setSaleForm({ customerName: "", salePrice: "", paymentMethod: "Cash" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete sale",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredGirviItems = girviItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredNormalItems = normalItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <PrivateSidebar />
      <main className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">Private Sale</h1>
            <p className="text-zinc-400 mt-1">Confidential sales without GST documentation</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-zinc-800 border border-zinc-700">
              <TabsTrigger value="girvi" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Gavel className="h-4 w-4 mr-2" />
                Girvi Private Sale
              </TabsTrigger>
              <TabsTrigger
                value="most-private"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Most Private Sale
              </TabsTrigger>
            </TabsList>

            {/* Girvi Private Sale Tab */}
            <TabsContent value="girvi" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white font-serif">Auctioned Girvi Items</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Select auctioned girvi items to sell privately (No GST)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="Search by item or customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead className="text-zinc-400">ID</TableHead>
                          <TableHead className="text-zinc-400">Item</TableHead>
                          <TableHead className="text-zinc-400">Original Customer</TableHead>
                          <TableHead className="text-zinc-400">Metal/Weight</TableHead>
                          <TableHead className="text-zinc-400">Loan Amount</TableHead>
                          <TableHead className="text-zinc-400">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGirviItems.length > 0 ? (
                          filteredGirviItems.map((item) => (
                            <TableRow key={item._id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell className="text-zinc-300 font-mono">{item._id.slice(-6)}</TableCell>
                              <TableCell className="text-white font-medium">{item.item_name}</TableCell>
                              <TableCell className="text-zinc-300">{item.customer_name}</TableCell>
                              <TableCell className="text-zinc-300">
                                {item.metal_type} - {item.weight}g {item.purity && `(${item.purity})`}
                              </TableCell>
                              <TableCell className="text-zinc-300">₹{item.loan_amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Dialog
                                  open={isDialogOpen && selectedItem?._id === item._id}
                                  onOpenChange={(open) => {
                                    setIsDialogOpen(open)
                                    if (open) setSelectedItem(item)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                      <ShoppingBag className="h-4 w-4 mr-1" />
                                      Sell
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-zinc-900 border-zinc-800">
                                    <DialogHeader>
                                      <DialogTitle className="text-white">Private Sale - {item.item_name}</DialogTitle>
                                      <DialogDescription className="text-zinc-400">
                                        This sale will not include GST or official documentation
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                        <p className="text-sm text-zinc-400">Item Details</p>
                                        <p className="text-white font-medium">{item.item_name}</p>
                                        <p className="text-sm text-zinc-400">
                                          {item.metal_type} - {item.weight}g {item.purity && `- ${item.purity}`}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                          Original Loan: ₹{item.loan_amount.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Customer Name (Optional)</Label>
                                        <Input
                                          placeholder="Cash Customer"
                                          value={saleForm.customerName}
                                          onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
                                          className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Sale Price *</Label>
                                        <Input
                                          type="number"
                                          placeholder="Enter sale price"
                                          value={saleForm.salePrice}
                                          onChange={(e) => setSaleForm({ ...saleForm, salePrice: e.target.value })}
                                          className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Payment Method</Label>
                                        <Select
                                          value={saleForm.paymentMethod}
                                          onValueChange={(v) => setSaleForm({ ...saleForm, paymentMethod: v })}
                                        >
                                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="border-zinc-700 text-zinc-300"
                                      >
                                        Cancel
                                      </Button>
                                      <Button onClick={handleSale} disabled={loading} className="bg-red-600 hover:bg-red-700">
                                        {loading ? "Processing..." : "Complete Sale"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                              No auctioned girvi items available for private sale
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Most Private Sale Tab */}
            <TabsContent value="most-private" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white font-serif">Normal Inventory - Private Sale</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Sell normal inventory items privately without GST documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead className="text-zinc-400">ID</TableHead>
                          <TableHead className="text-zinc-400">Item Name</TableHead>
                          <TableHead className="text-zinc-400">Category</TableHead>
                          <TableHead className="text-zinc-400">Metal/Weight</TableHead>
                          <TableHead className="text-zinc-400">Purity</TableHead>
                          <TableHead className="text-zinc-400">Price</TableHead>
                          <TableHead className="text-zinc-400">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNormalItems.length > 0 ? (
                          filteredNormalItems.map((item) => (
                            <TableRow key={item._id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell className="text-zinc-300 font-mono">{item._id.slice(-6)}</TableCell>
                              <TableCell className="text-white font-medium">{item.item_name}</TableCell>
                              <TableCell className="text-zinc-300">{item.category}</TableCell>
                              <TableCell className="text-zinc-300">
                                {item.metal_type || "N/A"} - {item.weight ? `${item.weight}g` : "N/A"}
                              </TableCell>
                              <TableCell className="text-zinc-300">{item.purity || "N/A"}</TableCell>
                              <TableCell className="text-zinc-300">₹{item.rate.toLocaleString()}</TableCell>
                              <TableCell>
                                <Dialog
                                  open={isDialogOpen && selectedItem?._id === item._id}
                                  onOpenChange={(open) => {
                                    setIsDialogOpen(open)
                                    if (open) setSelectedItem(item)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                      <ShoppingBag className="h-4 w-4 mr-1" />
                                      Sell
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-zinc-900 border-zinc-800">
                                    <DialogHeader>
                                      <DialogTitle className="text-white">Private Sale - {item.item_name}</DialogTitle>
                                      <DialogDescription className="text-zinc-400">
                                        This sale will not include GST or official documentation
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                        <p className="text-sm text-zinc-400">Item Details</p>
                                        <p className="text-white font-medium">{item.item_name}</p>
                                        <p className="text-sm text-zinc-400">
                                          {item.metal_type || "N/A"} - {item.weight ? `${item.weight}g` : "N/A"} - {item.purity || "N/A"}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                          Listed Price: ₹{item.rate.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Customer Name (Optional)</Label>
                                        <Input
                                          placeholder="Cash Customer"
                                          value={saleForm.customerName}
                                          onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
                                          className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Sale Price *</Label>
                                        <Input
                                          type="number"
                                          placeholder="Enter sale price"
                                          value={saleForm.salePrice}
                                          onChange={(e) => setSaleForm({ ...saleForm, salePrice: e.target.value })}
                                          className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-zinc-300">Payment Method</Label>
                                        <Select
                                          value={saleForm.paymentMethod}
                                          onValueChange={(v) => setSaleForm({ ...saleForm, paymentMethod: v })}
                                        >
                                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="border-zinc-700 text-zinc-300"
                                      >
                                        Cancel
                                      </Button>
                                      <Button onClick={handleSale} disabled={loading} className="bg-red-600 hover:bg-red-700">
                                        {loading ? "Processing..." : "Complete Sale"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                              No inventory items available for private sale
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Private Sales */}
          <Card className="mt-6 bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white font-serif">Recent Private Sales</CardTitle>
              <CardDescription className="text-zinc-400">Latest confidential transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400">ID</TableHead>
                      <TableHead className="text-zinc-400">Type</TableHead>
                      <TableHead className="text-zinc-400">Item</TableHead>
                      <TableHead className="text-zinc-400">Customer</TableHead>
                      <TableHead className="text-zinc-400">Amount</TableHead>
                      <TableHead className="text-zinc-400">Date</TableHead>
                      <TableHead className="text-zinc-400">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {privateSales.slice(0, 10).map((sale) => (
                      <TableRow key={sale._id} className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableCell className="text-zinc-300 font-mono">{sale._id.slice(-6)}</TableCell>
                        <TableCell>
                          <Badge className={sale.sale_type === "girvi" ? "bg-orange-600" : "bg-purple-600"}>
                            {sale.sale_type === "girvi" ? "Girvi" : "Most Private"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-medium">{sale.item_name}</TableCell>
                        <TableCell className="text-zinc-300">{sale.customer_name || "Cash Customer"}</TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ₹{sale.total_amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-zinc-300">
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-zinc-300">{sale.payment_mode}</TableCell>
                      </TableRow>
                    ))}
                    {privateSales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                          No private sales yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
