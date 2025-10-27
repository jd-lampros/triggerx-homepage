export interface EigenLayerShare {
  strategyAddress: string;
  shares: string;
}

export interface EigenLayerTVLStrategies {
  stETH: number;
  EIGEN: number;
}

export interface EigenLayerTVLStrategiesEth {
  stETH: number;
  EIGEN: number;
}

export interface EigenLayerTVL {
  tvl: number;
  tvlBeaconChain: number;
  tvlWETH: number;
  tvlRestaking: number;
  tvlStrategies: EigenLayerTVLStrategies;
  tvlStrategiesEth: EigenLayerTVLStrategiesEth;
}

export interface EigenLayerResponse {
  address: string;
  metadataName: string;
  metadataDescription: string;
  metadataDiscord: string;
  metadataLogo: string;
  metadataTelegram: string;
  metadataWebsite: string;
  metadataX: string;
  totalStakers: number;
  totalOperators: number;
  maxApy: string;
  createdAtBlock: number;
  updatedAtBlock: number;
  createdAt: string;
  updatedAt: string;
  shares: EigenLayerShare[];
  tvl: EigenLayerTVL;
}

export interface StatisticsData {
  totalStakers: number;
  totalOperators: number;
  tvl: number;
  tvlUSD: number;
  ethPriceUSD: number;
  lastUpdated: string;
}

// ETH Price API Types
export interface ETHPriceData {
  symbol: string;
  prices: Array<{
    currency: string;
    value: string;
    lastUpdatedAt: string;
  }>;
}

export interface ETHPriceResponse {
  data: ETHPriceData[];
}
