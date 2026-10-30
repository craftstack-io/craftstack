# CraftMeetCode deployment

## Open the owner deployment page

[Open the CraftMeetCode owner deploy page](https://craftmeetscode.net/deploy.html)

The page contains the verified contract bytecode and ABI, so the owner can enter the payout wallet and metadata URI, connect a wallet, and click **Deploy contract · sign in wallet**. The browser creates the deployment transaction locally and the wallet shows the chain, gas, and constructor values for review. No deployment transaction is sent without the owner approving it in the wallet popup. The page does not use Remix.

The source remains available for review in [`CraftMeetCode.sol`](CraftMeetCode.sol). Never paste a seed phrase or private key into the page.

## Required constructor values

`CraftMeetCode` has two constructor parameters:

1. `payoutWallet_`: the wallet that receives mint payments. Use the verified owner/payout wallet. Do not paste a seed phrase or private key anywhere.
2. `baseURI_`: the metadata URI ending in `/`, for example `ipfs://<METADATA_CID>/`. Do not deploy with `REPLACE_WITH_IMAGES_CID`.

Compile with Solidity `0.8.20` and the OpenZeppelin dependencies available to Remix. Start on BNB Smart Chain Testnet (`chainId 97`) and verify the bytecode and metadata before considering mainnet (`chainId 56`).

## Mint safety gate

Minting is closed by default because `freeOpen` and `paidOpen` are initialized to `false`. After deployment, verify the contract address, owner, payout wallet, bytecode, metadata, and testnet behavior first. Only the contract owner can call:

```text
setOpen(true, true)
```

Do not call `setOpen(true, true)` until the owner has explicitly approved the launch. To keep mint disabled, leave both values at `false` or call:

```text
setOpen(false, false)
```

The website also keeps mint disabled until `site/config.js` is updated with the verified address, owner address, correct chain ID/RPC, and `mintEnabled: true`. Updating that frontend flag alone does not open the contract; the on-chain `setOpen` state remains the final gate.

## After owner approval

1. Verify the deployed contract on the network explorer.
2. Confirm `owner()` is the expected owner wallet and `payoutWallet()` is correct.
3. Confirm `freeOpen()` and `paidOpen()` are still `false`.
4. Update `site/config.js` with the verified deployment values and keep `agentEnabled: false` until the agent backend is ready.
5. Only after a separate launch approval should the owner call `setOpen(true, false)` or `setOpen(true, true)` from the owner wallet.

Never share a seed phrase or private key. A deployment link cannot approve transactions on behalf of the owner wallet.
