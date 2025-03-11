import { NextResponse } from "next/server";
import { adminDb } from "@/lib/db-admin";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    console.log("[RANK_IMAGE_UPLOAD] Starting image upload request");
    const session = await auth();
    console.log("[RANK_IMAGE_UPLOAD] Auth session:", {
      id: session?.user?.id,
      email: session?.user?.email,
      isAdmin: session?.user?.isAdmin
    });

    if (!session?.user?.isAdmin) {
      console.log("[RANK_IMAGE_UPLOAD] Unauthorized - User is not admin");
      return new NextResponse(
        JSON.stringify({ error: "You must be an admin to upload rank images" }), 
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rankId = formData.get("rankId") as string | null;

    console.log("[RANK_IMAGE_UPLOAD] Received upload request:", {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      rankId
    });

    if (!file || !rankId) {
      console.log("[RANK_IMAGE_UPLOAD] Missing required fields:", { hasFile: !!file, hasRankId: !!rankId });
      return new NextResponse(
        JSON.stringify({ error: "File and rankId are required" }), 
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("[RANK_IMAGE_UPLOAD] Invalid file type:", file.type);
      return new NextResponse(
        JSON.stringify({ error: "Only image files are allowed" }), 
        { status: 400 }
      );
    }

    // Create the rank_images bucket if it doesn't exist
    const { data: buckets } = await adminDb.storage.listBuckets();
    const rankImagesBucket = buckets?.find(b => b.name === 'rank_images');
    
    if (!rankImagesBucket) {
      console.log("[RANK_IMAGE_UPLOAD] Creating rank_images bucket");
      const { error: createBucketError } = await adminDb.storage.createBucket('rank_images', {
        public: true,
        fileSizeLimit: '2MB',
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

      if (createBucketError) {
        console.error("[RANK_IMAGE_UPLOAD] Failed to create bucket:", createBucketError);
        throw createBucketError;
      }
    }

    // Get file extension and create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${rankId}-${Date.now()}.${fileExt}`;

    console.log("[RANK_IMAGE_UPLOAD] Uploading file:", { fileName, bucket: 'rank_images' });

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();

    // Upload to rank_images bucket
    const { data: uploadData, error: uploadError } = await adminDb.storage
      .from('rank_images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("[RANK_IMAGE_UPLOAD] Storage upload error:", uploadError);
      throw uploadError;
    }

    console.log("[RANK_IMAGE_UPLOAD] File uploaded successfully:", uploadData);

    // Get the public URL
    const { data: { publicUrl } } = adminDb.storage
      .from('rank_images')
      .getPublicUrl(fileName);

    console.log("[RANK_IMAGE_UPLOAD] Generated public URL:", publicUrl);

    // Update the rank with the new image URL
    const { error: updateError } = await adminDb
      .from("navy_rank_levels")
      .update({ image_url: publicUrl })
      .eq('id', rankId);

    if (updateError) {
      console.error("[RANK_IMAGE_UPLOAD] Database update error:", updateError);
      throw updateError;
    }

    console.log("[RANK_IMAGE_UPLOAD] Rank updated with new image URL");
    return NextResponse.json({ image_url: publicUrl });
  } catch (error) {
    console.error("[RANK_IMAGE_UPLOAD] Unhandled error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to upload image",
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      }), 
      { status: 500 }
    );
  }
} 