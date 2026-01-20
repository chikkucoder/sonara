import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import PrivateSale from "@/lib/models/PrivateSale"
import Girvi from "@/lib/models/Girvi"
import Inventory from "@/lib/models/Inventory"
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
    const saleType = searchParams.get("sale_type")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query: any = { user_id: userId }
    
    if (saleType) {
      query.sale_type = saleType
    }

    if (startDate && endDate) {
      query.sale_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const privateSales = await PrivateSale.find(query).sort({ sale_date: -1, created_at: -1 }).lean()

    return NextResponse.json({ data: privateSales })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch private sales" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()

    // Create private sale
    const privateSale = await PrivateSale.create({
      ...body,
      user_id: userId,
    })

    // Update the source item status
    if (body.source_type === "girvi" && body.item_id) {
      await Girvi.findByIdAndUpdate(body.item_id, {
        status: "sold_private"
      })
    } else if (body.source_type === "inventory" && body.item_id) {
      // Reduce inventory quantity
      await Inventory.findByIdAndUpdate(body.item_id, {
        $inc: { quantity: -1 }
      })
    }

    return NextResponse.json({ data: privateSale })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create private sale" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await PrivateSale.findOneAndDelete({ _id: id, user_id: userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete private sale" },
      { status: 500 },
    )
  }
}
