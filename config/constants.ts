export const MULTIPLIER = 10_000;
export const DAYS = 86400;

export const DEFAULT_GAS_LIMIT = "6000000";
export const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
export const ROWS_PER_PAGE = 50;
export const COVERS_PER_PAGE = 6;
export const GAS_MARGIN_MULTIPLIER = 1.5;

export const CoverStatus = {
  0: "Normal",
  1: "Stopped",
  2: "Incident Happened",
  3: "False Reporting",
  4: "Claimable",
};

export const ReportStatus = {
  Reporting: "Incident Happened",
  Claimable: "Claimable",
  FalseReporting: "False Reporting",
};

export const PoolTypes = {
  TOKEN: "token",
  POD: "pod",
};

// Will end with `/`
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).toString()
  : "/";

export const PRICING_URL = `${API_BASE_URL}pricing/{networkId}`;

export const FAUCET_URL = "https://faucet.neptunemutual.com/";
export const LEADERBOARD_URL = "https://leaderboard.neptunemutual.com/";

export const POOL_URLS = {
  3: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
  42: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
  80001:
    "https://quickswap.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}",
};

export const SUBGRAPH_API_URLS = {
  3: process.env.NEXT_PUBLIC_ROPSTEN_SUBGRAPH_URL,
  42: process.env.NEXT_PUBLIC_KOVAN_SUBGRAPH_URL,
  80001: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
};

export const token = {
  liquidityTokenAddress: "0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB",
  NPMTokenAddress: "0x001Ffb65fF6E15902072C5133C016fD89cB56a7e",
};
