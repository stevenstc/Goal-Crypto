pragma solidity >=0.8.17;
// SPDX-License-Identifier: Apache-2.0 

library SafeMath {
  
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

interface BEP20_Interface {
  function allowance(address _owner, address _spender) external view returns (uint remaining);
  function transferFrom(address _from, address _to, uint _value) external returns (bool);
  function transfer(address direccion, uint cantidad) external returns (bool);
  function balanceOf(address who) external view returns (uint256);
  function decimals() external view returns (uint256);
  function totalSupply() external view returns (uint256);
}

interface IBEP721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function baseURI() external view returns (string memory);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;

    function mintWithTokenURI(address to, uint256 tokenId, string memory _tokenURI) external returns (bool);
}

abstract contract Context {

  constructor () { }

  function _msgSender() internal view returns (address payable) {
    return payable(msg.sender);
  }

  function _msgData() internal view returns (bytes memory) {
    this; 
    return msg.data;
  }
}

contract Admin is Context{
  mapping (address => bool) public admin;

  event NewAdmin(address indexed admin);
  event AdminRemoved(address indexed admin);

  constructor(){
    admin[_msgSender()] = true;
  }

  modifier onlyAdmin() {
    if(!admin[_msgSender()])revert();
    _;
  }

  function makeNewAdmin(address payable _newadmin) public onlyAdmin {
    if(_newadmin == address(0))revert();
    emit NewAdmin(_newadmin);
    admin[_newadmin] = true;
  }

  function makeRemoveAdmin(address payable _oldadmin) public onlyAdmin {
    if(_oldadmin == address(0))revert();
    emit AdminRemoved(_oldadmin);
    admin[_oldadmin] = false;
  }

}

contract PreSaleNFT is Context, Admin {

    using SafeMath for uint256;

    BEP20_Interface BEP20_Contract = BEP20_Interface(0xb775Aa16C216E34392e91e85676E58c3Ad72Ee77);

    IBEP721 BEP721_contract = IBEP721(0xA42Ab8e44674651d388348Fd561350d3Ee8b0fe9);

    uint256 public soldNFT;
    uint256 randNonce;
    uint256 valuePack1 = 715 * 10**18; // 2 items 
    uint256 valuePack2 = 430 * 10**18; // 1 item

    mapping(uint256 => uint256)public rarezaItem;

    /* comun 0 ||  epico 1 || legendario 2*/

    struct Item {
      uint256 cantidad;
      uint256 tipe;
      string uri;

    }

    Item[] public items;

    constructor(){
        items.push(Item(1,2,"1"));
        items.push(Item(4,2,"2"));
        items.push(Item(4,2,"3"));
        items.push(Item(4,2,"4"));
        items.push(Item(4,2,"5"));
        items.push(Item(10,1,"6"));
        items.push(Item(10,1,"7"));
        items.push(Item(10,1,"8"));
        items.push(Item(10,1,"9"));
        items.push(Item(10,1,"10"));
        items.push(Item(10,1,"11"));
        items.push(Item(10,1,"12"));
        items.push(Item(115,0,"13"));
        items.push(Item(115,0,"14"));
        items.push(Item(115,0,"15"));
        items.push(Item(115,0,"16"));
        items.push(Item(115,0,"17"));
        items.push(Item(115,0,"18"));
        items.push(Item(115,0,"19"));
        items.push(Item(115,0,"20"));
        items.push(Item(115,0,"21"));
        items.push(Item(115,0,"22"));
        items.push(Item(115,0,"23"));
        items.push(Item(115,0,"24"));
        items.push(Item(115,0,"25"));
        items.push(Item(115,0,"26"));
        items.push(Item(115,0,"27"));
        items.push(Item(115,0,"28"));
        items.push(Item(115,0,"29"));
        items.push(Item(115,0,"30"));
        items.push(Item(115,0,"31"));
        items.push(Item(115,0,"32"));
        items.push(Item(115,0,"33"));
        
    }

    function randMod(uint _modulus, uint _moreRandom) internal view returns(uint256){
       return uint256(keccak256(abi.encodePacked(soldNFT, items.length, _moreRandom, block.timestamp, _msgSender(), randNonce))) % _modulus;
    }

    function buyPack1() public {
        randNonce++; 

        if(items.length <= 0)revert("NMI");

        uint256 win = randMod(items.length-1, block.timestamp); // item 1
        uint256 id = BEP721_contract.totalSupply();

        if(!BEP20_Contract.transferFrom(_msgSender(), address(this), valuePack1))revert("TF");
        rarezaItem[id] = items[win].tipe;
        if(!BEP721_contract.mintWithTokenURI(_msgSender(), id, string(abi.encodePacked("teams/",items[win].uri))))revert("FP");
        items[win].cantidad = (items[win].cantidad).sub(1);
        if(items[win].cantidad <= 0){ delete items[win]; }

        randNonce++; 

        win = randMod(items.length-1, (block.timestamp).add(7)); // item 2
        id = BEP721_contract.totalSupply();
        rarezaItem[id] = items[win].tipe;
        if(!BEP721_contract.mintWithTokenURI(_msgSender(), id, string(abi.encodePacked("teams/",items[win].uri))))revert("FP");
        items[win].cantidad = (items[win].cantidad).sub(1);
        if(items[win].cantidad <= 0){ delete items[win]; }
        
    }

    function buyPack2() public {
        randNonce++; 

        uint256 win = randMod(items.length-1, block.timestamp);
        uint256 id = BEP721_contract.totalSupply();

        rarezaItem[id] = items[win].tipe;
        if(!BEP20_Contract.transferFrom(_msgSender(), address(this), valuePack2))revert("TF");
        if(!BEP721_contract.mintWithTokenURI(_msgSender(), id, string(abi.encodePacked("teams/",items[win].uri))))revert("FP");
        items[win].cantidad = (items[win].cantidad).sub(1);
        if(items[win].cantidad <= 0){ delete items[win]; }
        
    }

    function updatePrices(uint256 _valuePack1, uint256 _valuePack2) public onlyAdmin {
        valuePack1 = _valuePack1;
        valuePack2 = _valuePack2;
    }

}