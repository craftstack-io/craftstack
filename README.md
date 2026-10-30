# CraftMeetCode

This repository contains the CraftMeetCode contract, collection assets, artwork generator, and static website. The complete frontend lives in `site/`; copies of `index.html` and `craftmeetcode.html`, along with the CSS and JavaScript files at the repository root, are provided for static hosting.

## Website status

The site can be hosted as static files without a backend. GitHub Pages serves the root `index.html`; the WebDev project is configured to build from `site/`. The site includes a pixel-art gallery, token ID and trait lookup, responsive navigation, FAQs, and mint status.

Minting is intentionally disabled in `site/config.js` (`mintEnabled: false`, zero contract address). No contract was deployed and no transactions were submitted as part of this work. **Do not enable minting until the contract and metadata have been tested and verified.**

## Before enabling minting

1. Test `CraftMeetCode.sol` on BNB Testnet and complete a security audit before accepting mainnet payments.
2. Upload `assets/images/` to IPFS, regenerate the metadata with the correct image CID, and upload the metadata. The current metadata still contains `REPLACE_WITH_IMAGES_CID` and is not ready for use by the contract.
3. Deploy the contract with verified `payoutWallet_` and `baseURI_` values; verify the contract address and bytecode using the network explorer.
4. Set the contract address, payout wallet, chain ID, RPC endpoint, and prices in `site/config.js` to match the deployed contract. Set `mintEnabled` to `true` only after verifying the address and on-chain state. Never put a private key or seed phrase in frontend code.
5. Confirm that each mint phase is opened on-chain before enabling its button, and test the entire flow on testnet before announcing a mainnet launch.

The artwork generator is in `art.js` and `generate.js`. Follow the instructions in `generate.js` to regenerate assets, and ensure the metadata CID does not contain a placeholder.
