# CraftMeetCode deployment

## Open the owner deployment page

[Open the CraftMeetCode owner deploy page](https://craftmeetscode.net/deploy.html)

The page contains the verified contract bytecode and ABI, so the owner can enter the payout wallet and metadata URI, connect a wallet, and click **Deploy contract · sign in wallet**. The browser creates the deployment transaction locally and the wallet shows the chain, gas, and constructor values for review. No deployment transaction is sent without the owner approving it in the wallet popup. The page does not use Remix.

The source remains available for review in [`CraftMeetCode.sol`](CraftMeetCode.sol). Never paste a seed phrase or private key into the page.

## Required constructor values

`CraftMeetCode` has two constructor parameters:

1. `payoutWallet_`: the wallet that receives paid-mint payments. Use the verified owner/payout wallet. Do not paste a seed phrase or private key anywhere.
2. `baseURI_`: use `https://craftmeetscode.net/assets/metadata/`. Each token metadata file is available as `https://craftmeetscode.net/assets/metadata/<tokenId>.json`, and its image points to `https://craftmeetscode.net/assets/images/<tokenId>.png`.

The replacement contract currently embedded in this deploy console sets the free-mint price to `0 BNB`; minters still pay the network gas. The paid mint remains `0.001 BNB`. This deployment creates a new contract address and does not modify the old contract.

Compile with Solidity `0.8.20` and the OpenZeppelin dependencies available to Remix. Halaman deploy memilih BNB Smart Chain Mainnet (`chainId 56`) sebagai default. Pastikan bytecode, metadata, payout wallet, dan biaya gas sudah diverifikasi sebelum menekan Confirm. BNB Testnet (`chainId 97`) tetap tersedia sebagai pilihan uji.

## Mint safety gate

Minting is closed by default because `freeOpen` and `paidOpen` are initialized to `false`. After deployment, verify the contract address, owner, payout wallet, bytecode, metadata, and testnet behavior first. The free phase is now open; only the contract owner can call:

```text
setOpen(true, true)
```

Do not call `setOpen(true, true)` until the owner has explicitly approved the launch. To keep mint disabled, leave both values at `false` or call:

```text
setOpen(false, false)
```

The website now points to the verified address, owner/payout configuration, chain ID/RPC, and `mintEnabled: true`. The frontend flag alone does not open the contract; the on-chain `setOpen` state remains the final gate. Free mint is currently open and paid mint remains closed.

## After owner approval

1. Verify the deployed contract on the network explorer.
2. Confirm `owner()` is the expected owner wallet and `payoutWallet()` is correct.
3. Confirm `freeOpen()` and `paidOpen()` are still `false`.
4. `site/config.js` now reflects the verified deployment and free mint state; keep `agentEnabled: false` until the agent backend is ready.
5. Paid mint remains closed until a separate launch approval calls `setOpen(true, true)` from the owner wallet.

Never share a seed phrase or private key. A deployment link cannot approve transactions on behalf of the owner wallet.

## Agent backend

The frontend agent remains disabled until its backend is deployed. `api/agent.js` is a Node 18 serverless reference endpoint. Configure `OPENAI_API_KEY`, `CMC_CONTRACT_ADDRESS=0x0A7Fe9D062Dd2C94Ad224aE68e4c788D479d2946`, `CMC_RPC_URL=https://bsc-dataseed.binance.org`, and `CMC_ALLOWED_ORIGIN=https://craftmeetscode.net` on the backend host. The endpoint verifies the wallet signature, checks the nonce age, reads `balanceOf` on BNB Mainnet, and only then calls the AI provider. After testing, set the HTTPS endpoint in `site/config.js` and enable `agentEnabled`; never put the AI key in that file.
