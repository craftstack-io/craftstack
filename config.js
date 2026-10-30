/*
 * Public CraftMeetCode configuration.
 * Minting is intentionally OFF and the address stays empty until the contract is deployed and verified.
 * Never put a private key, seed phrase, or credential in a frontend file.
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
  rpcUrl: "https://bsc-dataseed.binance.org"
});
