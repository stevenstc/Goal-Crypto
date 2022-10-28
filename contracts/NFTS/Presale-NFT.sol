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

library dinamicArray{
    
    function addArray(address[] memory oldArray)public pure returns ( address[] memory) {

        //añade un espacio para un nuevo dato
        address[] memory newArray =   new address[](oldArray.length+1);
    
        for(uint i = 0; i < oldArray.length; i++){
            newArray[i] = oldArray[i];
        }
        
        return newArray;
    }

    function subArray(address[] memory oldArray)public pure returns ( address[] memory) {

        //borra los espacios que esten con address(0)
        address[] memory newArray;
        uint largo;

        for(uint i = 0; i < oldArray.length; i++){
            if(oldArray[i] != address(0)){
                newArray = addArray(newArray);
                newArray[largo] = oldArray[i];
                largo++;
            }
        }
        
        return newArray;
    }
  
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

contract PreSaleNFT is Context {

    using SafeMath for uint256;

    BEP20_Interface BEP20_Contract = BEP20_Interface(0x2F7A0EE68709788e1Aa8065a300E964993Eb7B08);

    IBEP721 BEP721_contract = IBEP721(0x4215227B9C913a18a22995988899dFCEB2e07740);

    uint256 public soldNFT;
    uint256 tipesNFT = 33;
    uint256 randNonce;

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
       return uint256(keccak256(abi.encodePacked(soldNFT, tipesNFT, items.length, _moreRandom, block.timestamp, _msgSender(), randNonce))) % _modulus;
    }

    function buyPack() public {
        randNonce++; 

        uint256 win = randMod(tipesNFT-1, block.timestamp);

        BEP721_contract.mintWithTokenURI(_msgSender(), BEP721_contract.totalSupply(), string(abi.encodePacked(BEP721_contract.baseURI(),items[win].uri)));

        items[win].cantidad = (items[win].cantidad).sub(1);
        
        if(items[win].cantidad <= 0){
            delete items[win];
        }
        
    }

}