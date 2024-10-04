// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Airdrop is ERC1155 {
    address owner;

    mapping(uint256 => string) tokenURI;

    mapping(address => Developers) developers;

    struct Developers {
        address user;
        bool isDev;
    }

    constructor() ERC1155("") {
        owner = msg.sender;

        _setURIS();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function signUp() external {
        require(developers[msg.sender].user == address(0), "Signed Up!");

        developers[msg.sender] = Developers({user: msg.sender, isDev: true});
    }

    function airdrop(address to, uint256 id, uint256 value) external onlyOwner {
        assert(id > 0);
        if (!developers[to].isDev) revert("Not qualified for airdrop!");
        if (id == 1 && value > 1) revert("You can only mint 1 NFT");

        super._mint(to, id, value, "");
    }

    function contractURI() public pure returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmfThmmntg4dKSa8EHmbRQWUkt36fzCK54EV3BeT4Ks7hE/ventura.json";
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return tokenURI[_id];
    }

    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return super.balanceOf(account, id);
    }

    function _setURIS() private {
        tokenURI[
            1
        ] = "https://ipfs.io/ipfs/QmfThmmntg4dKSa8EHmbRQWUkt36fzCK54EV3BeT4Ks7hE/creator.json";

        tokenURI[
            2
        ] = "https://ipfs.io/ipfs/QmfThmmntg4dKSa8EHmbRQWUkt36fzCK54EV3BeT4Ks7hE/poap.json";
    }
}
