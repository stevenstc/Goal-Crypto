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
      balance: "Loading..."
    }

    this.balance = this.balance.bind(this);
    this.inventario = this.inventario.bind(this);
    this.buypack = this.buypack.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {

    this.update();

  }

  async update() {

    this.balance();
    this.inventario();

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


  async buyItem(id){

    console.log("ento a comprar un item")

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractInventario._address)
      .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber(10);

    /*
    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(0).toNumber();
    */

    if(aprovado > 0){

        var result = await this.props.wallet.contractInventario.methods
          .buyItemsGame(id)
          .send({ from: this.props.currentAccount });

        if(result){
          alert("item buy");
        }
    }else{
        alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractInventario._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });
      }


    this.update();

  }


  async buypack(tipo) {

    var aprovado = await this.props.wallet.contractToken.methods
    .allowance(this.props.currentAccount, this.props.wallet.contractInventario._address)
    .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber(10);

    if(aprovado <= 0){
      alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractInventario._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });
    }
    
    
    if(tipo === 1){
      await this.props.wallet.contractPreSale.methods.buypack1().send({ from: this.props.currentAccount });
    }else{
      await this.props.wallet.contractPreSale.methods.buypack2().send({ from: this.props.currentAccount });

    }
    
  }


  async inventario() {

    var result = await this.props.wallet.contractTokenNFT.methods
      .balanceOf(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    var inventario = []

    for (let index = 0; index < result; index++) {

      let id_item = await this.props.wallet.contractTokenNFT.methods
      .tokenOfOwnerByIndex(this.props.currentAccount , index).call({ from: this.props.currentAccount });

      let uri_item = await this.props.wallet.contractTokenNFT.methods
      .tokenURI(id_item).call({ from: this.props.currentAccount });

      let consulta = await fetch('https://proxy-wozx.herokuapp.com/https://goal-crypto.com/nft/teams/6');
      consulta = await consulta.json();

      console.log(consulta)

        inventario[index] = (

          <div className="col-3 p-1" key={`itemsTeam-${index}`}>
            <h2># {id_item}</h2>
            <h3>{consulta.title+" "+consulta.name}</h3>

            <img className="pb-4" src={consulta.image} width="100%" alt={"nft team "+consulta.title+" "+consulta.name} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {
    return (
      <>
      <img className="img-fluid" src="assets/img/banner-nft.png" alt="" ></img>

      <header className="masthead text-center ">
      <div className="masthead-content">
        <div className="container px-5">
        <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center bg-secondary bg-gradient text-white">
              <h2 className=" pb-4">GCP available:</h2><br></br>
              <h3 className=" pb-4">{this.state.balance}</h3>
            </div>

          </div>
          <div className="row">
            <div className="col-12 p-4 text-center">
              <h2 className=" pb-4">Buy Pack</h2>
            </div>

            <div className="col-6 p-4 text-center" onClick={()=>{this.state.buypack(1)}} style={{cursor: "pointer"}} >
              <img className="img-fluid" src="assets/img/pack1.png" alt="" ></img>
              <h2 className=" pb-4">Buy Pack for 50 usd (~715 GCP)</h2>
            </div>

            <div className="col-6 p-4 text-center" onClick={()=>{this.state.buypack(2)}} style={{cursor: "pointer"}} >
              <img className="img-fluid" src="assets/img/pack2.png" alt="" ></img>
              <h2 className=" pb-4">Buy Pack for 30 usd (~430 GCP)</h2>
            </div>

          </div>
          <div className="row">
            <div className="col-12 p-4 text-center">
              <h2 className=" pb-4">My Items Buyed</h2>
            </div>

            {this.state.inventario}

            
          </div>
        </div>
      </div>
    </header>

      </>
    );
  }
}
