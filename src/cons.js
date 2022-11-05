var TOKEN = "0xb775Aa16C216E34392e91e85676E58c3Ad72Ee77"; //token principal
var tokenCSC = "0xb775Aa16C216E34392e91e85676E58c3Ad72Ee77"; //token principal
var tokenUSDT = "0x55d398326f99059fF775485246999027B3197955"; //USDT
var tokenNFT = "0x55d398326f99059fF775485246999027B3197955"; //token NFT

var SC = "0x2846df5d668C1B4017562b7d2C1E471373912509";// Market

var SC2 = "0x71F88Ed707E2D4f9eC1ef66Cf0A2744b08306Ede";// votacion - voter mundial
var SC3 = "0xDd5CFf7fCCfd386E857ED03DB574Ed65e6941E98";// Staking pool

const SC4 = "0xe5578751439d52cf9958c4cf1A91eeb3b11F854C";// Faucet Testent

var SC5 = "0x16Da4914542574F953b31688f20f1544d4E89537";// Inventario
var SC6 = "0x7eeAA02dAc001bc589703B6330067fdDAeAcAc87";// Exchange

var MC1 = "0x6F047130Ac7f6F0BC2EC21e267863C21F4A94616";// match 1
var MC2 = "0x98122A3c7183D40df853514b3C77537eEE9520ce";// match 2
var MC3 = "0xB8909ADb063Fa491A8F78c1510258B66c96f9670";// match 3

var preSale = "0xB8909ADb063Fa491A8F78c1510258B66c96f9670" //presale NFT

var chainId = '0x38';

var SCK = process.env.APP_CSRK;
var SCKDTT = process.env.APP_TOKNN;

var API = "";
var API2 = "";

var WALLETPAY = "0x00326ad2E5ADb9b95035737fD4c56aE452C2c965";

const TESTNET = false; 

if(TESTNET){
    tokenCSC = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc"//token no correcto
    tokenUSDT = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc";// usdt de pruebas
    TOKEN = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc"; //token de pruebas
    tokenNFT = "0x9878278b71E160AA1bb0dEED20c71a00DF4e3f01"; // token NFT de pruebas
    SC = "0xCB553b2128fAb586E8C6601983cdb134eaBdd989";//"0xfF7009EF7eF85447F6A5b3f835C81ADd60a321C9";// contrato test market
    SC2 = "0x0C4dDC36273ADBb967C78D3Ee0e7ea79200f1a30";// contrado test votacion fan
    SC3 = "0x87C24A718ef840274356D76f5c065562F72F6C54";// contrado test Staking-pool
    SC5 = "0xEeAB65c0e3076985E2aDBd8119D8e5B4784185c5"; // Inventario
    SC6 = "0x082621b836f5212731Ea2c6849f4D91813169B72"; // Exchange
    MC1 = "0x2a41eFc800DC61158AB83E86949D1bCE08f8287C";// contrado test votacion match 1
    MC2 = "0x2BB0AF22edB16a8eBfec8657023B24A26fBDD4e1";// contrado test votacion match 2
    MC3 = "0x2BB0AF22edB16a8eBfec8657023B24A26fBDD4e1";// contrado test votacion match 3
    preSale = "0xD0f16Fe96cbC4Fde487df871262d5C3D880b7184"; // testnet presale NFT

    API = "https://proxy-wozx.herokuapp.com/";

    chainId = '0x61';
    WALLETPAY = "0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00";
}

const FACTOR_GAS = 3;

export default {WALLETPAY, FACTOR_GAS, SC, SC2, SC3, SC4, SC5, SC6, MC1, MC2, MC3, preSale, TOKEN, tokenNFT, tokenCSC, SCK, SCKDTT, API, API2, chainId, tokenUSDT};
