import { NextResponse } from "next/server";
import { initializeRanksTable } from "@/lib/db-admin";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: "You must be an admin to initialize the database" }), 
        { status: 401 }
      );
    }

    console.log("[DB_INIT] Starting database initialization...");
    await initializeRanksTable();
    console.log("[DB_INIT] Database initialization completed successfully");

    return NextResponse.json({ 
      success: true,
      message: "Database initialized successfully"
    });
  } catch (error) {
    console.error("[DB_INIT] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to initialize database",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error
      }), 
      { status: 500 }
    );
  }
} 