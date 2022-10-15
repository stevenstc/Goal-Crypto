pragma solidity >=0.8.17;
// SPDX-License-Identifier: Apache 2.0

library SafeMath {

    function mul(uint a, uint b) internal pure returns (uint) {
        if (a == 0) {
            return 0;
        }

        uint c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint a, uint b) internal pure returns (uint) {
        require(b > 0);
        uint c = a / b;

        return c;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        require(b <= a);
        uint c = a - b;

        return c;
    }

    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a);

        return c;
    }

}

interface TRC20_Interface {

    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function transferFrom(address _from, address _to, uint _value) external returns (bool);
    function transfer(address direccion, uint cantidad) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns (uint256);
    function totalSupply() external view returns (uint256);
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

contract Ownable is Context {
  address payable public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  constructor(){
    owner = payable(_msgSender());
  }
  modifier onlyOwner() {
    if(_msgSender() != owner)revert();
    _;
  }
  function transferOwnership(address payable newOwner) public onlyOwner {
    if(newOwner == address(0))revert();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract Admin is Context, Ownable{
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

  function makeNewAdmin(address payable _newadmin) public onlyOwner {
    if(_newadmin == address(0))revert();
    emit NewAdmin(_newadmin);
    admin[_newadmin] = true;
  }

  function makeRemoveAdmin(address payable _oldadmin) public onlyOwner {
    if(_oldadmin == address(0))revert();
    emit AdminRemoved(_oldadmin);
    admin[_oldadmin] = false;
  }

}

contract StakingPool is Context, Admin{
  using SafeMath for uint;

  TRC20_Interface CSC_Contract = TRC20_Interface(0x389ccc30de1d311738Dffd3F60D4fD6188970F45);

  TRC20_Interface OTRO_Contract = TRC20_Interface(0x389ccc30de1d311738Dffd3F60D4fD6188970F45);

  struct Usuario {
    uint participacion;

  }

  mapping(address => uint256[]) public deposito;
  mapping(address => uint256[]) public tokenInterno;
  mapping(address => uint256[]) public fecha;

  uint public MIN_DEPOSIT = 84 * 10**18;
  uint public MAX_DEPOSIT = 84000 * 10**18;
  uint public DISTRIBUTION_POOL = 2085000 * 10**18;
  uint public TOTAL_STAKING;
  uint public TOTAL_PARTICIPACIONES;
  uint public PAYER_POOL_BALANCE;
  uint public inicio = 1636578000;
  uint public lastPay = 1636578000;

  uint public duracion = 1*86400;
  
  uint public precision = 18;

  mapping (address => Usuario) public usuarios;

  constructor() { }

  function RATE() public view returns (uint){
    if(TOTAL_PARTICIPACIONES == 0){
      return 10**precision;
    }else{
      return (PAYER_POOL_BALANCE.mul(10**precision)).div(TOTAL_PARTICIPACIONES);

    }
  }

  function compra(uint _value) public view returns(uint){
      return (_value.mul(10**precision)).div(RATE());
  }
  
  function staking(uint _token) public  {

    if(block.timestamp < inicio )revert();
    if(_token < MIN_DEPOSIT)revert();
    if(_token > MAX_DEPOSIT)revert();

    if( !CSC_Contract.transferFrom(msg.sender, address(this), _token) )revert();

    tokenInterno[msg.sender].push(compra(_token));
    TOTAL_PARTICIPACIONES += compra(_token);
    PAYER_POOL_BALANCE += _token;

    fecha[msg.sender].push(block.timestamp);
    deposito[msg.sender].push(_token);

    TOTAL_STAKING += _token;

  }

  function pago(uint _value) public view returns (uint256){
    return (_value.mul(RATE())).div(10**precision);
  }

  function retiro(uint _deposito) public {

    if(fecha[msg.sender][_deposito]+duracion > block.timestamp)revert();

    uint pagare = pago(tokenInterno[msg.sender][_deposito]);
    
    if( !CSC_Contract.transfer(msg.sender, pagare) )revert();

    TOTAL_PARTICIPACIONES -= tokenInterno[msg.sender][_deposito];
    PAYER_POOL_BALANCE -= pagare;
    TOTAL_STAKING -= deposito[msg.sender][_deposito];

    tokenInterno[msg.sender][_deposito] = tokenInterno[msg.sender][tokenInterno[msg.sender].length - 1];
    tokenInterno[msg.sender].pop();

    deposito[msg.sender][_deposito] = deposito[msg.sender][deposito[msg.sender].length - 1];
    deposito[msg.sender].pop();

    fecha[msg.sender][_deposito] = fecha[msg.sender][fecha[msg.sender].length - 1];
    fecha[msg.sender].pop();

  }
  
  function depositoTotal(address _user) public view returns (uint[] memory){
    return deposito[_user];
  }

  function pagarDividendos() public{

    uint pd = DISTRIBUTION_POOL.mul(2).div(100);
    DISTRIBUTION_POOL -= pd;
    PAYER_POOL_BALANCE += pd;
    lastPay = block.timestamp;

  }

  function recargarPool(uint _token) public{

    if( !CSC_Contract.transferFrom(msg.sender, address(this), _token) )revert();
    DISTRIBUTION_POOL += _token;

  }

  function dividendos(address _user) public view returns (uint[] memory){

    uint[] memory userpart = tokenInterno[_user];

    uint[] memory totDiv = new uint[](userpart.length);

    for (uint256 index = 0; index < userpart.length; index++) {
      totDiv[index] = userpart[index].sub(compra(deposito[_user][index]));
    }

    return totDiv;
  }

  function totalDividendos(address _user) public view returns (uint){

    uint[] memory userpart = dividendos(_user);

    uint totDiv;

    for (uint256 index = 0; index < userpart.length; index++) {
      totDiv += userpart[index] ;
    }

    return totDiv;
  }

  function retiroDividendos(address _user) public {

    uint tokenIN = totalDividendos(_user);
    uint tokenEX = pago(totalDividendos(_user));

    if( !CSC_Contract.transfer(_user, tokenEX ))revert();

    for (uint256 index = 0; index < dividendos(_user).length; index++) {
      tokenInterno[_user][index] -= dividendos(_user)[index];
    }

    TOTAL_PARTICIPACIONES -= tokenIN;
    PAYER_POOL_BALANCE -= tokenEX;

  }


  function ChangeToken(address _tokenTRC20) public onlyOwner returns (bool){

    CSC_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }

  function ChangeTokenOTRO(address _tokenTRC20) public onlyOwner returns (bool){

    OTRO_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }

  function actualizarFechas(uint _inicio) public onlyOwner returns(bool){
    inicio = _inicio;
   
    return true;
  }

  function updateMAXMIN(uint _min , uint _max) public onlyOwner {
    MIN_DEPOSIT = _min;
    MAX_DEPOSIT = _max;
  }

  function updateDuracion(uint _time) public onlyOwner {
    duracion = _time;
  }

  

  function redimCSC(uint _value) public onlyOwner returns (uint) {

    if ( CSC_Contract.balanceOf(address(this)) < _value)revert();

    CSC_Contract.transfer(owner, _value);

    return _value;

  }

  function redimOTRO() public onlyOwner returns (uint){

    uint256 valor = OTRO_Contract.balanceOf(address(this));

    OTRO_Contract.transfer(owner, valor);

    return valor;
  }

  function redimBNB() public onlyOwner returns (uint){

    if ( address(this).balance == 0)revert();

    payable(owner).transfer( address(this).balance );

    return address(this).balance;

  }

  fallback() external payable {}

  receive() external payable {}

}