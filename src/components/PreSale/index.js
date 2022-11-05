import React, { Component } from "react";
import cons from "../../cons"

const BigNumber = require('bignumber.js');

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      inventario: [],
      itemsMarket: [(
        <div className="col-12 p-3 mb-5 text-center monedas position-relative" key={`items-0`}>
          <h2 className=" pb-2">Loading... please wait</h2>
        </div>
    )],
      balance: "Loading..."
    }

    this.balance = this.balance.bind(this);
    this.inventario = this.inventario.bind(this);
    this.buypack = this.buypack.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {
    this.update();
    setInterval(()=>{
      this.update();
    },15*1000)
    
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

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(6).toString(10);

    this.setState({
      balance: balance
    });
  }


  async buypack(tipo) {

    var aprovado = await this.props.wallet.contractToken.methods
    .allowance(this.props.currentAccount, this.props.wallet.contractPreSale._address)
    .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber(10);

    console.log(aprovado)
    if(aprovado <= 0){
      alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractPreSale._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });
    }
    
    
    if(tipo === 1){
      await this.props.wallet.contractPreSale.methods.buyPack1().send({ from: this.props.currentAccount });

    }else{
      await this.props.wallet.contractPreSale.methods.buyPack2().send({ from: this.props.currentAccount });

    }
    this.update();
    alert("Pack Buyed!")
    
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

      let consulta = await  fetch(uri_item).catch(()=>{return false;});

      if(!consulta.ok){
        consulta = await  fetch(cons.API+uri_item).catch(()=>{return false;});
        console.log("usando proxy");
      }

      if(consulta.ok){
        consulta = await consulta.json();
      
        inventario[index] = (

          <div className="col-3 p-1" key={`itemsTeam-${index}`}>
            <h2># {id_item}</h2>
            <h3>{consulta.title+" "+consulta.name}</h3>

            <img className="pb-4" src={consulta.image} width="100%" alt={"nft team "+consulta.title+" "+consulta.name} />
          </div>

        )
      }else{
        inventario[index] = (

          <div className="col-3 p-1" key={`itemsTeam-${index}`}>
            <h2># {id_item}</h2>
          </div>

        )

      }
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
            <div className="col-lg-12 col-md-12 p-4 text-center  text-white">
              <h2 className=" pb-4">GCP available: {this.state.balance}</h2>
            </div>

          </div>
          <div className="row mt-1" style={{backgroundColor: "#461829", borderRadius: "30px"}}>
            <div className="col-12 p-4 text-center">
              <h2 className=" pb-4">Buy Pack</h2>
            </div>

            <div className="col-6 p-4 text-center" onClick={()=>{this.buypack(1)}} style={{cursor: "pointer"}} >
              <img className="img-fluid" src="assets/img/pack1.png" alt="" ></img>
              <h2 className=" pb-4"><button className="btn btn-warning btn-lg"><b>Buy for 715 GCP</b></button></h2>
            </div>

            <div className="col-6 p-4 text-center" onClick={()=>{this.buypack(2)}} style={{cursor: "pointer"}} >
              <img className="img-fluid" src="assets/img/pack2.png" alt="" ></img>

              <h2 className=" pb-4"><button className="btn btn-warning btn-lg"><b>Buy for 430 GCP</b></button></h2>
              
            </div>

          </div>
          <div className="row">
            <div className="col-12 p-4 text-center">
              <h2 className=" pb-4">My NFT's Buyed</h2>
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
