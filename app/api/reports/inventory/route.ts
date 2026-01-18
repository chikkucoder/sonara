import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/lib/models/Inventory"
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
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    const selectedDate = new Date(date)

    // Get opening stock (items added before the selected date)
    const openingStock = await Inventory.find({
      user_id: userId,
      created_at: { $lt: selectedDate },
    }).lean()

    // Get items added on the selected date
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const addedItems = await Inventory.find({
      user_id: userId,
      created_at: { $gte: selectedDate, $lt: nextDay },
    }).lean()

    // Get items sold on the selected date
    const soldItems = await Sale.find({
      user_id: userId,
      sale_date: { $gte: selectedDate, $lt: nextDay },
    }).lean()

    return NextResponse.json({
      openingStock: openingStock || [],
      addedItems: addedItems || [],
      soldItems: soldItems || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch inventory report" },
      { status: 500 },
    )
  }
}
