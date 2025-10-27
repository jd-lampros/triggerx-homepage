import { NextRequest, NextResponse } from "next/server";
import { eigenLayerService } from "@/services/eigenLayerService";

/**
 * GET /api/statistics/cache-status
 * Returns cache configuration for debugging
 */
export async function GET(request: NextRequest) {
  try {
    const cacheConfig = eigenLayerService.getCacheConfig();
    return NextResponse.json({
      ...cacheConfig,
      message: "Next.js Data Cache Configuration",
      note: "Cache is managed by Next.js Data Cache with automatic revalidation",
    });
  } catch (error) {
    console.error("Error getting cache config:", error);
    return NextResponse.json(
      {
        error: "Failed to get cache config",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/statistics/refresh
 * Force refresh the cache
 */
export async function POST(request: NextRequest) {
  try {
    const refreshedData = await eigenLayerService.forceRefresh();
    return NextResponse.json({
      message: "Cache refreshed successfully",
      data: refreshedData,
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
