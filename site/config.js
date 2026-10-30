/*
 * Public CraftMeetCode configuration.
 * Minting and agent access stay locked until the contract and service are deployed and verified.
 * Never put a private key, seed phrase, AI API key, or credential in a frontend file.
 */
window.CMC_CONFIG = Object.freeze({
  contractAddress: "0x0A7Fe9D062Dd2C94Ad224aE68e4c788D479d2946",
  ownerAddress: "0x7fE99e4Ac8849bc4D8998288ddA25b56FF798F86",
  chainId: 56,
  mintEnabled: true,
  freeFee: "0",
  paidPrice: "0.001",
  freeSupply: 5000,
  paidSupply: 5000,
  rpcUrl: "https://bsc-dataseed.binance.org",
  fallbackVerified: true,
  fallbackFreeOpen: true,
  fallbackPaidOpen: true,
  rpcUrls: [
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed.bnbchain.org",
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org"
  ],
  // Set these only after deployment and backend verification.
  agentEnabled: false,
  agentEndpoint: "",
  collectionName: "CraftMeetCode",
  agentName: "The Workshop Bot"
});
