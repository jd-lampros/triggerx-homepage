import { NextRequest, NextResponse } from "next/server";
import { eigenLayerService } from "@/services/eigenLayerService";

/**
 * POST /api/statistics/refresh
 * Force refresh the cache using Next.js revalidation
 */
export async function POST(request: NextRequest) {
  try {
    const refreshedData = await eigenLayerService.forceRefresh();
    return NextResponse.json({
      message: "Cache refreshed successfully using Next.js revalidation",
      data: refreshedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error refreshing cache:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
