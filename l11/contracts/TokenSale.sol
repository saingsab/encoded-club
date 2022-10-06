// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMyERC20Token {
     function mint(address to, uint256 amount) external;
     function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external;
}

contract TokenSale {
    /// @notice Purchase Ratio between Sale ERC20 and Ether
    uint256 public ratio;
    IMyERC20Token public  paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function purchaseTokens() public payable {
        uint256 etherReceived = msg.value;
        uint256 tokenTobeEarned = etherReceived / ratio;
        paymentToken.mint(msg.sender, tokenTobeEarned);
    }

    function burnTokens(uint256 amount) public {
        paymentToken.transferFrom(msg.sender, address(this), amount);
    }

}