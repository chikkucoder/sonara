import { requireAuth } from "@/lib/auth"
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
    const saleType = searchParams.get("sale_type")

    let query: any = { user_id: userId }
    if (saleType) {
      query.sale_type = saleType
    }

    const privateSales = await PrivateSale.find(query).sort({ created_at: -1 }).lean()

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

    const privateSale = await PrivateSale.create({
      ...body,
      user_id: userId,
    })

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
