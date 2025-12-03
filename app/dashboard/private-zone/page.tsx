"use client"

import { useState } from "react"
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
  id: string
  customerName: string
  itemName: string
  metalType: string
  weight: string
  loanAmount: number
  status: "auctioned"
}

// Normal Inventory Item for Most Private Sale
interface NormalItem {
  id: string
  name: string
  category: string
  metalType: string
  weight: string
  purity: string
  price: number
}

// Private Sale Record
interface PrivateSale {
  id: string
  type: "girvi" | "most-private"
  itemName: string
  customerName: string
  salePrice: number
  date: string
  paymentMethod: string
}

export default function PrivateZonePage() {
  const [activeTab, setActiveTab] = useState("girvi")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GirviItem | NormalItem | null>(null)

  // Sample auctioned girvi items
  const [girviItems] = useState<GirviItem[]>([
    {
      id: "G001",
      customerName: "Ramesh Sharma",
      itemName: "Gold Necklace",
      metalType: "Gold",
      weight: "25g",
      loanAmount: 125000,
      status: "auctioned",
    },
    {
      id: "G002",
      customerName: "Sunita Devi",
      itemName: "Gold Bangles (4 pcs)",
      metalType: "Gold",
      weight: "40g",
      loanAmount: 200000,
      status: "auctioned",
    },
    {
      id: "G003",
      customerName: "Mohan Lal",
      itemName: "Diamond Ring",
      metalType: "Gold + Diamond",
      weight: "8g",
      loanAmount: 85000,
      status: "auctioned",
    },
  ])

  // Sample normal inventory items for most private sale
  const [normalItems] = useState<NormalItem[]>([
    {
      id: "N001",
      name: "Gold Chain 22K",
      category: "Chains",
      metalType: "Gold",
      weight: "15g",
      purity: "22K",
      price: 97500,
    },
    {
      id: "N002",
      name: "Silver Anklets",
      category: "Anklets",
      metalType: "Silver",
      weight: "50g",
      purity: "925",
      price: 5000,
    },
    {
      id: "N003",
      name: "Gold Earrings",
      category: "Earrings",
      metalType: "Gold",
      weight: "10g",
      purity: "18K",
      price: 55000,
    },
  ])

  // Private sales records
  const [privateSales, setPrivateSales] = useState<PrivateSale[]>([
    {
      id: "PS001",
      type: "girvi",
      itemName: "Gold Kada",
      customerName: "Cash Customer",
      salePrice: 180000,
      date: "2024-01-10",
      paymentMethod: "Cash",
    },
  ])

  // Sale form state
  const [saleForm, setSaleForm] = useState({
    customerName: "",
    salePrice: "",
    paymentMethod: "Cash",
  })

  const handleSale = () => {
    if (!selectedItem || !saleForm.salePrice) return

    const newSale: PrivateSale = {
      id: `PS${String(privateSales.length + 1).padStart(3, "0")}`,
      type: activeTab === "girvi" ? "girvi" : "most-private",
      itemName: "name" in selectedItem ? selectedItem.name : selectedItem.itemName,
      customerName: saleForm.customerName || "Cash Customer",
      salePrice: Number.parseFloat(saleForm.salePrice),
      date: new Date().toISOString().split("T")[0],
      paymentMethod: saleForm.paymentMethod,
    }

    setPrivateSales([newSale, ...privateSales])
    setIsDialogOpen(false)
    setSelectedItem(null)
    setSaleForm({ customerName: "", salePrice: "", paymentMethod: "Cash" })
  }

  const filteredGirviItems = girviItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredNormalItems = normalItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        {filteredGirviItems.map((item) => (
                          <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="text-zinc-300 font-mono">{item.id}</TableCell>
                            <TableCell className="text-white font-medium">{item.itemName}</TableCell>
                            <TableCell className="text-zinc-300">{item.customerName}</TableCell>
                            <TableCell className="text-zinc-300">
                              {item.metalType} - {item.weight}
                            </TableCell>
                            <TableCell className="text-zinc-300">₹{item.loanAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Dialog
                                open={isDialogOpen && selectedItem?.id === item.id}
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
                                    <DialogTitle className="text-white">Private Sale - {item.itemName}</DialogTitle>
                                    <DialogDescription className="text-zinc-400">
                                      This sale will not include GST or official documentation
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                      <p className="text-sm text-zinc-400">Item Details</p>
                                      <p className="text-white font-medium">{item.itemName}</p>
                                      <p className="text-sm text-zinc-400">
                                        {item.metalType} - {item.weight}
                                      </p>
                                      <p className="text-sm text-zinc-400">
                                        Original Loan: ₹{item.loanAmount.toLocaleString()}
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
                                    <Button onClick={handleSale} className="bg-red-600 hover:bg-red-700">
                                      Complete Sale
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
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
                        {filteredNormalItems.map((item) => (
                          <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="text-zinc-300 font-mono">{item.id}</TableCell>
                            <TableCell className="text-white font-medium">{item.name}</TableCell>
                            <TableCell className="text-zinc-300">{item.category}</TableCell>
                            <TableCell className="text-zinc-300">
                              {item.metalType} - {item.weight}
                            </TableCell>
                            <TableCell className="text-zinc-300">{item.purity}</TableCell>
                            <TableCell className="text-zinc-300">₹{item.price.toLocaleString()}</TableCell>
                            <TableCell>
                              <Dialog
                                open={isDialogOpen && selectedItem?.id === item.id}
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
                                    <DialogTitle className="text-white">Private Sale - {item.name}</DialogTitle>
                                    <DialogDescription className="text-zinc-400">
                                      This sale will not include GST or official documentation
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                      <p className="text-sm text-zinc-400">Item Details</p>
                                      <p className="text-white font-medium">{item.name}</p>
                                      <p className="text-sm text-zinc-400">
                                        {item.metalType} - {item.weight} - {item.purity}
                                      </p>
                                      <p className="text-sm text-zinc-400">
                                        Listed Price: ₹{item.price.toLocaleString()}
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
                                    <Button onClick={handleSale} className="bg-red-600 hover:bg-red-700">
                                      Complete Sale
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
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
                    {privateSales.map((sale) => (
                      <TableRow key={sale.id} className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableCell className="text-zinc-300 font-mono">{sale.id}</TableCell>
                        <TableCell>
                          <Badge className={sale.type === "girvi" ? "bg-orange-600" : "bg-purple-600"}>
                            {sale.type === "girvi" ? "Girvi" : "Most Private"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-medium">{sale.itemName}</TableCell>
                        <TableCell className="text-zinc-300">{sale.customerName}</TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ₹{sale.salePrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-zinc-300">{sale.date}</TableCell>
                        <TableCell className="text-zinc-300">{sale.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
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
