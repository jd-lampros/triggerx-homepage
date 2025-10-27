import { getStatisticsData, formatStatisticsForDisplay } from "@/lib/statistics";

/**
 * Server Component that uses Next.js Data Cache
 * This component will automatically cache the data and revalidate based on CACHE_TIMING
 */
export default async function StatisticsServerComponent() {
    const statisticsData = await getStatisticsData();

    if (!statisticsData) {
        return (
            <div className="text-red-500">
                Failed to load statistics data
            </div>
        );
    }

    const formattedStats = formatStatisticsForDisplay(statisticsData);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {formattedStats.map((stat) => (
                <div key={stat.id} className="text-left p-6 lg:p-8">
                    <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
                        {stat.value}
                    </div>
                    <div className="text-[#A2A2A2] text-sm lg:text-base xl:text-xl 2xl:text-2xl">
                        {stat.label}
                    </div>
                    {stat.subtitle && (
                        <div className="text-[#666666] text-xs lg:text-sm xl:text-base mt-1">
                            {stat.subtitle}
                        </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(statisticsData.lastUpdated).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
