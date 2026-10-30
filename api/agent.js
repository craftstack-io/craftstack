const { ethers } = require("ethers");

const CONTRACT_ABI = ["function balanceOf(address owner) view returns (uint256)"];
const CONTRACT_ADDRESS = process.env.CMC_CONTRACT_ADDRESS || "0x0A7Fe9D062Dd2C94Ad224aE68e4c788D479d2946";
const RPC_URL = process.env.CMC_RPC_URL || "https://bsc-dataseed.binance.org";
const CHAIN_ID = 56;
const MAX_MESSAGE_AGE_MS = 10 * 60 * 1000;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", process.env.CMC_ALLOWED_ORIGIN || "https://craftmeetscode.net");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.end(JSON.stringify(body));
}

function extractTimestamp(message) {
  const nonce = String(message).match(/Nonce:\s*(\d+)-/i);
  return nonce ? Number(nonce[1]) : NaN;
}

async function verifyAccess(address, signature, message) {
  if (!ethers.utils.isAddress(address)) throw new Error("Invalid wallet address.");
  if (!signature || !message) throw new Error("Wallet signature and message are required.");
  const recovered = ethers.utils.verifyMessage(message, signature);
  if (recovered.toLowerCase() !== address.toLowerCase()) throw new Error("Signature does not match the wallet address.");
  const timestamp = extractTimestamp(message);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_MESSAGE_AGE_MS) throw new Error("Verification message expired. Connect the wallet again.");
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) throw new Error("RPC is not connected to BNB Mainnet.");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const balance = await contract.balanceOf(address);
  if (balance.isZero()) throw new Error("Wallet does not own a CraftMeetCode NFT.");
  return balance.toString();
}

async function callModel(text, history) {
  if (!process.env.OPENAI_API_KEY) throw new Error("Agent backend is not configured: OPENAI_API_KEY is missing.");
  const base = (process.env.OPENAI_API_BASE || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const messages = [
    { role: "system", content: process.env.CMC_AGENT_SYSTEM_PROMPT || "You are The Workshop Bot, a concise and helpful CraftMeetCode NFT companion. Never claim an NFT proves identity beyond the verified wallet ownership supplied by the system." },
    ...(Array.isArray(history) ? history.slice(-12).filter(item => item && ["user", "assistant"].includes(item.role)).map(item => ({ role: item.role, content: String(item.content || "").slice(0, 4000) })) : []),
    { role: "user", content: String(text).slice(0, 4000) }
  ];
  const response = await fetch(`${base}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model, messages, temperature: 0.8, max_tokens: 500 }) });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}.`);
  const data = await response.json();
  return String(data.choices?.[0]?.message?.content || "The agent returned no response.");
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "POST required." });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { address, signature, message, text, history } = body;
    if (!text || String(text).trim().length === 0) return send(res, 400, { error: "Message is required." });
    const tokenBalance = await verifyAccess(address, signature, message);
    const reply = await callModel(text, history);
    return send(res, 200, { reply, tokenBalance, speak: false });
  } catch (error) {
    return send(res, 403, { error: error.message || "Agent access denied." });
  }
};
