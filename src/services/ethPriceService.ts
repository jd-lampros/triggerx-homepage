import { ETHPriceResponse } from "@/types/eigenlayer";
import { cache } from "react";

class ETHPriceService {
  private readonly API_BASE_URL = "https://api.g.alchemy.com/prices/v1";
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds

  /**
   * Get ETH price cache timing from environment variable in seconds
   */
  private getETHPriceCacheTimingInSeconds(): number {
    const cacheTiming = process.env.ETH_PRICE_CACHE_TIMING;
    if (!cacheTiming) {
      console.warn("ETH_PRICE_CACHE_TIMING not set, using default 60 seconds");
      return 300; // 5 minutes default for price data
    }

    const parsed = parseInt(cacheTiming, 10);
    if (isNaN(parsed) || parsed < 0) {
      console.warn(
        "Invalid ETH_PRICE_CACHE_TIMING value, using default 60 seconds"
      );
      return 60;
    }

    return parsed;
  }

  /**
   * Fetch ETH price from Alchemy API with Next.js caching
   */
  private fetchETHPrice = cache(async (): Promise<number> => {
    const apiKey = process.env.ALCHEMY_API_KEY;

    if (!apiKey) {
      throw new Error("ALCHEMY_API_KEY environment variable is not set");
    }

    const url = `${this.API_BASE_URL}/tokens/by-symbol?symbols=ETH`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.REQUEST_TIMEOUT
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        next: {
          revalidate: this.getETHPriceCacheTimingInSeconds(),
          tags: ["eth-price"],
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `ETH price API request failed with status: ${response.status}`
        );
      }

      const data: ETHPriceResponse = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error("No ETH price data received");
      }

      const ethData = data.data[0];
      const usdPrice = ethData.prices.find((price) => price.currency === "usd");

      if (!usdPrice) {
        throw new Error("USD price not found in ETH data");
      }

      const price = parseFloat(usdPrice.value);
      if (isNaN(price) || price <= 0) {
        throw new Error("Invalid ETH price value");
      }

      console.log(`Successfully fetched ETH price: $${price}`);
      return price;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  });

  /**
   * Get ETH price in USD
   */
  async getETHPriceUSD(): Promise<number> {
    try {
      return await this.fetchETHPrice();
    } catch (error) {
      console.error("Failed to fetch ETH price:", error);

      // Return a fallback price if API fails
      console.log("Using fallback ETH price: $4000");
      return 4000; // Fallback price
    }
  }

  /**
   * Convert ETH amount to USD
   */
  async convertETHToUSD(ethAmount: number): Promise<number> {
    const ethPrice = await this.getETHPriceUSD();
    return ethAmount * ethPrice;
  }

  /**
   * Force refresh ETH price cache using Next.js revalidation
   */
  async forceRefreshETHPrice(): Promise<number> {
    try {
      const { revalidateTag } = await import("next/cache");
      revalidateTag("eth-price");

      console.log("ETH price cache revalidated, fetching fresh data");
      return this.getETHPriceUSD();
    } catch (error) {
      console.error("Failed to revalidate ETH price cache:", error);
      return this.getETHPriceUSD();
    }
  }

  /**
   * Get ETH price cache configuration for debugging
   */
  getETHPriceCacheConfig() {
    return {
      cacheTimingSeconds: this.getETHPriceCacheTimingInSeconds(),
      cacheTimingMs: this.getETHPriceCacheTimingInSeconds() * 1000,
      tags: ["eth-price"],
    };
  }
}

// Export singleton instance
export const ethPriceService = new ETHPriceService();
