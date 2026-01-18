import { requireSuperAdmin } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Shop from "@/lib/models/Shop"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await requireSuperAdmin()
    await dbConnect()

    // Fetch all users with their shop details
    const users = await User.find({}).select("-password").sort({ created_at: -1 }).lean()

    // Fetch shop details for each user
    const usersWithShops = await Promise.all(
      users.map(async (user) => {
        const shop = await Shop.findOne({ user_id: user._id.toString() }).lean()
        return {
          ...user,
          shop_name: shop?.shop_name || null,
          shop_address: shop?.shop_address || null,
          shop_phone: shop?.shop_phone || null,
          shop_gst: shop?.shop_gst || null,
        }
      })
    )

    return NextResponse.json({ users: usersWithShops })
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireSuperAdmin()
    await dbConnect()

    // Get form data
    const body = await request.json()
    const { email, password, full_name, shop_name, shop_address, shop_phone, shop_gst, membership_type } = body

    // Validate required fields
    if (!email || !password || !full_name || !shop_name || !shop_address || !shop_phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Set membership limits based on type
    const membershipLimits: any = {
      free: { max_inventory: 100, max_users: 1 },
      basic: { max_inventory: 500, max_users: 3 },
      premium: { max_inventory: 2000, max_users: 10 },
      enterprise: { max_inventory: 999999, max_users: 999 },
    }

    const limits = membershipLimits[membership_type || "free"]

    // Create new user in MongoDB
    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
      full_name,
      role: "user",
      enabled: true,
      shop_id: shop_name,
      membership_type: membership_type || "free",
      membership_status: "active",
      membership_start_date: new Date(),
      membership_end_date: membership_type === "free" ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      max_inventory: limits.max_inventory,
      max_users: limits.max_users,
      features_enabled: ["inventory", "sales", "reports", "purchase"],
    })

    // Create shop details
    await Shop.create({
      user_id: newUser._id.toString(),
      shop_name,
      shop_address,
      shop_phone,
      shop_gst: shop_gst || null,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
      },
      credentials: { email, password },
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await requireSuperAdmin()
    await dbConnect()

    // Get update data
    const body = await request.json()
    const { userId, enabled, membership_type } = body

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 })
    }

    const updateData: any = {}

    // Update enabled status if provided
    if (enabled !== undefined) {
      updateData.enabled = enabled
    }

    // Update membership if provided
    if (membership_type) {
      const membershipLimits: any = {
        free: { max_inventory: 100, max_users: 1 },
        basic: { max_inventory: 500, max_users: 3 },
        premium: { max_inventory: 2000, max_users: 10 },
        enterprise: { max_inventory: 999999, max_users: 999 },
      }

      const limits = membershipLimits[membership_type]
      updateData.membership_type = membership_type
      updateData.membership_status = "active"
      updateData.max_inventory = limits.max_inventory
      updateData.max_users = limits.max_users
      
      if (membership_type !== "free") {
        updateData.membership_end_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    )
  }
}
      { status: 500 }
    )
  }
}
