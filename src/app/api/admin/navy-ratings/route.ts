import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/db-admin';

// GET handler to fetch all ratings
export async function GET(request: NextRequest) {
  try {
    console.log("[API] Fetching all navy ratings");
    const { data, error } = await adminDb
      .from('navy_ratings')
      .select('*')
      .order('abbreviation', { ascending: true });

    if (error) {
      console.error("[API] Error fetching ratings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API] Unexpected error fetching ratings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler to create a new rating
export async function POST(request: NextRequest) {
  try {
    const ratingData = await request.json();
    console.log("[API] Creating new rating:", ratingData);

    const { data, error } = await adminDb
      .from('navy_ratings')
      .insert(ratingData)
      .select();

    if (error) {
      console.error("[API] Error creating rating:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API] Unexpected error creating rating:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler to update an existing rating
export async function PUT(request: NextRequest) {
  try {
    const { id, ...ratingData } = await request.json();
    console.log("[API] Updating rating with ID:", id, "Data:", ratingData);

    if (!id) {
      return NextResponse.json({ error: "Rating ID is required" }, { status: 400 });
    }

    const { data, error } = await adminDb
      .from('navy_ratings')
      .update(ratingData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("[API] Error updating rating:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API] Unexpected error updating rating:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler to delete a rating
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    console.log("[API] Deleting rating with ID:", id);

    if (!id) {
      return NextResponse.json({ error: "Rating ID is required" }, { status: 400 });
    }

    const { error } = await adminDb
      .from('navy_ratings')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error("[API] Error deleting rating:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API] Unexpected error deleting rating:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}