import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("profiles").update(body).eq("id", user.id).select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 },
    )
  }
}
