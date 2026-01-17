"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, TrendingDown, TrendingUp, ArrowRight, Printer, Download } from "lucide-react"

// Sample inventory data with dates
interface InventoryEntry {
  id: number
  date: string
  itemName: string
  category: string
  weight: string
  purity: string
  openingStock: number
  added: number
  sold: number
  closingStock: number
  costPrice: number
}

// Generate sample data
const generateInventoryData = (): InventoryEntry[] => {
  const items = [
    { name: "Gold Necklace Set", category: "Necklace", weight: "45g", purity: "22K", costPrice: 225000 },
    { name: "Diamond Ring", category: "Ring", weight: "8g", purity: "18K", costPrice: 85000 },
    { name: "Gold Bangles (Pair)", category: "Bangles", weight: "32g", purity: "22K", costPrice: 160000 },
    { name: "Gold Earrings", category: "Earrings", weight: "12g", purity: "22K", costPrice: 60000 },
    { name: "Gold Chain 22K", category: "Chain", weight: "25g", purity: "22K", costPrice: 125000 },
    { name: "Silver Anklet Set", category: "Anklet", weight: "28g", purity: "925", costPrice: 8400 },
  ]

  const data: InventoryEntry[] = []
  let id = 1

  // Generate data for last 7 days
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date()
    date.setDate(date.getDate() - dayOffset)
    const dateStr = date.toISOString().split("T")[0]

    items.forEach((item, idx) => {
      // Calculate stock flow
      const baseOpening = 10 + idx * 2
      const previousEntry = data.find((d) => d.itemName === item.name && new Date(d.date) < new Date(dateStr))

      const openingStock = previousEntry ? previousEntry.closingStock : baseOpening
      const added = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
      const sold = Math.floor(Math.random() * 3)
      const closingStock = openingStock + added - sold

      data.push({
        id: id++,
        date: dateStr,
        itemName: item.name,
        category: item.category,
        weight: item.weight,
        purity: item.purity,
        openingStock: Math.max(0, openingStock),
        added,
        sold: Math.min(sold, openingStock + added),
        closingStock: Math.max(0, closingStock),
        costPrice: item.costPrice,
      })
    })
  }

  return data
}

const inventoryData = generateInventoryData()

export default function InventoryReportPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const filteredData = useMemo(() => {
    return inventoryData.filter((entry) => entry.date === selectedDate)
  }, [selectedDate])

  const summary = useMemo(() => {
    const totalOpening = filteredData.reduce((acc, item) => acc + item.openingStock, 0)
    const totalAdded = filteredData.reduce((acc, item) => acc + item.added, 0)
    const totalSold = filteredData.reduce((acc, item) => acc + item.sold, 0)
    const totalClosing = filteredData.reduce((acc, item) => acc + item.closingStock, 0)
    const totalValue = filteredData.reduce((acc, item) => acc + item.closingStock * item.costPrice, 0)

    return { totalOpening, totalAdded, totalSold, totalClosing, totalValue }
  }, [filteredData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount,
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // Get next day's opening (which is today's closing)
  const getNextDayNote = () => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + 1)
    const nextDateStr = nextDate.toISOString().split("T")[0]
    const today = new Date().toISOString().split("T")[0]

    if (nextDateStr <= today) {
      return `Kal (${formatDate(nextDateStr)}) ka Opening Stock = Aaj ka Closing Stock`
    }
    return null
  }

  return (
    <div className="p-8">
      <DashboardHeader title="Inventory Report" subtitle="Date wise inventory opening and closing stock report" />

      {/* Date Selector */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <label className="font-medium">Select Date:</label>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[200px]"
              max={new Date().toISOString().split("T")[0]}
            />
            <div className="flex-1" />
            <Button variant="outline" className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Date Display */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-primary">{formatDate(selectedDate)}</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opening Stock</p>
              <p className="text-2xl font-bold">{summary.totalOpening}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items Added</p>
              <p className="text-2xl font-bold">+{summary.totalAdded}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items Sold</p>
              <p className="text-2xl font-bold">-{summary.totalSold}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Closing Stock</p>
              <p className="text-2xl font-bold">{summary.totalClosing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-bold">₹</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Value</p>
              <p className="text-lg font-bold">{formatCurrency(summary.totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Day Note */}
      {getNextDayNote() && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              <p className="text-blue-700">{getNextDayNote()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-serif">Stock Details - {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Purity</TableHead>
                <TableHead className="text-center bg-blue-50">Opening</TableHead>
                <TableHead className="text-center bg-green-50">Added (+)</TableHead>
                <TableHead className="text-center bg-red-50">Sold (-)</TableHead>
                <TableHead className="text-center bg-amber-50">Closing</TableHead>
                <TableHead className="text-right">Stock Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.itemName}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.weight}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.purity}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold bg-blue-50/50">{entry.openingStock}</TableCell>
                  <TableCell className="text-center bg-green-50/50">
                    {entry.added > 0 ? (
                      <span className="text-green-600 font-semibold">+{entry.added}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center bg-red-50/50">
                    {entry.sold > 0 ? (
                      <span className="text-red-600 font-semibold">-{entry.sold}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-bold bg-amber-50/50">{entry.closingStock}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(entry.closingStock * entry.costPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Summary */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm">
                  Opening Stock: <strong>{summary.totalOpening}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">
                  Added: <strong>+{summary.totalAdded}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">
                  Sold: <strong>-{summary.totalSold}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm">
                  Closing Stock: <strong>{summary.totalClosing}</strong>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Stock Value</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(summary.totalValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
