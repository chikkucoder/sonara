import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if requester is super admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!adminProfile || adminProfile.role !== "super_admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get form data
    const body = await request.json()
    const { email, password, full_name, shop_name, shop_address, shop_phone, shop_gst } = body

    // Validate required fields
    if (!email || !password || !full_name || !shop_name || !shop_address || !shop_phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create user in Supabase Auth using admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) throw createError

    // Update profile with shop details
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name,
        shop_name,
        shop_address,
        shop_phone,
        shop_gst: shop_gst || null,
        role: "user",
        enabled: true,
        created_by: user.id,
      })
      .eq("id", newUser.user.id)

    if (profileError) throw profileError

    return NextResponse.json({
      success: true,
      user: newUser.user,
      credentials: { email, password },
    })
  } catch (error) {
    console.error("[v0] Super admin create user error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Check if requester is super admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!adminProfile || adminProfile.role !== "super_admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get update data
    const body = await request.json()
    const { userId, enabled } = body

    if (!userId || enabled === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user enabled status
    const { error: updateError } = await supabase.from("profiles").update({ enabled }).eq("id", userId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Super admin update user error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 },
    )
  }
}
