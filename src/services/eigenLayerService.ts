import { EigenLayerResponse, StatisticsData } from "@/types/eigenlayer";
import { cache } from "react";
import { ethPriceService } from "./ethPriceService";
import { promises as fs } from "fs";
import path from "path";

class EigenLayerService {
  private readonly AVS_ADDRESS = "0x875B5ff698B74B26f39C223c4996871F28AcDdea";
  private readonly API_BASE_URL = "https://api.eigenexplorer.com";
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private readonly CACHE_FILE_PATH = path.join(
    process.cwd(),
    ".cache",
    "eigenlayer-last-fetch.json"
  );

  /**
   * Save last successfully fetched statistics to persistent storage
   */
  private async saveLastFetchedData(data: StatisticsData): Promise<void> {
    try {
      // Ensure cache directory exists
      const cacheDir = path.dirname(this.CACHE_FILE_PATH);
      await fs.mkdir(cacheDir, { recursive: true });

      // Save data to file
      await fs.writeFile(this.CACHE_FILE_PATH, JSON.stringify(data, null, 2));
      console.log("Successfully saved last fetched statistics to cache");
    } catch (error) {
      console.warn("Failed to save last fetched statistics:", error);
      // Don't throw error - this is not critical for the main functionality
    }
  }

  /**
   * Load last successfully fetched statistics from persistent storage
   */
  private async loadLastFetchedData(): Promise<StatisticsData | null> {
    try {
      const data = await fs.readFile(this.CACHE_FILE_PATH, "utf-8");
      const parsedData = JSON.parse(data) as StatisticsData;

      // Validate that the data has the required fields
      if (
        parsedData &&
        typeof parsedData.totalStakers === "number" &&
        typeof parsedData.totalOperators === "number" &&
        typeof parsedData.tvl === "number" &&
        typeof parsedData.tvlUSD === "number" &&
        typeof parsedData.ethPriceUSD === "number" &&
        typeof parsedData.lastUpdated === "string"
      ) {
        console.log("Successfully loaded last fetched statistics from cache");
        return parsedData;
      } else {
        console.warn("Invalid cached data format, ignoring");
        return null;
      }
    } catch (error) {
      console.log("No cached data found or failed to load:", error);
      return null;
    }
  }

  /**
   * Get cache timing from environment variable in seconds
   */
  private getCacheTimingInSeconds(): number {
    const cacheTiming = process.env.CACHE_TIMING;
    if (!cacheTiming) {
      console.warn("CACHE_TIMING not set, using default 5 minutes");
      return 300; // 5 minutes default in seconds
    }

    const parsed = parseInt(cacheTiming, 10);
    if (isNaN(parsed) || parsed < 0) {
      console.warn("Invalid CACHE_TIMING value, using default 5 minutes");
      return 300;
    }

    // Convert milliseconds to seconds for Next.js cache
    return Math.floor(parsed / 1000);
  }

  /**
   * Fetch data from EigenLayer API with Next.js caching
   */
  private fetchFromAPI = cache(async (): Promise<EigenLayerResponse> => {
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
      throw new Error("API_TOKEN environment variable is not set");
    }

    const url = `${this.API_BASE_URL}/avs/${this.AVS_ADDRESS}?withTvl=true&withCuratedMetadata=false&withRewards=false`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.REQUEST_TIMEOUT
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Token": apiToken,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        next: {
          revalidate: this.getCacheTimingInSeconds(),
          tags: ["eigenlayer-statistics"],
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  });

  /**
   * Format raw API data into statistics format with USD conversion
   */
  private async formatStatisticsData(
    data: EigenLayerResponse
  ): Promise<StatisticsData> {
    const ethPriceUSD = await ethPriceService.getETHPriceUSD();
    const tvlUSD = data.tvl.tvl * ethPriceUSD;

    const statisticsData = {
      totalStakers: data.totalStakers,
      totalOperators: data.totalOperators,
      tvl: data.tvl.tvl,
      tvlUSD: tvlUSD,
      ethPriceUSD: ethPriceUSD,
      lastUpdated: new Date().toISOString(),
    };

    // Save the successfully formatted data for future fallback
    await this.saveLastFetchedData(statisticsData);

    return statisticsData;
  }

  /**
   * Get statistics data with Next.js caching
   */
  async getStatistics(): Promise<StatisticsData> {
    try {
      console.log("Fetching statistics data from API with Next.js caching");
      const apiData = await this.fetchFromAPI();
      const formattedData = await this.formatStatisticsData(apiData);

      console.log("Successfully fetched statistics data");
      return formattedData;
    } catch (error) {
      console.error("Failed to fetch statistics data:", error);

      // Try to return last successfully fetched data
      console.log("Attempting to return last fetched values due to API error");
      const lastFetchedData = await this.loadLastFetchedData();

      if (lastFetchedData) {
        console.log("Returning last fetched values");
        return lastFetchedData;
      }

      // Fallback to default data if no cached data is available
      console.log("No cached data available, returning default values");
      return this.getDefaultStatistics();
    }
  }

  /**
   * Get default statistics when API is unavailable
   */
  private async getDefaultStatistics(): Promise<StatisticsData> {
    const ethPriceUSD = await ethPriceService.getETHPriceUSD();
    const defaultTVLETH = 668010.17;
    const defaultTVLUSD = defaultTVLETH * ethPriceUSD;

    return {
      totalStakers: 25760,
      totalOperators: 4,
      tvl: defaultTVLETH,
      tvlUSD: defaultTVLUSD,
      ethPriceUSD: ethPriceUSD,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Force refresh the cache using Next.js revalidation
   */
  async forceRefresh(): Promise<StatisticsData> {
    try {
      // Revalidate both caches using Next.js revalidateTag
      const { revalidateTag } = await import("next/cache");
      revalidateTag("eigenlayer-statistics");
      revalidateTag("eth-price");

      console.log("Both caches revalidated, fetching fresh data");
      return this.getStatistics();
    } catch (error) {
      console.error("Failed to revalidate cache:", error);

      // Try to return last fetched data even during force refresh
      const lastFetchedData = await this.loadLastFetchedData();
      if (lastFetchedData) {
        console.log("Returning last fetched values during force refresh");
        return lastFetchedData;
      }

      return this.getStatistics();
    }
  }

  /**
   * Clear the persistent cache file
   */
  async clearPersistentCache(): Promise<void> {
    try {
      await fs.unlink(this.CACHE_FILE_PATH);
      console.log("Successfully cleared persistent cache");
    } catch (error) {
      console.warn("Failed to clear persistent cache:", error);
    }
  }

  /**
   * Get cache configuration for debugging
   */
  getCacheConfig() {
    return {
      eigenLayerCacheTimingSeconds: this.getCacheTimingInSeconds(),
      eigenLayerCacheTimingMs: this.getCacheTimingInSeconds() * 1000,
      ethPriceCacheConfig: ethPriceService.getETHPriceCacheConfig(),
      tags: ["eigenlayer-statistics", "eth-price"],
      persistentCachePath: this.CACHE_FILE_PATH,
    };
  }
}

// Export singleton instance
export const eigenLayerService = new EigenLayerService();
