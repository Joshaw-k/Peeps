pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PEEPS is ERC20 {
    constructor() ERC20("Peeps Socials", "PPS") {}

    function freeMint(
    ) external  {
        _mint(msg.sender, 50 ether);
    }
}