var TOKEN = "0x2F7A0EE68709788e1Aa8065a300E964993Eb7B08"; //token principal
var tokenCSC = "0x2F7A0EE68709788e1Aa8065a300E964993Eb7B08"; //token principal
var tokenUSDT = "0x55d398326f99059fF775485246999027B3197955"; //USDT

var SC = "0x2846df5d668C1B4017562b7d2C1E471373912509";// Market
var SC2 = "0xCFC32818E73C6dfc8b94d783049ABB40d44193d0";// votacion
var SC3 = "0xB0ECC2A9De8918C2E02Ea7Cd565AE2eeCdacE0F8";// Staking pool

const SC4 = "0xe5578751439d52cf9958c4cf1A91eeb3b11F854C";// Faucet Testent

var SC5 = "0x16Da4914542574F953b31688f20f1544d4E89537";// Inventario
var SC6 = "0x7eeAA02dAc001bc589703B6330067fdDAeAcAc87";// Exchange

var MC1 = "0x03f35b2923ebf59e7768852ae758D0b7B5FA8445";// match 1
var MC2 = "0xB8909ADb063Fa491A8F78c1510258B66c96f9670";// match 2
var MC3 = "0xB8909ADb063Fa491A8F78c1510258B66c96f9670";// match 3


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
    SC = "0xCB553b2128fAb586E8C6601983cdb134eaBdd989";//"0xfF7009EF7eF85447F6A5b3f835C81ADd60a321C9";// contrato test market
    SC2 = "0x0C4dDC36273ADBb967C78D3Ee0e7ea79200f1a30";// contrado test votacion fan
    SC3 = "0x87C24A718ef840274356D76f5c065562F72F6C54";// contrado test Staking-pool
    SC5 = "0xEeAB65c0e3076985E2aDBd8119D8e5B4784185c5"; // Inventario
    SC6 = "0x082621b836f5212731Ea2c6849f4D91813169B72"; // Exchange
    MC1 = "0x2a41eFc800DC61158AB83E86949D1bCE08f8287C";// contrado test votacion match 1
    MC2 = "0x2BB0AF22edB16a8eBfec8657023B24A26fBDD4e1";// contrado test votacion match 2
    MC3 = "0x2BB0AF22edB16a8eBfec8657023B24A26fBDD4e1";// contrado test votacion match 3



    chainId = '0x61';
    API = "https://brutustronstaking.tk/csc-testnet/";
    WALLETPAY = "0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00";
}

const FACTOR_GAS = 3;

export default {WALLETPAY, FACTOR_GAS, SC, SC2, SC3, SC4, SC5, SC6, MC1, MC2, TOKEN, tokenCSC, SCK, SCKDTT, API, API2, chainId, tokenUSDT};
