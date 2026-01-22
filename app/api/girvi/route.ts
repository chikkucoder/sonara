import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Girvi from "@/lib/models/Girvi"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    // Exclude girvi items that have been sold privately
    const girvi = await Girvi.find({ 
      user_id: userId,
      status: { $ne: "sold_private" } // Exclude private sales
    })
      .sort({ date: -1, created_at: -1 })
      .lean()

    return NextResponse.json({ data: girvi })
  } catch (error) {
    console.error("Error fetching girvi:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch girvi" },
      { status: 500 }
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

    const girvi = await Girvi.create({
      ...body,
      user_id: userId,
    })

    return NextResponse.json({ data: girvi }, { status: 201 })
  } catch (error) {
    console.error("Error creating girvi:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create girvi" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()
    const { _id, ...updateData } = body

    const girvi = await Girvi.findOneAndUpdate(
      { _id, user_id: userId },
      updateData,
      { new: true }
    )

    if (!girvi) {
      return NextResponse.json({ error: "Girvi not found" }, { status: 404 })
    }

    return NextResponse.json({ data: girvi })
  } catch (error) {
    console.error("Error updating girvi:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update girvi" },
      { status: 500 }
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
      return NextResponse.json({ error: "Girvi ID required" }, { status: 400 })
    }

    const girvi = await Girvi.findOneAndDelete({ _id: id, user_id: userId })

    if (!girvi) {
      return NextResponse.json({ error: "Girvi not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Girvi deleted successfully" })
  } catch (error) {
    console.error("Error deleting girvi:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete girvi" },
      { status: 500 }
    )
  }
}
