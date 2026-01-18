import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const user = await User.findById(userId).select("full_name email phone shop_name shop_address gst_no")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      store: {
        name: user.shop_name || "",
        address: user.shop_address || "",
        phone: user.phone || "",
        gst: user.gst_no || "",
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch settings" },
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
    const { profile, store } = body

    const updateData: any = {}

    if (profile) {
      if (profile.name) updateData.full_name = profile.name
      if (profile.phone) updateData.phone = profile.phone
    }

    if (store) {
      if (store.name) updateData.shop_name = store.name
      if (store.address) updateData.shop_address = store.address
      if (store.phone) updateData.phone = store.phone
      if (store.gst) updateData.gst_no = store.gst
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
      "full_name email phone shop_name shop_address gst_no"
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      profile: {
        name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      store: {
        name: user.shop_name,
        address: user.shop_address,
        phone: user.phone,
        gst: user.gst_no,
      },
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update settings" },
      { status: 500 }
    )
  }
}
