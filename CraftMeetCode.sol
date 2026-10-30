// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * craftmeetcode — 10,000 pixel works
 *  - 5,000 FREE mint  : bayar fee 0.0001 BNB (langsung diteruskan ke wallet payout kamu)
 *  - 5,000 PAID mint  : 0.001 BNB            (langsung diteruskan ke wallet payout kamu)
 *  - Token ID 1-10000 dibagikan ACAK (tidak berurutan) saat mint.
 */
contract CraftMeetCode is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY  = 10000;
    uint256 public constant FREE_SUPPLY = 5000;
    uint256 public constant PAID_SUPPLY = 5000;

    uint256 public freeFee   = 0.0001 ether;
    uint256 public paidPrice = 0.001 ether;

    uint256 public freeMinted;
    uint256 public paidMinted;

    uint256 public maxFreePerWallet = 3;
    uint256 public maxPaidPerWallet = 10;
    mapping(address => uint256) public freeMintedBy;
    mapping(address => uint256) public paidMintedBy;

    address payable public payoutWallet; // wallet kamu, penerima semua pembayaran
    bool public freeOpen;
    bool public paidOpen;
    bool public onlyEOA = true;          // true = hanya wallet biasa (anti bot contract)

    string private _base;
    bool public metadataLocked;

    // pengacakan ID (virtual Fisher-Yates)
    uint256 private _remaining = MAX_SUPPLY;
    mapping(uint256 => uint256) private _remap;

    event Minted(address indexed to, uint256 indexed tokenId, bool free);

    constructor(address payable payoutWallet_, string memory baseURI_)
        ERC721("craftmeetcode", "CMC")
        Ownable(msg.sender)
    {
        require(payoutWallet_ != address(0), "payout=0");
        payoutWallet = payoutWallet_;
        _base = baseURI_; // contoh: ipfs://<METADATA_CID>/
    }

    // ---------- MINT ----------
    function freeMint() external payable nonReentrant {
        require(freeOpen, "free closed");
        require(freeMinted < FREE_SUPPLY, "free sold out");
        require(msg.value == freeFee, "wrong fee");
        require(freeMintedBy[msg.sender] < maxFreePerWallet, "free limit");
        _guard();
        freeMinted++;
        freeMintedBy[msg.sender]++;
        _pay(msg.value);
        uint256 id = _mintRandom(msg.sender);
        emit Minted(msg.sender, id, true);
    }

    function paidMint() external payable nonReentrant {
        require(paidOpen, "paid closed");
        require(paidMinted < PAID_SUPPLY, "paid sold out");
        require(msg.value == paidPrice, "wrong price");
        require(paidMintedBy[msg.sender] < maxPaidPerWallet, "paid limit");
        _guard();
        paidMinted++;
        paidMintedBy[msg.sender]++;
        _pay(msg.value);
        uint256 id = _mintRandom(msg.sender);
        emit Minted(msg.sender, id, false);
    }

    function totalSupply() public view returns (uint256) { return freeMinted + paidMinted; }

    function _guard() private view {
        if (onlyEOA) require(msg.sender == tx.origin, "EOA only");
    }

    function _pay(uint256 amount) private {
        (bool ok, ) = payoutWallet.call{value: amount}("");
        require(ok, "payout failed");
    }

    // ambil ID acak dari yang tersisa, hasil 1..10000
    function _mintRandom(address to) private returns (uint256) {
        uint256 n = _remaining;
        uint256 rnd = uint256(keccak256(abi.encodePacked(
            block.prevrandao, block.timestamp, msg.sender, totalSupply(), n
        ))) % n;
        uint256 picked = _remap[rnd] == 0 ? rnd : _remap[rnd];
        uint256 last = n - 1;
        _remap[rnd] = _remap[last] == 0 ? last : _remap[last];
        _remaining = last;
        uint256 id = picked + 1;
        _mint(to, id);
        return id;
    }

    // ---------- METADATA ----------
    function _baseURI() internal view override returns (string memory) { return _base; }

    function tokenURI(uint256 id) public view override returns (string memory) {
        _requireOwned(id);
        return string.concat(_base, id.toString(), ".json");
    }

    // ---------- ADMIN ----------
    function setOpen(bool free_, bool paid_) external onlyOwner { freeOpen = free_; paidOpen = paid_; }
    function setPayoutWallet(address payable w) external onlyOwner { require(w != address(0)); payoutWallet = w; }
    function setLimits(uint256 free_, uint256 paid_) external onlyOwner { maxFreePerWallet = free_; maxPaidPerWallet = paid_; }
    function setOnlyEOA(bool v) external onlyOwner { onlyEOA = v; }
    function setBaseURI(string calldata u) external onlyOwner { require(!metadataLocked, "locked"); _base = u; }
    function lockMetadata() external onlyOwner { metadataLocked = true; }
}
