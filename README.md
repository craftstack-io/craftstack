# CraftMeetCode

Repositori ini berisi kontrak, aset koleksi, generator, dan situs statis CraftMeetCode. Frontend lengkap ada di `site/`; salinan `index.html` dan `craftmeetcode.html` serta file CSS/JS pada root disediakan untuk hosting statis sederhana.

## Status situs

Situs dapat di-host sebagai aset statis tanpa backend. Pada WebDev, output publik dibangun dari folder `site/`. Jika menggunakan hosting yang menayangkan root repositori, gunakan `index.html`. Tampilan mencakup galeri pixel art, pencarian ID/traits, navigasi responsif, FAQ, dan status mint.

Mint sengaja dinonaktifkan di `site/config.js` (`mintEnabled: false`, alamat kontrak nol). Tidak ada kontrak yang dideploy atau transaksi yang dikirim oleh proses ini. **Jangan mengaktifkan mint sebelum kontrak dan metadata diuji serta diverifikasi.**

## Setelah kontrak dideploy

1. Uji `CraftMeetCode.sol` di BNB Testnet dan lakukan audit keamanan sebelum menerima pembayaran mainnet.
2. Unggah `assets/images/` ke IPFS, regenerasi metadata dengan CID gambar yang benar, lalu unggah metadata. Metadata saat ini masih berisi `REPLACE_WITH_IMAGES_CID` dan belum siap dipakai kontrak.
3. Deploy kontrak dengan `payoutWallet_` dan `baseURI_` yang sudah diverifikasi; verifikasi alamat/bytecode di penjelajah jaringan.
4. Isi alamat kontrak, wallet payout, chain ID, RPC, dan harga yang cocok dengan kontrak di `site/config.js`; ubah `mintEnabled` menjadi `true` hanya setelah alamat dan keadaan on-chain diperiksa. Jangan menaruh private key atau seed phrase di frontend.
5. Pastikan mint hanya aktif ketika fase terkait terbuka dan uji keseluruhan alur di testnet sebelum mengumumkan mainnet.

Generator artwork berada di `art.js` dan `generate.js`. Untuk membuat ulang aset, ikuti instruksi pada `generate.js` dan pastikan CID metadata tidak memakai placeholder.
