import { NextResponse } from "next/server";
import { adminDb } from "@/lib/db-admin";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    console.log("[RANKS_API_GET] Starting GET request");
    const session = await auth();
    console.log("[RANKS_API_GET] Auth session:", {
      id: session?.user?.id,
      email: session?.user?.email,
      isAdmin: session?.user?.isAdmin
    });

    if (!session?.user?.isAdmin) {
      console.log("[RANKS_API_GET] Unauthorized - User is not admin");
      return new NextResponse(
        JSON.stringify({ error: "You must be an admin to access this resource" }), 
        { status: 401 }
      );
    }

    console.log("[RANKS_API_GET] Fetching ranks from database");
    const { data: ranks, error } = await adminDb
      .from("navy_rank_levels")
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("[RANKS_API_GET] Database error:", error);
      throw error;
    }

    console.log("[RANKS_API_GET] Successfully fetched ranks:", ranks);
    return NextResponse.json(ranks);
  } catch (error) {
    console.error("[RANKS_API_GET] Unhandled error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to fetch ranks",
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      }), 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("[RANKS_API_POST] Starting POST request");
    const session = await auth();
    console.log("[RANKS_API_POST] Auth session:", {
      id: session?.user?.id,
      email: session?.user?.email,
      isAdmin: session?.user?.isAdmin
    });

    if (!session?.user?.isAdmin) {
      console.log("[RANKS_API_POST] Unauthorized - User is not admin");
      return new NextResponse(
        JSON.stringify({ error: "You must be an admin to create ranks" }), 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("[RANKS_API_POST] Request body:", body);

    const { name, description, order } = body;
    console.log("[RANKS_API_POST] Extracted data:", { 
      name, 
      description, 
      order,
      nameType: typeof name,
      orderType: typeof order,
      descriptionType: typeof description
    });

    if (!name) {
      console.log("[RANKS_API_POST] Missing name field");
      return new NextResponse(
        JSON.stringify({ error: "Name is required" }), 
        { status: 400 }
      );
    }

    // Ensure order is a number
    const orderNum = Number(order);
    if (isNaN(orderNum)) {
      console.log("[RANKS_API_POST] Invalid order value:", order);
      return new NextResponse(
        JSON.stringify({ error: "Order must be a valid number" }), 
        { status: 400 }
      );
    }

    // First check if a rank with this order already exists
    console.log("[RANKS_API_POST] Checking for existing rank with order:", orderNum);
    const { data: existingRank, error: checkError } = await adminDb
      .from("navy_rank_levels")
      .select('id, name, "order"')
      .eq('"order"', orderNum)
      .maybeSingle();

    if (checkError) {
      console.error("[RANKS_API_POST] Error checking existing rank:", {
        code: checkError.code,
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint
      });
      throw checkError;
    }

    if (existingRank) {
      console.log("[RANKS_API_POST] Rank with this order already exists:", existingRank);
      return new NextResponse(
        JSON.stringify({ error: "A rank with this order already exists" }), 
        { status: 409 }
      );
    }

    // Create the new rank
    console.log("[RANKS_API_POST] Creating new rank with data:", {
      name,
      description: description || '',
      order: orderNum
    });

    const { data: newRank, error: insertError } = await adminDb
      .from("navy_rank_levels")
      .insert({
        name,
        description: description || '',
        "order": orderNum,
        image_url: null
      })
      .select()
      .single();

    if (insertError) {
      console.error("[RANKS_API_POST] Insert error:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });

      if (insertError.code === '23505') {
        return new NextResponse(
          JSON.stringify({ error: "A rank with this name already exists" }), 
          { status: 409 }
        );
      }

      throw insertError;
    }

    if (!newRank) {
      console.error("[RANKS_API_POST] No rank returned after insert");
      throw new Error("No data returned after insert");
    }

    console.log("[RANKS_API_POST] Successfully created rank:", newRank);
    return NextResponse.json(newRank);
  } catch (error) {
    console.error("[RANKS_API_POST] Unhandled error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to create rank",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error instanceof Error ? error.stack : undefined
      }), 
      { status: 500 }
    );
  }
} 