import { StatisticsData } from "@/types/eigenlayer";
import { eigenLayerService } from "@/services/eigenLayerService";

/**
 * Server-side utility to fetch statistics data using Next.js Data Cache
 * This can be used in server components or API routes
 */
export async function getStatisticsData(): Promise<StatisticsData | null> {
  try {
    return await eigenLayerService.getStatistics();
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
}

/**
 * Format statistics data for display with USD values
 */
export function formatStatisticsForDisplay(data: StatisticsData) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const formatTVL = (tvl: number): string => {
    return tvl.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUSD = (usd: number): string => {
    if (usd >= 1000000000) {
      return "$" + (usd / 1000000000).toFixed(1) + "B";
    } else if (usd >= 1000000) {
      return "$" + (usd / 1000000).toFixed(1) + "M";
    } else if (usd >= 1000) {
      return "$" + (usd / 1000).toFixed(1) + "K";
    }
    return (
      "$" +
      usd.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  return [
    {
      id: 1,
      value: formatNumber(data.totalStakers),
      label: "Total Stakers",
    },
    {
      id: 2,
      value: data.totalOperators.toString(),
      label: "Total Operators",
    },
    {
      id: 3,
      value: formatUSD(data.tvlUSD),
      label: "Current TVL (USD)",
      subtitle: `${formatTVL(data.tvl)} ETH @ $${data.ethPriceUSD.toFixed(2)}`,
    },
  ];
}

/**
 * Get cache configuration for debugging
 */
export function getCacheConfig() {
  return eigenLayerService.getCacheConfig();
}

/**
 * Force refresh the cache using Next.js revalidation
 */
export async function forceRefreshStatistics(): Promise<StatisticsData> {
  return eigenLayerService.forceRefresh();
}

/**
 * Clear the persistent cache file
 */
export async function clearPersistentCache(): Promise<void> {
  return eigenLayerService.clearPersistentCache();
}
