const STELLAR_MAINNET_EXPLORER_URL = "https://stellarchain.io";
const STELLAR_TESTNET_EXPLORER_URL = "https://testnet.stellarchain.io";

export const stellarExplorerUrl = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
    ? STELLAR_MAINNET_EXPLORER_URL
    : STELLAR_TESTNET_EXPLORER_URL; 