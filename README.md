# craftmeetcode — panduan deploy

1. Aset siap pakai ada di folder `assets/` (10.000 gambar + metadata). Untuk generate ulang: `node generate.js` (hasil di folder `output/`).
2. Upload folder `images/` ke IPFS (Pinata / NFT.Storage) -> dapat IMAGES_CID.
3. Jalankan ulang:  `node generate.js <IMAGES_CID>`  agar metadata berisi `ipfs://<IMAGES_CID>/<id>.png`.
4. Upload folder `metadata/` ke IPFS -> dapat METADATA_CID.
5. Deploy `CraftMeetCode.sol` (Remix / Hardhat), constructor:
   - payoutWallet_ = wallet kamu (penerima fee/harga)
   - baseURI_      = ipfs://<METADATA_CID>/
6. Panggil `setOpen(true, true)` untuk membuka mint.
7. Isi `CONFIG.CONTRACT` dan `CONFIG.OWNER` di craftmeetcode.html.
8. Setelah yakin metadata benar, panggil `lockMetadata()`.
Tes dulu di BNB Testnet (chain 97) sebelum mainnet.
