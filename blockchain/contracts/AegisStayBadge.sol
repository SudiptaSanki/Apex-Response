// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AegisStayBadge is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    mapping(address => uint256) public reputationPoints;
    mapping(address => bool) public verifiedResponders;

    event IncidentReported(address reporter, uint256 lat, uint256 lng, string mediaHash);
    event ReputationRewarded(address responder, uint256 points);
    event BadgeIssued(address responder, uint256 tokenId, string uri);

    constructor() ERC721("AegisStay Hero Badge", "AHB") {}

    function resolveIncidentAndReward(uint256 lat, uint256 lng, string memory mediaHash, uint256 points, string memory tokenURI) external {
        // 1. Report Incident
        emit IncidentReported(msg.sender, lat, lng, mediaHash);
        
        // 2. Add Reputation
        reputationPoints[msg.sender] += points;
        verifiedResponders[msg.sender] = true;
        emit ReputationRewarded(msg.sender, points);
        
        // 3. Issue Soulbound Token
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit BadgeIssued(msg.sender, newItemId, tokenURI);
    }

    // SBT Logic - no transfers allowed
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "Err: Token is Soulbound");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
