import React, { Component } from "react";
const BigNumber = require('bignumber.js');

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      inventario: [],
      itemsMarket: [(
        <div className="col-lg-12 p-3 mb-5 text-center monedas position-relative" key={`items-0`}>
          <h2 className=" pb-2">Loading... please wait</h2>
        </div>
    )],
      balance: "Loading...",
      miConsulta: "0x0000000000000000000000000000000000000000"
    }

    this.balance = this.balance.bind(this);
    this.inventario = this.inventario.bind(this);
    this.items = this.items.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {

    this.update();

  }

  async update() {

    this.balance();
    this.inventario();
    this.items();

  }

  async balance() {
    var balance =
      await this.props.wallet.contractToken.methods
        .balanceOf(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).toString(10);

    this.setState({
      balance: balance
    });
  }


  async buyItem(user ,id){

    var aprovado = await this.props.wallet.contractToken2.methods
    .allowance(this.props.currentAccount, this.props.wallet.contractInventario._address)
    .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber(10);

    if(aprovado <= 0){

      alert("insuficient aproved balance of DCSC, please aprove the netx transacction")
      await this.props.wallet.contractToken2.methods
      .approve(this.props.wallet.contractInventario._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });
    }

    var result = await this.props.wallet.contractInventario.methods
      .buyItemFromMarket(user,id)
      .send({ from: this.props.currentAccount });

    if(result){
      alert("item buy");
    }


    this.update();

  }

  async items() {
      
      var miConsulta;
      var marketv2 = [(
        <div className="col-lg-12 p-3 mb-5 text-center monedas position-relative" key={`items-0`}>
          <h2 className=" pb-2">Wallet Market</h2>
          <input type={"text"} id={"wallet-tienda"}/>
          <button className="btn btn-success" onClick={()=>{
            miConsulta = document.getElementById("wallet-tienda").value;
            this.setState({
              miConsulta: miConsulta
            });
            this.items();
            alert("searching: "+miConsulta);
          }}>Search</button>
        </div>
      )]

      await this.setState({
        itemsMarketv2: marketv2,
        loading: false
      });

      if(this.props.wallet.web3.utils.isAddress(this.props.consulta) && this.props.consulta !== "0x0000000000000000000000000000000000000000"){
        alert("Searching: "+this.props.consulta)
        document.getElementById("wallet-tienda").value = this.props.consulta;
        await this.setState({
          miConsulta: this.props.consulta
        });
      }
  
      if(!this.state.loading && this.props.wallet.web3.utils.isAddress(this.props.consulta) ){
  
        var itemsMarket = [];
  
        var _items = await this.props.wallet.contractInventario.methods
        .verItemsMarket()
        .call({ from: this.props.currentAccount });
  
        var enVenta = await this.props.wallet.contractInventario.methods
        .verMarket(this.state.miConsulta)
        .call({ from: this.props.currentAccount });
  
        //console.log(enVenta);
  
        for (let index = 0; index < enVenta[0].length; index++) {
  
          //console.log(item)

          var token = "DCSC";

          if(enVenta[2][index] === "0x7Ca78Da43388374E0BA3C46510eAd7473a1101d4"){
            token = "DCSC"
          }

          itemsMarket[index] = (
              <div className="col-lg-3 col-md-6 p-3 mb-5 text-center monedas position-relative border" key={`items-${index}`}>
                <h2 className=" pb-2"> {(_items[0][enVenta[0][index]]).replace(/-/g," ").replace("comun", "common").replace("formacion","formation").replace("epico","epic").replace("legendario","legendary")}</h2>
                <img
                  className=" pb-2"
                  src={"assets/img/" + _items[0][enVenta[0][index]] + ".png"}
                  width="100%"
                  alt=""
                />
  
                <h2 className="centradoFan">
                  <b></b>
                </h2>
                
                <div className="position-relative">
                  Fee 1 DCSC aditional in your wallet <br/>
                  <button className="btn btn-success" onClick={() => {this.buyItem(this.state.miConsulta,index);}}>
                  Buy for {new BigNumber(enVenta[1][index]).shiftedBy(-18).toString(10)} {token}
                  </button>
                </div>
              </div>
          );
  
        }
  
        this.setState({
          itemsMarket: itemsMarket,
          loading: false
        });
      }
    
    
    
  }


  async inventario() {

    var result = await this.props.wallet.contractInventario.methods
      .verInventario(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    var nombres_items = await this.props.wallet.contractInventario.methods
      .verItemsMarket()
      .call({ from: this.props.currentAccount });

      var inventario = []

    for (let index = 0; index < result.length; index++) {

        inventario[index] = (

          <div className="col-md-3 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + nombres_items[0][index] + ".png"} width="100%" alt={"team-"+nombres_items[0][index]} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {
    return (
      <><header className="masthead text-center ">
      <div className="masthead-content">
        <div className="container px-5">
        <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center bg-secondary bg-gradient text-white">
              <h2 className=" pb-4">CSC available:</h2><br></br>
              <h3 className=" pb-4">{this.state.balance}</h3>
            </div>

          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center">
              <h2 className=" pb-4">Items</h2>
            </div>
            {this.state.itemsMarketv2}
            {this.state.itemsMarket}

          </div>
        </div>
      </div>
    </header>

      </>
    );
  }
}
