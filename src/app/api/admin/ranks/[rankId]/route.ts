import { NextResponse } from "next/server";
import { adminDb } from "@/lib/db-admin";
import { auth } from "@/lib/auth";

type RouteParams = {
  rankId: string
}

type RouteContext = {
  params: Promise<RouteParams>
}

export async function PATCH(
  req: Request,
  context: RouteContext
) {
  try {
    const { rankId } = await context.params;
    console.log("[RANK_UPDATE] Starting PATCH request for rank:", rankId);
    const session = await auth();
    console.log("[RANK_UPDATE] Auth session:", {
      id: session?.user?.id,
      email: session?.user?.email,
      isAdmin: session?.user?.isAdmin
    });

    if (!session?.user?.isAdmin) {
      console.log("[RANK_UPDATE] Unauthorized - User is not admin");
      return new NextResponse(
        JSON.stringify({ error: "You must be an admin to update ranks" }), 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("[RANK_UPDATE] Request body:", body);

    const { name } = body;
    if (!name) {
      console.log("[RANK_UPDATE] Invalid request - missing name");
      return new NextResponse(
        JSON.stringify({ error: "Name is required" }), 
        { status: 400 }
      );
    }

    console.log("[RANK_UPDATE] Attempting to update rank:", { rankId, name });
    const { data: rank, error: updateError } = await adminDb
      .from("navy_rank_levels")
      .update({ name })
      .eq('id', rankId)
      .select()
      .single();

    if (updateError) {
      console.error("[RANK_UPDATE] Database error:", {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });

      if (updateError.code === '42501') {
        return new NextResponse(
          JSON.stringify({ error: "Permission denied - RLS policy prevented update" }), 
          { status: 403 }
        );
      }

      throw updateError;
    }

    if (!rank) {
      console.error("[RANK_UPDATE] No rank found with ID:", rankId);
      return new NextResponse(
        JSON.stringify({ error: "Rank not found" }), 
        { status: 404 }
      );
    }

    console.log("[RANK_UPDATE] Successfully updated rank:", rank);
    return NextResponse.json(rank);
  } catch (error) {
    console.error("[RANK_UPDATE] Unhandled error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to update rank",
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      }), 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { rankId } = await context.params;

    const { error } = await adminDb
      .from("navy_rank_levels")
      .delete()
      .eq('id', rankId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[RANK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 