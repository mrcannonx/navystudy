import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { payload, scheduledTime } = await request.json()

    // Store the scheduled notification in the database
    const { error } = await supabase
      .from('scheduled_notifications')
      .insert({
        user_id: user.id,
        payload: payload,
        scheduled_time: scheduledTime,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error("Error scheduling notification:", error)
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error in schedule notification API:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 