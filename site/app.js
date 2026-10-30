(() => {
  "use strict";

  const config = window.CMC_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const zeroAddress = /^0x0{40}$/i;
  const validAddress = value => /^0x[a-fA-F0-9]{40}$/.test(value || "") && !zeroAddress.test(value || "");
  const collectionReady = Boolean(validAddress(config.contractAddress) && [56, 97].includes(Number(config.chainId)) && config.rpcUrl);
  const contractReady = Boolean(config.mintEnabled && collectionReady && validAddress(config.ownerAddress));
  const tokenIds = [1, 7, 42, 88, 101, 256, 314, 500, 777, 1024, 1337, 2048, 3141, 4096, 5000, 7777, 8888, 10000];
  const abi = [
    "function freeMint() payable",
    "function paidMint() payable",
    "function freeMinted() view returns (uint256)",
    "function paidMinted() view returns (uint256)",
    "function freeOpen() view returns (bool)",
    "function paidOpen() view returns (bool)",
    "function payoutWallet() view returns (address)",
    "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)",
    "function balanceOf(address owner) view returns (uint256)"
  ];

  const mintQuantities = { free: 1, paid: 1 };
  const maxQuantities = { free: 3, paid: 10 };
  const mintPrices = { free: "0", paid: "0.001" };
  let mintWalletAddress = "";

  function shortWallet(address) { return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ""; }
  function updateMintTotals() {
    ["free", "paid"].forEach(kind => {
      const quantity = mintQuantities[kind];
      const quantityNode = $(`#${kind}Quantity`);
      const totalNode = $(`#${kind}Total`);
      if (quantityNode) quantityNode.value = String(quantity);
      if (totalNode) totalNode.textContent = kind === "free" ? "0 BNB + gas" : `${(Number(mintPrices[kind]) * quantity).toFixed(3)} BNB + gas`;
    });
  }
  function promptText(kind) {
    const quantity = mintQuantities[kind];
    const price = kind === "free" ? "0 BNB" : `${(Number(mintPrices[kind]) * quantity).toFixed(3)} BNB`;
    const method = kind === "free" ? "freeMint()" : "paidMint()";
    return `Mint ${quantity} CraftMeetCode NFT${quantity > 1 ? "s" : ""} (${kind} mint) on BNB Smart Chain (chain ID 56).\nContract: ${config.contractAddress}\nPayout wallet: ${config.ownerAddress}\nMy wallet: ${mintWalletAddress || "[PASTE YOUR WALLET ADDRESS]"}\nA Binance Agent ID can be used when it controls an EVM wallet.\nCall ${method} once per NFT with a total value of ${price}. Show the transaction details first and wait for my approval in the wallet. Never ask for my seed phrase or private key.`;
  }
  function updatePrompts() {
    const walletInput = $("#promptWallet");
    if (walletInput && mintWalletAddress && !walletInput.value) walletInput.value = mintWalletAddress;
    const freePrompt = $("#freePrompt"); const paidPrompt = $("#paidPrompt");
    if (freePrompt) freePrompt.value = promptText("free");
    if (paidPrompt) paidPrompt.value = promptText("paid");
  }
  async function connectMintWallet() {
    if (!window.ethereum || !window.ethers?.providers?.Web3Provider) {
      if (statusDetail) statusDetail.textContent = "Wallet browser tidak ditemukan. Buka situs dengan Binance Web3 Wallet, MetaMask, Trust Wallet, atau OKX Wallet.";
      return;
    }
    try {
      const provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== Number(config.chainId)) throw new Error("Hubungkan wallet ke BNB Smart Chain (chain ID 56)." );
      mintWalletAddress = await provider.getSigner().getAddress();
      const status = $("#mintWalletStatus");
      if (status) status.textContent = `${shortWallet(mintWalletAddress)} · BNB Chain · wallet terhubung`;
      const input = $("#promptWallet"); if (input) input.value = mintWalletAddress;
      updatePrompts();
    } catch (error) {
      if (statusDetail) statusDetail.textContent = `Wallet belum terhubung: ${error?.message || "permintaan dibatalkan"}`;
    }
  }

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

  const agentState = { address: "", signature: "", message: "", tokenBalance: 0, history: [] };
  const agentContractReady = Boolean(collectionReady && config.agentEnabled);
  const agentAbi = ["function balanceOf(address owner) view returns (uint256)"];

  function setAgentStatus(message, tone = "muted") {
    const status = $("#agentAccessStatus");
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function shortAddress(address) {
    return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
  }

  function renderAgentLock(locked) {
    $("#agentChat")?.classList.toggle("is-locked", locked);
    $("#agentChatInput")?.toggleAttribute("disabled", locked);
    $("#agentSendButton")?.toggleAttribute("disabled", locked);
    $("#agentTalkButton")?.toggleAttribute("disabled", locked);
  }

  function appendAgentMessage(role, text) {
    const log = $("#agentMessages");
    if (!log) return;
    const item = document.createElement("div");
    item.className = `agent-message agent-message-${role}`;
    item.innerHTML = `<span class="agent-message-label">${role === "user" ? "YOU" : "BOT"}</span>`;
    const body = document.createElement("p");
    body.textContent = text;
    item.append(body);
    log.append(item);
    log.scrollTop = log.scrollHeight;
  }

  async function verifyAgentOwnership() {
    if (!window.ethereum || !window.ethers?.providers?.Web3Provider) throw new Error("Wallet browser tidak ditemukan.");
    if (!collectionReady) throw new Error("Kontrak koleksi belum live; ownership belum dapat diverifikasi.");
    const provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== Number(config.chainId)) throw new Error(`Hubungkan wallet ke chain ID ${config.chainId}.`);
    const address = await provider.getSigner().getAddress();
    const contract = new window.ethers.Contract(config.contractAddress, agentAbi, provider);
    const balance = await contract.balanceOf(address);
    if (balance.isZero()) throw new Error("Wallet ini belum memiliki CraftMeetCode NFT.");
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const message = `${config.collectionName || "CraftMeetCode"} agent access\nWallet: ${address}\nNonce: ${nonce}\n\nSigning only verifies ownership. No transaction will be sent.`;
    setAgentStatus("Silakan tanda tangani pesan verifikasi di wallet. Tidak ada transaksi atau gas.", "active");
    const signature = await provider.getSigner().signMessage(message);
    agentState.address = address;
    agentState.signature = signature;
    agentState.message = message;
    agentState.tokenBalance = balance.toString();
    $("#agentWalletButton").textContent = shortAddress(address);
    $("#agentTokenCount").textContent = `${balance.toString()} NFT terdeteksi`;
    $("#agentChat")?.classList.remove("is-locked");
    renderAgentLock(false);
    setAgentStatus("ACCESS GRANTED · ownership terverifikasi", "success");
    appendAgentMessage("bot", `Akses terbuka. Saya ${config.agentName || "The Workshop Bot"}. Ceritakan apa yang ingin kamu bangun.`);
  }

  async function sendAgentMessage() {
    const input = $("#agentChatInput");
    const text = input?.value.trim();
    if (!text || !agentState.signature) return;
    appendAgentMessage("user", text);
    input.value = "";
    if (!config.agentEndpoint) {
      appendAgentMessage("bot", "Endpoint agent belum dikonfigurasi. Ownership dan signature sudah siap; hubungkan backend agent melalui CMC_CONFIG.agentEndpoint.");
      return;
    }
    const button = $("#agentSendButton");
    if (button) button.disabled = true;
    try {
      const response = await fetch(config.agentEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: agentState.address, signature: agentState.signature, message: agentState.message, tokenBalance: agentState.tokenBalance, text, history: agentState.history }) });
      if (!response.ok) throw new Error(`Agent service returned ${response.status}`);
      const data = await response.json();
      const reply = String(data.reply || data.message || "Agent tidak mengembalikan jawaban.");
      agentState.history.push({ role: "user", content: text }, { role: "assistant", content: reply });
      appendAgentMessage("bot", reply);
      if (data.speak && "speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply));
    } catch (error) {
      appendAgentMessage("bot", `Agent belum dapat dihubungi: ${error.message}`);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function startAgentSpeech() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setAgentStatus("Speech-to-text tidak tersedia di browser ini.", "error"); return; }
    const recognition = new Recognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    setAgentStatus("Mendengarkan…", "active");
    recognition.onresult = event => { const input = $("#agentChatInput"); if (input) input.value = event.results[0][0].transcript; setAgentStatus("Transkrip siap dikirim.", "success"); };
    recognition.onerror = () => setAgentStatus("Mikrofon tidak dapat digunakan. Coba ketik pesan.", "error");
    recognition.start();
  }

  $("#agentWalletButton")?.addEventListener("click", async () => {
    try { await verifyAgentOwnership(); } catch (error) { setAgentStatus(error.message, "error"); }
  });
  $("#agentSendButton")?.addEventListener("click", sendAgentMessage);
  $("#agentChatInput")?.addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendAgentMessage(); } });
  $("#agentTalkButton")?.addEventListener("click", startAgentSpeech);
  renderAgentLock(true);
  if (!agentContractReady) setAgentStatus("LOCKED · menunggu kontrak NFT terverifikasi", "muted");

  const freeButton = $("#freeMintButton");
  const paidButton = $("#paidMintButton");
  const statusTitle = $("#contractStatus");
  const statusDetail = $("#statusDetail");

  let onChainReady = false;

  function createReadProvider() {
    const urls = [...new Set(config.rpcUrls || [config.rpcUrl])].filter(Boolean);
    const entries = urls.map((url, index) => ({
      provider: new window.ethers.providers.JsonRpcProvider(url, Number(config.chainId)),
      priority: index + 1,
      weight: 1,
      stallTimeout: 1800
    }));
    return entries.length > 1 ? new window.ethers.providers.FallbackProvider(entries, 1) : entries[0].provider;
  }

  function animateRemaining(selector, target, label) {
    const node = $(selector);
    if (!node) return;
    const start = Number(node.dataset.value ?? target);
    const end = Math.max(0, Number(target));
    const duration = 700;
    const started = performance.now();
    const frame = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);
      node.textContent = `${label}: ${value.toLocaleString("en-US")}`;
      if (progress < 1) requestAnimationFrame(frame);
      else node.dataset.value = String(end);
    };
    requestAnimationFrame(frame);
  }

  async function loadStats() {
    if (!collectionReady) return;
    onChainReady = false;
    if (freeButton) freeButton.disabled = true;
    if (paidButton) paidButton.disabled = true;
    if (statusTitle) statusTitle.textContent = "VERIFYING CONTRACT";
    if (statusDetail) statusDetail.textContent = "Verifying the chain, contract address, payout wallet, and mint status…";
    if (!window.ethers?.providers?.JsonRpcProvider) {
      if (statusDetail) statusDetail.textContent = "Pembaca kontrak tidak tersedia. Coba refresh atau periksa koneksi internet wallet.";
      return;
    }
    try {
      const provider = createReadProvider();
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
      $("#freeCount").textContent = `${freeCount.toLocaleString("en-US")} / ${Number(config.freeSupply).toLocaleString("en-US")} minted`;
      $("#paidCount").textContent = `${paidCount.toLocaleString("en-US")} / ${Number(config.paidSupply).toLocaleString("en-US")} minted`;
      animateRemaining("#freeRemaining", Number(config.freeSupply) - freeCount, "Free supply remaining");
      animateRemaining("#paidRemaining", Number(config.paidSupply) - paidCount, "Paid supply remaining");
      const freeTrack = freeButton?.closest(".mint-card")?.querySelector(".progress-track span");
      const paidTrack = paidButton?.closest(".mint-card")?.querySelector(".progress-track span");
      if (freeTrack) freeTrack.style.width = `${Math.min(100, freeCount / config.freeSupply * 100)}%`;
      if (paidTrack) paidTrack.style.width = `${Math.min(100, paidCount / config.paidSupply * 100)}%`;
      onChainReady = true;
      const freeMintEnabled = Boolean(config.mintEnabled && freeOpen);
      const paidMintEnabled = Boolean(config.mintEnabled && paidOpen);
      const freeStamp = freeButton?.closest(".mint-card")?.querySelector(".card-stamp");
      const paidStamp = paidButton?.closest(".mint-card")?.querySelector(".card-stamp");
      if (freeStamp) freeStamp.textContent = freeMintEnabled ? "OPEN" : "CLOSED";
      if (paidStamp) paidStamp.textContent = paidMintEnabled ? "OPEN" : "CLOSED";
      if (freeButton) {
        freeButton.disabled = !freeMintEnabled;
        freeButton.textContent = freeMintEnabled ? "Connect & mint" : (freeOpen ? "Launch pending" : "Phase closed");
        freeButton.classList.toggle("button-disabled", !freeMintEnabled);
      }
      if (paidButton) {
        paidButton.disabled = !paidMintEnabled;
        paidButton.textContent = paidMintEnabled ? "Connect & mint" : (paidOpen ? "Launch pending" : "Phase closed");
        paidButton.classList.toggle("button-disabled", !paidMintEnabled);
      }
      const mintOpen = Boolean(config.mintEnabled && (freeOpen || paidOpen));
      if (statusTitle) statusTitle.textContent = mintOpen ? "CONTRACT VERIFIED · MINT OPEN" : "CONTRACT VERIFIED · MINT CLOSED";
      if (statusDetail) statusDetail.textContent = mintOpen ? "On-chain verification passed. Review the network and transaction details in your wallet before approving." : "The address, network, and payout wallet match; free mint is open and paid mint remains closed.";
    } catch (error) {
      onChainReady = false;
      if (freeButton) freeButton.disabled = true;
      if (paidButton) paidButton.disabled = true;
      if (statusTitle) statusTitle.textContent = "CONTRACT NOT VERIFIED";
      if (statusDetail) statusDetail.textContent = `Status kontrak belum dapat dibaca: ${error?.message || "on-chain verification failed"}`;
    }
  }

  async function connectAndMint(kind) {
    if (!onChainReady || !contractReady) return;
    if (!window.ethereum || !window.ethers?.providers?.Web3Provider) {
      if (statusDetail) statusDetail.textContent = "Wallet browser tidak ditemukan atau ethers.js tidak tersedia.";
      return;
    }
    const button = kind === "free" ? freeButton : paidButton;
    if (button) button.disabled = true;
    try {
      const provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const chainHex = `0x${Number(config.chainId).toString(16)}`;
      try { await provider.send("wallet_switchEthereumChain", [{ chainId: chainHex }]); }
      catch (error) {
        if (error?.code !== 4902) throw error;
        await provider.send("wallet_addEthereumChain", [{ chainId: chainHex, chainName: "BNB Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, rpcUrls: [config.rpcUrl], blockExplorerUrls: ["https://bscscan.com"] }]);
      }
      const selectedNetwork = await provider.getNetwork();
      if (Number(selectedNetwork.chainId) !== Number(config.chainId)) throw new Error("Wallet masih berada di jaringan yang salah.");
      const signer = provider.getSigner();
      mintWalletAddress = await signer.getAddress();
      const contract = new window.ethers.Contract(config.contractAddress, abi, signer);
      const quantity = mintQuantities[kind];
      for (let i = 0; i < quantity; i += 1) {
        if (statusDetail) statusDetail.textContent = `Mint ${i + 1}/${quantity}: tinjau jumlah, jaringan, dan gas di wallet.`;
        const price = window.ethers.utils.parseEther(mintPrices[kind]);
        const tx = await (kind === "free" ? contract.freeMint({ value: price }) : contract.paidMint({ value: price }));
        if (statusDetail) statusDetail.textContent = `Transaksi ${i + 1}/${quantity} dikirim. Menunggu konfirmasi…`;
        await tx.wait();
      }
      if (statusDetail) statusDetail.textContent = `${quantity} NFT berhasil di-mint. Cek wallet dan BscScan untuk detail transaksi.`;
      updatePrompts();
      await loadStats();
    } catch (error) {
      const message = error?.reason || error?.data?.message || error?.message || "Mint gagal.";
      if (statusDetail) statusDetail.textContent = `Mint gagal: ${message}`;
    } finally {
      if (button) button.disabled = false;
    }
  }


  $("#mintWalletButton")?.addEventListener("click", connectMintWallet);
  $$('[data-quantity-action]').forEach(control => control.addEventListener("click", () => {
    const kind = control.dataset.kind;
    const delta = control.dataset.quantityAction === "increase" ? 1 : -1;
    mintQuantities[kind] = Math.max(1, Math.min(maxQuantities[kind], mintQuantities[kind] + delta));
    updateMintTotals(); updatePrompts();
  }));
  $("#promptWallet")?.addEventListener("input", event => { mintWalletAddress = event.target.value.trim(); updatePrompts(); });
  $$('[data-copy-prompt]').forEach(button => button.addEventListener("click", async () => {
    const field = button.dataset.copyPrompt === "free" ? $("#freePrompt") : $("#paidPrompt");
    if (!field) return;
    await navigator.clipboard.writeText(field.value);
    button.textContent = "Copied"; setTimeout(() => { button.textContent = "Copy"; }, 1200);
  }));
  updateMintTotals(); updatePrompts();

  if (freeButton) {
    freeButton.disabled = true;
    freeButton.addEventListener("click", () => connectAndMint("free"));
  }
  if (paidButton) {
    paidButton.disabled = true;
    paidButton.addEventListener("click", () => connectAndMint("paid"));
  }
  if (!collectionReady) {
    if (statusTitle) statusTitle.textContent = "CONTRACT NOT VERIFIED";
    if (statusDetail) statusDetail.textContent = "Minting is unavailable until the contract can be verified on-chain.";
  } else {
    if (statusTitle) statusTitle.textContent = "VERIFYING CONTRACT";
    if (statusDetail) statusDetail.textContent = `Verifying the contract on chain ID ${config.chainId} before enabling minting.`;
  }
  loadStats();
})();
