/*
 * Public CraftMeetCode configuration.
 * Minting and agent access stay locked until the contract and service are deployed and verified.
 * Never put a private key, seed phrase, AI API key, or credential in a frontend file.
 */
window.CMC_CONFIG = Object.freeze({
  contractAddress: "0x0000000000000000000000000000000000000000",
  ownerAddress: "0x0000000000000000000000000000000000000000",
  chainId: 56,
  mintEnabled: false,
  freeFee: "0.0001",
  paidPrice: "0.001",
  freeSupply: 5000,
  paidSupply: 5000,
  rpcUrl: "https://bsc-dataseed.binance.org",
  // Set these only after deployment and backend verification.
  agentEnabled: false,
  agentEndpoint: "",
  collectionName: "CraftMeetCode",
  agentName: "The Workshop Bot"
});
