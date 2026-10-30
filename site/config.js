/*
 * Konfigurasi publik CraftMeetCode.
 * Mint sengaja OFF dan alamat masih kosong sampai deployment kontrak diselesaikan dan diverifikasi.
 * Tidak pernah memasukkan private key, seed phrase, atau kredensial di file frontend.
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
