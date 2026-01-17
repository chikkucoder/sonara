"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Minus,
  IndianRupee,
  ShoppingCart,
  User,
  Building2,
  CreditCard,
  Smartphone,
  Banknote,
  Trash2,
  Package,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  item_name: string
  category: string
  quantity: number
  available_quantity?: number
  weight?: number
  purity?: string
  rate: number
  total_value: number
  location?: string
}

interface CartItem extends Product {
  cartQuantity: number
}

interface CustomerDetails {
  name: string
  phone: string
  address: string
}

interface BusinessDetails {
  businessName: string
  contactPerson: string
  gstNo: string
  phone: string
  address: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function SalesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("b2c")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(true)

  // B2C Customer Details
  const [b2cCustomer, setB2CCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: "",
  })
  const [b2cPaymentMethod, setB2CPaymentMethod] = useState<"cash" | "card" | "upi">("cash")

  // B2B Business Details
  const [b2bBusiness, setB2BBusiness] = useState<BusinessDetails>({
    businessName: "",
    contactPerson: "",
    gstNo: "",
    phone: "",
    address: "",
  })
  const [b2bPaymentTerms, setB2BPaymentTerms] = useState<"immediate" | "15-days" | "30-days" | "45-days">("immediate")

  // Fetch products from inventory
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Add cache busting to force fresh data
      const response = await fetch(`/api/inventory/normal?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (!response.ok) throw new Error("Failed to fetch inventory")
      const result = await response.json()
      const productsArray = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : []
      setProducts(productsArray)
      setFilteredProducts(productsArray)
    } catch (error) {
      setProducts([])
      setFilteredProducts([])
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return ["All"]
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))]
  }, [products])

  // Filter products
  useEffect(() => {
    let filtered = Array.isArray(products) ? products : []

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter((p) => p.item_name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  // Cart functions
  const addToCart = (product: Product) => {
    const availableQty = product.available_quantity ?? product.quantity
    const existingItem = cart.find((item) => item._id === product._id)
    if (existingItem) {
      if (existingItem.cartQuantity >= availableQty) {
        toast({
          title: "Stock Limit",
          description: "Cannot add more than available quantity",
          variant: "destructive",
        })
        return
      }
      setCart(cart.map((item) => (item._id === product._id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id !== productId))
  }

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p._id === productId)
    const availableQty = product ? (product.available_quantity ?? product.quantity) : 0
    if (product && newQuantity > availableQty) {
      toast({
        title: "Stock Limit",
        description: "Cannot exceed available quantity",
        variant: "destructive",
      })
      return
    }
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map((item) => (item._id === productId ? { ...item, cartQuantity: newQuantity } : item)))
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.rate * item.cartQuantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const afterDiscount = subtotal - discountAmount
  const gst = afterDiscount * 0.03
  const total = afterDiscount + gst

  const handleB2CSale = async () => {
    if (!b2cCustomer.name || !b2cCustomer.phone) {
      toast({
        title: "Validation Error",
        description: "Please enter customer name and phone",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart",
        variant: "destructive",
      })
      return
    }

    try {
      const saleData = {
        customer_type: "B2C",
        customer_name: b2cCustomer.name,
        customer_phone: b2cCustomer.phone,
        customer_address: b2cCustomer.address,
        items: cart.map((item) => ({
          inventory_id: item._id,
          item_name: item.item_name,
          quantity: item.cartQuantity,
          weight: item.weight || 0,
          gold_rate: item.rate,
          making_charges: 0,
          stone_charges: 0,
          discount_percentage: discount,
          gst_rate: 3,
        })),
        gst_type: "INTRASTATE",
        payment_mode: b2cPaymentMethod.toUpperCase(),
        amount_paid: total,
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        let errorMessage = "Failed to create sale"
        try {
          const result = await response.json()
          errorMessage = result.details?.join(", ") || result.error || errorMessage
        } catch (e) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `Sale completed! Invoice: ${result.data?.invoice_number || ""}`,
      })

      // Open bill in new window for printing
      if (result.data?.sale?._id) {
        window.open(`/api/sales/bill?id=${result.data.sale._id}`, '_blank')
      }

      // Reset form
      setCart([])
      setB2CCustomer({ name: "", phone: "", address: "" })
      setDiscount(0)
      fetchProducts()
    } catch (error) {
      console.error("Sale error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive",
      })
    }
  }

  const handleB2BSale = async () => {
    if (!b2bBusiness.businessName || !b2bBusiness.gstNo || !b2bBusiness.phone) {
      toast({
        title: "Validation Error",
        description: "Please enter all business details",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart",
        variant: "destructive",
      })
      return
    }

    try {
      const saleData = {
        customer_type: "B2B",
        customer_name: b2bBusiness.contactPerson || b2bBusiness.businessName,
        customer_phone: b2bBusiness.phone,
        customer_address: b2bBusiness.address,
        customer_gst: b2bBusiness.gstNo,
        business_name: b2bBusiness.businessName,
        contact_person: b2bBusiness.contactPerson,
        payment_terms: b2bPaymentTerms,
        items: cart.map((item) => ({
          inventory_id: item._id,
          item_name: item.item_name,
          quantity: item.cartQuantity,
          weight: item.weight || 0,
          gold_rate: item.rate,
          making_charges: 0,
          stone_charges: 0,
          discount_percentage: discount,
          gst_rate: 3,
        })),
        gst_type: "INTRASTATE",
        payment_mode: "CREDIT",
        amount_paid: 0,
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        let errorMessage = "Failed to create sale"
        try {
          const result = await response.json()
          errorMessage = result.details?.join(", ") || result.error || errorMessage
        } catch (e) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `B2B Sale completed! Invoice: ${result.data?.invoice_number || ""}`,
      })

      // Open bill in new window for printing
      if (result.data?.sale?._id) {
        window.open(`/api/sales/bill?id=${result.data.sale._id}`, '_blank')
      }

      // Reset form
      setCart([])
      setB2BBusiness({ businessName: "", contactPerson: "", gstNo: "", phone: "", address: "" })
      setDiscount(0)
      fetchProducts()
    } catch (error) {
      console.error("Sale error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive",
      })
    }
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
      <div className="mb-6">
        <DashboardHeader title="Sales" subtitle="Create new B2C and B2B sales with product selection" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6" suppressHydrationWarning>
        <TabsList className="grid w-full max-w-md grid-cols-2" suppressHydrationWarning>
          <TabsTrigger value="b2c" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            B2C (Retail)
          </TabsTrigger>
          <TabsTrigger value="b2b" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            B2B (Wholesale)
          </TabsTrigger>
        </TabsList>

        {/* B2C Tab */}
        <TabsContent value="b2c" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Product Catalog */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Filter and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[200px]">
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
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                  <p className="col-span-full text-center text-muted-foreground">Loading products...</p>
                ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground">No products found</p>
                ) : (
                  filteredProducts.map((product) => (
                    <Card key={product._id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{product.item_name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-2 mb-3">
                          {product.purity && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Purity:</span>
                              <span className="font-medium">{product.purity}</span>
                            </div>
                          )}
                          {product.weight && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">{product.weight}g</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <span className={`font-medium ${(product.available_quantity ?? product.quantity) < 5 ? "text-red-600" : "text-green-600"}`}>
                              {product.available_quantity ?? product.quantity} units
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold text-primary text-lg">{formatCurrency(product.rate)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full"
                          disabled={(product.available_quantity ?? product.quantity) === 0}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Section - Cart and Customer Details */}
            <div className="lg:col-span-1 space-y-4">
              {/* Cart */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Cart ({cart.length})</h3>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.item_name}</p>
                              <p className="text-xs text-muted-foreground">{formatCurrency(item.rate)}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)} className="h-6 w-6">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateCartQuantity(item._id, item.cartQuantity - 1)}
                                className="h-7 w-7"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.cartQuantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateCartQuantity(item._id, item.cartQuantity + 1)}
                                className="h-7 w-7"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-sm">{formatCurrency(item.rate * item.cartQuantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm flex-1">Discount (%):</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={discount}
                          onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>GST (3%):</span>
                        <span>{formatCurrency(gst)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">Customer Details</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Name *</Label>
                      <Input
                        value={b2cCustomer.name}
                        onChange={(e) => setB2CCustomer({ ...b2cCustomer, name: e.target.value })}
                        placeholder="Enter customer name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Phone *</Label>
                      <Input
                        value={b2cCustomer.phone}
                        onChange={(e) => setB2CCustomer({ ...b2cCustomer, phone: e.target.value })}
                        placeholder="Enter phone number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Address</Label>
                      <Input
                        value={b2cCustomer.address}
                        onChange={(e) => setB2CCustomer({ ...b2cCustomer, address: e.target.value })}
                        placeholder="Enter address (optional)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Payment Method</Label>
                      <Select value={b2cPaymentMethod} onValueChange={(v: any) => setB2CPaymentMethod(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Cash
                            </div>
                          </SelectItem>
                          <SelectItem value="card">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Card
                            </div>
                          </SelectItem>
                          <SelectItem value="upi">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              UPI
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleB2CSale} className="w-full mt-4" disabled={cart.length === 0}>
                      Complete Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* B2B Tab */}
        <TabsContent value="b2b" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Product Catalog */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Filter and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[200px]">
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
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                  <p className="col-span-full text-center text-muted-foreground">Loading products...</p>
                ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground">No products found</p>
                ) : (
                  filteredProducts.map((product) => (
                    <Card key={product._id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{product.item_name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-2 mb-3">
                          {product.purity && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Purity:</span>
                              <span className="font-medium">{product.purity}</span>
                            </div>
                          )}
                          {product.weight && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">{product.weight}g</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <span className={`font-medium ${(product.available_quantity ?? product.quantity) < 5 ? "text-red-600" : "text-green-600"}`}>
                              {product.available_quantity ?? product.quantity} units
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold text-primary text-lg">{formatCurrency(product.rate)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full"
                          disabled={(product.available_quantity ?? product.quantity) === 0}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Section - Cart and Business Details */}
            <div className="lg:col-span-1 space-y-4">
              {/* Cart */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Cart ({cart.length})</h3>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.item_name}</p>
                              <p className="text-xs text-muted-foreground">{formatCurrency(item.rate)}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)} className="h-6 w-6">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateCartQuantity(item._id, item.cartQuantity - 1)}
                                className="h-7 w-7"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.cartQuantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateCartQuantity(item._id, item.cartQuantity + 1)}
                                className="h-7 w-7"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-sm">{formatCurrency(item.rate * item.cartQuantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm flex-1">Discount (%):</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={discount}
                          onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>GST (3%):</span>
                        <span>{formatCurrency(gst)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">Business Details</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Business Name *</Label>
                      <Input
                        value={b2bBusiness.businessName}
                        onChange={(e) => setB2BBusiness({ ...b2bBusiness, businessName: e.target.value })}
                        placeholder="Enter business name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Contact Person</Label>
                      <Input
                        value={b2bBusiness.contactPerson}
                        onChange={(e) => setB2BBusiness({ ...b2bBusiness, contactPerson: e.target.value })}
                        placeholder="Enter contact person"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">GST Number *</Label>
                      <Input
                        value={b2bBusiness.gstNo}
                        onChange={(e) => setB2BBusiness({ ...b2bBusiness, gstNo: e.target.value })}
                        placeholder="Enter GST number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Phone *</Label>
                      <Input
                        value={b2bBusiness.phone}
                        onChange={(e) => setB2BBusiness({ ...b2bBusiness, phone: e.target.value })}
                        placeholder="Enter phone number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Address</Label>
                      <Input
                        value={b2bBusiness.address}
                        onChange={(e) => setB2BBusiness({ ...b2bBusiness, address: e.target.value })}
                        placeholder="Enter address (optional)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Payment Terms</Label>
                      <Select value={b2bPaymentTerms} onValueChange={(v: any) => setB2BPaymentTerms(v)}>
                        <SelectTrigger className="mt-1">
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
                    <Button onClick={handleB2BSale} className="w-full mt-4" disabled={cart.length === 0}>
                      Complete Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
