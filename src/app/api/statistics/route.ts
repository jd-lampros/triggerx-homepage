import { NextResponse } from "next/server";
import { eigenLayerService } from "@/services/eigenLayerService";

export async function GET() {
  try {
    const statistics = await eigenLayerService.getStatistics();
    return NextResponse.json(statistics, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Unexpected error in statistics API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
