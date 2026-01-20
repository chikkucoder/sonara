import dbConnect from "@/lib/mongodb"
import PrivateSale from "@/lib/models/PrivateSale"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const saleType = searchParams.get("sale_type")

    let query: any = { user_id: userId }

    if (startDate && endDate) {
      query.sale_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z")
      }
    }

    if (saleType && saleType !== "all") {
      query.sale_type = saleType
    }

    const sales = await PrivateSale.find(query).sort({ sale_date: -1 }).lean()

    // Calculate statistics
    const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0)
    const girviSales = sales.filter(s => s.sale_type === "girvi")
    const mostPrivateSales = sales.filter(s => s.sale_type === "most-private")
    const girviTotal = girviSales.reduce((sum, sale) => sum + sale.total_amount, 0)
    const mostPrivateTotal = mostPrivateSales.reduce((sum, sale) => sum + sale.total_amount, 0)

    return NextResponse.json({
      data: {
        sales,
        statistics: {
          totalSales,
          totalTransactions: sales.length,
          girviSales: {
            total: girviTotal,
            count: girviSales.length
          },
          mostPrivateSales: {
            total: mostPrivateTotal,
            count: mostPrivateSales.length
          }
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch reports" },
      { status: 500 }
    )
  }
}
