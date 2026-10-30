# CraftMeetCode

This repository contains the CraftMeetCode contract, collection assets, artwork generator, and static website. The complete frontend lives in `site/`; copies of `index.html` and `craftmeetcode.html`, along with the CSS and JavaScript files at the repository root, are provided for static hosting.

## Website status

The site can be hosted as static files without a backend. GitHub Pages serves the root `index.html`; the WebDev project is configured to build from `site/`. The site includes a pixel-art gallery, token ID and trait lookup, responsive navigation, FAQs, and mint status.

The NFT contract is deployed on BNB Mainnet at `0x49123D2D219542DE882619180Af86Fc78c7C0c8E`. Minting and agent access remain intentionally disabled in `site/config.js` (`mintEnabled: false`, `agentEnabled: false`). **Do not enable either feature until the owner approves the launch and the agent backend is verified.**

## NFT-gated agent MVP

The frontend now includes an NFT-gated agent console. A visitor can connect a wallet, the site reads ERC-721 `balanceOf` over the configured RPC, and the owner signs a human-readable message. Signing does not submit a transaction and does not spend gas. The chat stays locked while the collection contract is unavailable or the wallet owns no NFT.

After deployment, set `agentEnabled: true`, the verified `contractAddress`, and a HTTPS `agentEndpoint` in `site/config.js`. The endpoint receives `{ address, signature, message, tokenBalance, text, history }` and should independently recover the signer from the signature and re-check NFT ownership on the server before answering. Never authorize a request from the client-provided `tokenBalance` alone. `agentEndpoint` must be a backend proxy; do not put an AI provider key in this static frontend.

The console includes browser speech-to-text when supported and optional browser text-to-speech when the endpoint returns `{ speak: true }`. Audio is not stored by this frontend. Production deployment should still define retention, moderation, rate limits, and abuse controls on the backend.

The repository now includes a serverless reference endpoint at `api/agent.js`. Deploy it on a Node 18 serverless host, set `OPENAI_API_KEY`, `OPENAI_MODEL` (optional), `CMC_CONTRACT_ADDRESS`, `CMC_RPC_URL`, and `CMC_ALLOWED_ORIGIN`, then set the resulting HTTPS URL as `agentEndpoint` and set `agentEnabled: true` only after testing. The endpoint verifies the signed message, rejects stale nonces, checks `balanceOf` on BNB Mainnet, and only then calls the AI provider. GitHub Pages does not run this endpoint by itself.

## Before enabling minting

1. Test `CraftMeetCode.sol` on BNB Testnet and complete a security audit before accepting mainnet payments.
2. The metadata currently uses the website-hosted image URLs `https://craftmeetscode.net/assets/images/<tokenId>.png`. The matching metadata base URI for this non-IPFS deployment is `https://craftmeetscode.net/assets/metadata/`.
3. The deployed contract address is `0x49123D2D219542DE882619180Af86Fc78c7C0c8E`; verify the contract address and bytecode using the network explorer.
4. Set the contract address, payout wallet, chain ID, RPC endpoint, and prices in `site/config.js` to match the deployed contract. Set `mintEnabled` to `true` only after verifying the address and on-chain state. Never put a private key or seed phrase in frontend code.
5. Confirm that each mint phase is opened on-chain before enabling its button, and test the entire flow on testnet before announcing a mainnet launch.

The artwork generator is in `art.js` and `generate.js`. Follow the instructions in `generate.js` to regenerate assets, and ensure the metadata CID does not contain a placeholder.

## Deployment link

Use the [CraftMeetCode owner deploy console](https://craftmeetscode.net/deploy.html) for the guided direct deployment flow. The page prepares the deployment transaction in the browser and asks the owner wallet to review and sign it; it does not use Remix. See [`DEPLOY.md`](DEPLOY.md) for constructor values, BNB Mainnet deployment steps, and the mint safety gate. `freeOpen` and `paidOpen` start as `false`; do not call `setOpen(true, true)` until the owner has explicitly approved the launch.
