pragma solidity ^0.5.8;

import "./SafeMath.sol";
import "./ERC20d.sol";

contract Faucet {

    using SafeMath for uint;

    uint constant tokenReward = 50000000000000000000000;
    uint constant etherReward = 500000000000000000;

    mapping (address => uint) public _limitor;

    ERC20d public VLDY;

    constructor(address _source) public {
        VLDY = ERC20d(_source);
    }

    function() external payable {}

    function redeem() public {
        require(_limitor[msg.sender] < block.timestamp);

        _limitor[msg.sender] = block.timestamp.add(3600);
        VLDY.transfer(msg.sender, tokenReward);
        msg.sender.transfer(etherReward);
    }

}
