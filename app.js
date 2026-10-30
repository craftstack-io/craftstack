(() => {
  "use strict";

  const config = window.CMC_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const zeroAddress = /^0x0{40}$/i;
  const validAddress = value => /^0x[a-fA-F0-9]{40}$/.test(value || "") && !zeroAddress.test(value || "");
  const contractReady = Boolean(config.mintEnabled && validAddress(config.contractAddress) && validAddress(config.ownerAddress) && [56, 97].includes(Number(config.chainId)) && config.rpcUrl);
  const tokenIds = [1, 7, 42, 88, 101, 256, 314, 500, 777, 1024, 1337, 2048, 3141, 4096, 5000, 7777, 8888, 10000];
  const abi = [
    "function freeMint() payable",
    "function paidMint() payable",
    "function freeMinted() view returns (uint256)",
    "function paidMinted() view returns (uint256)",
    "function freeOpen() view returns (bool)",
    "function paidOpen() view returns (bool)",
    "function payoutWallet() view returns (address)",
    "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)"
  ];

  const menuButton = $("#menuToggle");
  const nav = $("#siteNav");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  $$("#siteNav a").forEach(link => link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation menu");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      menuButton?.click();
      menuButton?.focus();
    }
  });

  function draw(canvas, id) {
    const context = canvas?.getContext("2d");
    if (!context || typeof window.drawToken !== "function") return [];
    canvas.width = 32;
    canvas.height = 32;
    context.imageSmoothingEnabled = false;
    return window.drawToken(context, id);
  }

  function showToken(id) {
    const traits = draw($("#lookupCanvas"), id);
    const container = $("#traits");
    if (!container) return;
    container.replaceChildren();
    traits.filter(([key, value]) => !(key === "Hat Color" && value === "None")).forEach(([key, value]) => {
      const item = document.createElement("span");
      item.className = "trait";
      const label = document.createElement("b");
      label.textContent = `${key}: `;
      item.append(label, document.createTextNode(value));
      container.append(item);
    });
    $("#lookupCanvas")?.setAttribute("aria-label", `Pixel-art preview for collectible ${id}`);
    $$(".gallery-item").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.id) === id)));
  }

  function openTokenFromInput() {
    const input = $("#tokenId");
    const value = Number.parseInt(input?.value ?? "", 10);
    if (!Number.isInteger(value) || value < 1 || value > 10000) {
      if (input) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
      }
      const traits = $("#traits");
      if (traits) traits.textContent = "Enter a whole-number ID from 1 to 10,000.";
      return;
    }
    input?.removeAttribute("aria-invalid");
    if (input) input.value = String(value);
    showToken(value);
  }

  const gallery = $("#gallery");
  tokenIds.forEach(id => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.dataset.id = String(id);
    button.setAttribute("aria-label", `View the preview for collectible ${id}`);
    button.setAttribute("aria-pressed", "false");
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    canvas.setAttribute("aria-hidden", "true");
    draw(canvas, id);
    const label = document.createElement("span");
    label.textContent = `#${id}`;
    button.append(canvas, label);
    button.addEventListener("click", () => {
      $("#tokenId").value = String(id);
      $("#tokenId").removeAttribute("aria-invalid");
      showToken(id);
    });
    gallery?.append(button);
  });

  $("#lookupButton")?.addEventListener("click", openTokenFromInput);
  $("#tokenId")?.addEventListener("keydown", event => {
    if (event.key === "Enter") openTokenFromInput();
  });
  showToken(1337);

  const heroCanvas = $("#heroCanvas");
  if (heroCanvas) {
    let heroId = 7;
    draw(heroCanvas, heroId);
    heroCanvas.setAttribute("aria-label", `Sample pixel-art robot from the CraftMeetCode collection, collectible ${heroId}`);
  }

  const freeButton = $("#freeMintButton");
  const paidButton = $("#paidMintButton");
  const statusTitle = $("#contractStatus");
  const statusDetail = $("#statusDetail");

  let onChainReady = false;

  async function loadStats() {
    if (!contractReady) return;
    onChainReady = false;
    if (freeButton) freeButton.disabled = true;
    if (paidButton) paidButton.disabled = true;
    if (statusTitle) statusTitle.textContent = "VERIFYING CONTRACT";
    if (statusDetail) statusDetail.textContent = "Verifying the chain, contract address, payout wallet, and mint status…";
    if (!window.ethers?.providers?.JsonRpcProvider) {
      if (statusDetail) statusDetail.textContent = "The contract reader is unavailable. Minting remains disabled.";
      return;
    }
    try {
      const provider = new window.ethers.providers.JsonRpcProvider(config.rpcUrl);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== Number(config.chainId)) throw new Error("The RPC points to a different network than the configured chain ID.");
      const code = await provider.getCode(config.contractAddress);
      if (!code || code === "0x") throw new Error("No contract bytecode was found at that address.");
      const contract = new window.ethers.Contract(config.contractAddress, abi, provider);
      const [free, paid, freeOpen, paidOpen, payoutWallet] = await Promise.all([
        contract.freeMinted(), contract.paidMinted(), contract.freeOpen(), contract.paidOpen(), contract.payoutWallet()
      ]);
      if (String(payoutWallet).toLowerCase() !== String(config.ownerAddress).toLowerCase()) throw new Error("The on-chain payout wallet does not match the site’s configured ownerAddress.");
      const freeCount = free.toNumber();
      const paidCount = paid.toNumber();
      $("#freeCount").textContent = `${freeCount.toLocaleString("en-US")} / 5.000 minted`;
      $("#paidCount").textContent = `${paidCount.toLocaleString("en-US")} / 5.000 minted`;
      const freeTrack = freeButton?.closest(".mint-card")?.querySelector(".progress-track span");
      const paidTrack = paidButton?.closest(".mint-card")?.querySelector(".progress-track span");
      if (freeTrack) freeTrack.style.width = `${Math.min(100, freeCount / config.freeSupply * 100)}%`;
      if (paidTrack) paidTrack.style.width = `${Math.min(100, paidCount / config.paidSupply * 100)}%`;
      onChainReady = true;
      if (freeButton) {
        freeButton.disabled = !freeOpen;
        freeButton.textContent = freeOpen ? "Connect & mint" : "Phase closed";
        freeButton.classList.toggle("button-disabled", !freeOpen);
      }
      if (paidButton) {
        paidButton.disabled = !paidOpen;
        paidButton.textContent = paidOpen ? "Connect & mint" : "Phase closed";
        paidButton.classList.toggle("button-disabled", !paidOpen);
      }
      const mintOpen = Boolean(freeOpen || paidOpen);
      if (statusTitle) statusTitle.textContent = mintOpen ? "CONTRACT VERIFIED · MINT OPEN" : "CONTRACT VERIFIED · MINT CLOSED";
      if (statusDetail) statusDetail.textContent = mintOpen ? "On-chain verification passed. Review the network and transaction details in your wallet before approving." : "The address, network, and payout wallet match; the contract owner has not opened the mint phase yet.";
    } catch (error) {
      onChainReady = false;
      if (freeButton) freeButton.disabled = true;
      if (paidButton) paidButton.disabled = true;
      if (statusTitle) statusTitle.textContent = "CONTRACT NOT VERIFIED";
      if (statusDetail) statusDetail.textContent = `Minting remains disabled: ${error?.message || "on-chain verification failed"}`;
    }
  }

  async function connectAndMint(kind) {
    if (!onChainReady) return;
    if (!window.ethereum || !window.ethers?.providers?.Web3Provider) {
      if (statusDetail) statusDetail.textContent = "No wallet was found or ethers.js is unavailable. No transaction was submitted.";
      return;
    }
    const button = kind === "free" ? freeButton : paidButton;
    if (button) button.disabled = true;
    try {
      const provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const chainHex = `0x${Number(config.chainId).toString(16)}`;
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: chainHex }]);
      } catch (error) {
        if (error?.code !== 4902) throw error;
        await provider.send("wallet_addEthereumChain", [{
          chainId: chainHex,
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: [config.rpcUrl],
          blockExplorerUrls: ["https://bscscan.com"]
        }]);
      }
      const selectedNetwork = await provider.getNetwork();
      if (Number(selectedNetwork.chainId) !== Number(config.chainId)) throw new Error("The wallet is still connected to the wrong network.");
      const signer = provider.getSigner();
      const contract = new window.ethers.Contract(config.contractAddress, abi, signer);
      const price = kind === "free" ? config.freeFee : config.paidPrice;
      if (statusDetail) statusDetail.textContent = "Review the contract name, amount, network, and gas fee in your wallet before approving.";
      const tx = await (kind === "free" ? contract.freeMint({ value: window.ethers.utils.parseEther(price) }) : contract.paidMint({ value: window.ethers.utils.parseEther(price) }));
      if (statusDetail) statusDetail.textContent = "Transaction submitted. Waiting for network confirmation…";
      await tx.wait();
      if (statusDetail) statusDetail.textContent = `Mint successful. Transaction hash: ${tx.hash}`;
      await loadStats();
    } catch (error) {
      const message = error?.reason || error?.data?.message || error?.message || "Mint request failed.";
      if (statusDetail) statusDetail.textContent = `Mint failed: ${message}`;
    } finally {
      if (button) button.disabled = false;
    }
  }

  if (!contractReady) {
    if (freeButton) freeButton.disabled = true;
    if (paidButton) paidButton.disabled = true;
    if (statusTitle) statusTitle.textContent = "CONTRACT NOT LIVE";
    if (statusDetail) statusDetail.textContent = "Minting is not available yet. This page will not submit any transactions.";
  } else {
    if (freeButton) {
      freeButton.disabled = false;
      freeButton.classList.remove("button-disabled");
      freeButton.textContent = "Connect & mint";
      freeButton.addEventListener("click", () => connectAndMint("free"));
    }
    if (paidButton) {
      paidButton.disabled = false;
      paidButton.classList.remove("button-disabled");
      paidButton.textContent = "Connect & mint";
      paidButton.addEventListener("click", () => connectAndMint("paid"));
    }
    if (statusTitle) statusTitle.textContent = "VERIFYING CONTRACT";
    if (statusDetail) statusDetail.textContent = `Verifying the contract on chain ID ${config.chainId} before enabling minting.`;
    loadStats();
  }
})();
