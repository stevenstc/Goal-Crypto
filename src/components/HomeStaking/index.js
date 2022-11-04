import React, { Component } from "react";
var BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: 3 });

export default class HomeStaking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myInventario: [],
      itemsYoutube: [],
    };

    this.balance = this.balance.bind(this);
    this.staking = this.staking.bind(this);
    this.myStake = this.myStake.bind(this);
    this.retiro = this.retiro.bind(this);
    this.retiroDiv = this.retiroDiv.bind(this);
    this.payDiv = this.payDiv.bind(this);

    this.addStaking = this.addStaking.bind(this);


  }

  async componentDidMount() {
    setInterval(() => {
      this.balance();
      this.myStake();
    }, 3 * 1000);
  }

  async balance() {
    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });
    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(6).toString(10)


    var bloqueado = await this.props.wallet.contractStaking.methods
    .TOTAL_STAKING()
    .call({ from: this.props.currentAccount });
    bloqueado = new BigNumber(bloqueado).shiftedBy(-18).decimalPlaces(6).toString(10)


    var pool = await this.props.wallet.contractStaking.methods
    .DISTRIBUTION_POOL()
    .call({ from: this.props.currentAccount });
    pool = new BigNumber(pool).shiftedBy(-18).decimalPlaces(6).toString(10)

    this.setState({
      balanceCSC: balance,
      bloqueado: bloqueado,
      pool: pool
    }) 
  }

  async staking() {

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractStaking._address)
      .call({ from: this.props.currentAccount });

    var balance = await this.props.wallet.contractToken.methods
      .balanceOf(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    var valor = document.getElementById("cantidadCSC").value;

    var amount = (valor*10**18).toLocaleString();

    function replaceAll( text, busca, reemplaza ){
      while (text.toString().indexOf(busca) !== -1)
          text = text.toString().replace(busca,reemplaza);
      return text;
    }

    amount = await replaceAll(amount, ".", "" );
    amount = await replaceAll(amount, ",", "" );

    console.log(amount);

    var inicio = await this.props.wallet.contractStaking.methods
      .inicio()
      .call({ from: this.props.currentAccount });


    if(balance >= parseInt(valor*10**18)){

      if (aprovado <= 0) {
        await this.props.wallet.contractToken.methods
        .approve(this.props.wallet.contractStaking._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
        .send({ from: this.props.currentAccount });

      }

      if (Date.now() >= inicio*1000) {
        await this.props.wallet.contractStaking.methods
        .staking(amount)
        .send({ from: this.props.currentAccount });
        alert("Staking is done");
        document.getElementById("cantidadCSC").value = "";

      }else{
        alert("It's not time, please wait");
      }
        
      
    }else{
      alert("insuficient Founds");
    }

  }

  async addStaking() {

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractStaking._address)
      .call({ from: this.props.currentAccount });

    var balance = await this.props.wallet.contractToken.methods
      .balanceOf(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    var valor = prompt("tokens","1000");

    var amount = new BigNumber(valor).shiftedBy(18).toString(10)

    console.log(amount);

    if(balance >= amount){

      if (aprovado <= 0) {
        await this.props.wallet.contractToken.methods
        .approve(this.props.wallet.contractStaking._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
        .send({ from: this.props.currentAccount });

      }

      if (this.props.currentAccount === this.props.currentAccount+"") {
        await this.props.wallet.contractStaking.methods
        .recargarPool(amount)
        .send({ from: this.props.currentAccount });
        alert("send tokens to pool is done");

      }
        
      
    }else{
      alert("insuficient Founds");
    }

  }

  async myStake() {

    var dividendos = await this.props.wallet.contractStaking.methods
      .totalDividendos(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    dividendos = await this.props.wallet.contractStaking.methods
    .pago(dividendos)
    .call({ from: this.props.currentAccount });

    dividendos = new BigNumber(dividendos).shiftedBy(-18).decimalPlaces(6).toString(10)

    var depositos = await this.props.wallet.contractStaking.methods
    .depositoTotal(this.props.currentAccount)
    .call({ from: this.props.currentAccount });
    

    var listaDepositos = [];
    for (let index = 0; index < depositos.length; index++) {
      let valor = new BigNumber(depositos[index]).shiftedBy(-18).decimalPlaces(6).toString(10)

      let fecha = await this.props.wallet.contractStaking.methods
      .fecha(this.props.currentAccount,index)
      .call({ from: this.props.currentAccount });
      fecha = fecha*1000;
      let actual = Date.now()
      let bot = "success"
      let func = ()=>{this.retiro(index)};
      if(fecha > actual){
        bot = "secondary";
        func = ()=>{alert("please wait to: \n"+new Date(fecha))};

      }else{
        bot = "success";
        func = ()=>{this.retiro(index)};

      }

      fecha = new Date(fecha);

      let fecha2 = "Unavailable until: "+fecha.getDate()+"/"+(1+fecha.getMonth())+"/"+fecha.getFullYear()
      

      listaDepositos[index] = (<div key={"cosal"+index}>
      
        <p>{valor} GCP <button className={"btn btn-"+bot} title={fecha2} onClick={func}>Un-Stake</button></p>
      
      </div>);
      
    }

    this.setState({
      staked: dividendos,
      listaDepositos: listaDepositos
    }) 
    
  }


  async retiroDiv() {

    await this.props.wallet.contractStaking.methods
      .retiroDividendos(this.props.currentAccount)
      .send({ from: this.props.currentAccount })

  }

  
  async retiro(id) {

    await this.props.wallet.contractStaking.methods
      .retiro(id)
      .send({ from: this.props.currentAccount })

  }

  async payDiv() {

    await this.props.wallet.contractStaking.methods
      .pagarDividendos()
      .send({ from: this.props.currentAccount })

  }

  render() {
    return (
      <>
        <img className="img-fluid" src="assets/img/banner stake.png" alt="" ></img>
        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container px-5">
              <div className="row justify-content-md-center">
                <div className="col-md-auto text-center">
                  <h2 className=" pb-4">STAKING TOKEN GCP</h2>
                  <p>Automatically and daily generate more GCP tokens</p>
              
                </div>

              </div>

              <div className="row justify-content-md-center">


                <div className="col-6 text-center">
                  <h3 className=" ">POOL STAKING</h3>
                  <h4> <img height="50px" src="assets/img/monton-monedas.png" alt="gcp monton de monedas"></img> {this.state.pool} GCP</h4>
     
                </div>

                <div className="col-6 text-center">
                  <h3 className=" ">TOKENS GCP LOKED</h3>
                  <h4> <img height="50px" src="assets/img/moneda.png" alt="gcp monton de monedas"></img> {this.state.bloqueado} GCP</h4>

     
                </div>

              </div>
              <div style={{backgroundColor: "#461829", borderRadius: "30px"}}>
              <div className="row justify-content-md-center mt-4 pt-5">

                <div className="col-md-auto text-center">
                  <h3 className=" ">LOKED YOUR TOKENS GCP / 60 DAYS</h3>

                  <input type="number" className="form-control" id="cantidadCSC" placeholder="Min. 60 GCP"/><br />
                  <div className="contenedor" onClick={() => this.staking()} style={{cursor:"pointer"}}>
                    <div className="centrado content_div_boton" style={{width: "200px"}} >

                      <img src="assets/img/moneda.png" alt="goal crypto boton" width="30px"/>
                      {"  "}<b>Stake tokens GCP</b>
                    </div>
                  </div>

                </div>

              </div>
              <div className="row justify-content-md-center mt-4">

                <div className="col-md-auto text-center">
                  <h3 className=" ">YOUR REWARDS</h3>
                  <p>{this.state.staked} GCP</p>
                  
                 <button className="btn btn-warning" onClick={()=> this.retiroDiv()}><b>Claim GCP</b></button>

                </div>

              </div>

              <div className="row justify-content-md-center mt-4">

                <div className="col-md-auto text-center">
                  <h3 className=" ">YOUR DEPOSITS</h3>
                  
                  {this.state.listaDepositos}


                </div>

              </div>
              </div>

            </div>
          </div>
        </header>

        <div className="container mt-3 mb-3">
          <div className="row justify-content-md-center">
            <div className="col-2 text-right">
              <img
                id="metaicon"
                className="meta-gray"
                width="100"
                height="100"
                src="assets/img/coin.png"
                alt="logo metamask"
              />
            </div>
            <div className="col-8">
            <h3>Account Info</h3>
            <p>
              {this.props.currentAccount}
            <br></br>
                Current balance: <i id="getValue">{this.state.balanceCSC}</i>{" "}
                
            </p>
            </div>
          </div>
          <div style={{ marginTop: "30px" }} className="row text-center">
            <div className="col-md-12">
              
            </div>
          </div>
          <hr />

        </div>
        <span onClick={()=>{this.addStaking()}}>GCP</span>
      </>
    );
  }
}
