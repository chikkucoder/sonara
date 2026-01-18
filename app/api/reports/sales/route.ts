import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Sale from "@/lib/models/Sale"
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

    let query: any = { user_id: userId }

    if (startDate || endDate) {
      query.sale_date = {}
      if (startDate) query.sale_date.$gte = new Date(startDate)
      if (endDate) query.sale_date.$lte = new Date(endDate)
    }

    const sales = await Sale.find(query).sort({ sale_date: -1 }).lean()

    return NextResponse.json({ data: sales })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch sales report" },
      { status: 500 },
    )
  }
}
