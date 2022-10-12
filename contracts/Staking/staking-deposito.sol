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
  mapping(address => uint256[]) public fecha;
  mapping(address => uint256[]) public retirado;
  mapping(address => bool[]) public reclamado;


  uint public MIN_DEPOSIT = 10 * 10**18;
  uint public DISTRIBUTION_POOL = 2085000 * 10**18;
  uint public TOTAL_PARTICIPACIONES;
  uint public PAYER_POOL_BALANCE;
  uint public inicio = 1636578000;
  uint public lastPay = 1636578000;
  
  uint public precision = 18;

  mapping (address => Usuario) public usuarios;

  constructor() { }



  function CSC_PAY_BALANCE() public view returns (uint){
    return address(this).balance;
  }

  function ChangeToken(address _tokenTRC20) public onlyOwner returns (bool){

    CSC_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }

  function ChangeTokenOTRO(address _tokenTRC20) public onlyOwner returns (bool){

    OTRO_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }
  
  function compra(uint _value) public view returns(uint){
    return (_value.mul(10**precision)).div(RATE());
  }
  
  function staking(uint _token) public  {

    if(block.timestamp < inicio )revert();
    if(_token < MIN_DEPOSIT)revert();
    if( !CSC_Contract.transferFrom(msg.sender, address(this), _token) )revert();

    reclamado[msg.sender].push(false);
    fecha[msg.sender].push(block.timestamp);
    deposito[msg.sender].push(_token);
    retirado[msg.sender].push(0);

    TOTAL_PARTICIPACIONES += _token;

  }
  
  function pago(uint _value) public view returns (uint256){
    _value = _value.mul(RATE());
    return _value.div(10**precision);
  }

  function depositoTotal(address _user) public view returns (uint256){

    uint _value = 0;
    for (uint256 index = 0; index < deposito[_user].length; index++) {
      if (!reclamado[msg.sender][index]) {
        _value += deposito[msg.sender][index];
      } 
    }
    return _value;
  }

  function retiradoTotal(address _user) public view returns (uint256){

    uint _value = 0;
    for (uint256 index = 0; index < deposito[_user].length; index++) {
      if (!reclamado[msg.sender][index]) {
        _value += retirado[msg.sender][index];
      } 
    }
    return _value;
  }

  function participacion(address _user) public view returns (uint256){

    return (depositoTotal(_user).mul(10**precision)).div(TOTAL_PARTICIPACIONES*100);
  }

  function dividendos(address _user) public view returns (uint256){

    return (((PAYER_POOL_BALANCE.mulparticipacion(_user)).div(10**precision))).sub(retiradoTotal(_user));
  }

  function retiro(uint _deposito) public {

    if(_deposito > reclamado[msg.sender].length)revert();
    if(reclamado[msg.sender][_deposito])revert();
    if(fecha[msg.sender][_deposito] < block.timestamp)revert();
    
    if(TOTAL_PARTICIPACIONES < deposito[msg.sender][_deposito])revert();
    if( !CSC_Contract.transfer(msg.sender, deposito[msg.sender][_deposito]) )revert();

    TOTAL_PARTICIPACIONES -= deposito[msg.sender][_deposito];
    reclamado[msg.sender][_deposito] = true;

  }

  function actualizarFechas(uint _inicio) public onlyOwner returns(bool){
    inicio = _inicio;
   
    return true;
  }

  function redimCSC(uint _value) public onlyOwner returns (uint256) {

    if ( CSC_Contract.balanceOf(address(this)) < _value)revert();

    CSC_Contract.transfer(owner, _value);

    return _value;

  }

  function redimOTRO() public onlyOwner returns (uint256){

    uint256 valor = OTRO_Contract.balanceOf(address(this));

    OTRO_Contract.transfer(owner, valor);

    return valor;
  }

  function redimBNB() public onlyOwner returns (uint256){

    if ( address(this).balance == 0)revert();

    payable(owner).transfer( address(this).balance );

    return address(this).balance;

  }

  fallback() external payable {}

  receive() external payable {}

}