import React, { Component } from "react";
var BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: 3 });

export default class HomeFan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myInventario: [],
      itemsYoutube: [],
      balanceCSC: 0,
      balanceContract: 0
    };

    this.balance = this.balance.bind(this);
    this.items = this.items.bind(this);
    this.myItems = this.myItems.bind(this);
    this.votar = this.votar.bind(this);
  }

  async componentDidMount() {
    setInterval(() => {
      this.balance();
      this.items();
      this.myItems();
    }, 3 * 1000);
  }

  async balance() {
    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount).call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(6).toString(10);


    var balanceContract = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.wallet.contractFan._address).call({ from: this.props.currentAccount });

    balanceContract = new BigNumber(balanceContract).shiftedBy(-18).decimalPlaces(2).toString(10);


    this.setState({
      balanceCSC: balance,
      balanceContract: balanceContract
    });
  }

  async votar(id) {

    var largo = await this.props.wallet.contractFan.methods
    .largoFanItems(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var votosTeam = 0;

    for (let index = 0; index < largo; index++) {

      var invent = await this.props.wallet.contractFan.methods
        .verFanItems(this.props.currentAccount, index)
        .call({ from: this.props.currentAccount });
        
      if (invent) {
        votosTeam++;
      }
    }

    if(votosTeam >= 3){
      alert("max of votes reached");
      return;
    }

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractFan._address)
      .call({ from: this.props.currentAccount });

    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var valor = await this.props.wallet.contractFan.methods
      .valor()
      .call({ from: this.props.currentAccount });

    if(balance/10**18 >= valor/10**18){
      if (aprovado <= 0) {
        await this.props.wallet.contractToken.methods
        .approve(this.props.wallet.contractFan._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
        .send({ from: this.props.currentAccount });

      }

      await this.props.wallet.contractFan.methods
      .votar(id)
      .send({ from: this.props.currentAccount });

      alert("Vote is done");

    }else{
      alert("insuficient Founds")
    }

    

  }

  async items() {
    var itemsYoutube = [];

    var result = await this.props.wallet.contractFan.methods
      .largoItems()
      .call({ from: this.props.currentAccount });

    var inicio = await this.props.wallet.contractFan.methods
      .inicio()
      .call({ from: this.props.currentAccount });
    inicio = inicio*1000;

    var fin = await this.props.wallet.contractFan.methods
      .fin()
      .call({ from: this.props.currentAccount });
    fin = fin*1000;

    var eliminated = [
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{},{},
      {},{}

    ];

    var filterElimitaded = [
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"}
    ]

    for (let index = 0; index < result; index++) {

      var valor = await this.props.wallet.contractFan.methods
        .valor()
        .call({ from: this.props.currentAccount });

      valor = valor/10**18 +" GCP";


      if(Date.now() > fin){
        valor = "Finished";
        eliminated = filterElimitaded;
      }

      if(Date.now() < inicio){
        valor = "Soon...";
      }
        
      if(eliminated[index].filter){
        //valor = "Eliminated";
      }

      var votos = await this.props.wallet.contractFan.methods
        .votos(index)
        .call({ from: this.props.currentAccount });

      itemsYoutube[index] = (
          <div className="col-lg-3 col-md-6 p-3 mb-5 text-center monedas position-relative" key={`items-${index}`}>
            <h2 className=" pb-2">Team #{index+1}</h2>
            <img
              className=" pb-2"
              src={"assets/img/VOTACION " + (index+1) + ".png"}
              style={eliminated[index]} 
              width="100%"
              alt="equipo del mundial"
            />

            <h2 className="centradoFan">
              <b>{votos} votes</b>
            </h2>


            <div className="contenedor" onClick={() => this.votar(index)} style={{cursor:"pointer"}}>
              <div className="centrado" id="content_div_one_photo">
                <img src="assets/img/moneda.png" alt="goal crypto boton" width="30px"/>
                {"  "}<b>{valor}</b>
                </div>
            </div>
            
           
            
          </div>
      );
    }

    this.setState({
      itemsYoutube: itemsYoutube,
    });
  }

  async myItems() {
    var largo = await this.props.wallet.contractFan.methods
    .largoFanItems(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var myInventario = [];

    var verGanador = await this.props.wallet.contractFan.methods
      .verGanador()
      .call({ from: this.props.currentAccount });

      console.log(largo);


    for (let index = 0; index < largo; index++) {
      var votos = await this.props.wallet.contractFan.methods
        .votos(index)
        .call({ from: this.props.currentAccount });

      var invent = await this.props.wallet.contractFan.methods
        .verFanItems(this.props.currentAccount, index)
        .call({ from: this.props.currentAccount });

      var claim = (<></>);

      if(verGanador != largo){

        if (verGanador === index+""){

          claim = (
          <button
            className="btn btn-info"
            onClick={async() => await this.props.wallet.contractFan.methods
              .reclamar()
              .send({ from: this.props.currentAccount })}
          >
              Claim Prize
          </button>
          );
        }

      }
        
        
      if (invent) {
        myInventario[index] = (
            <div className="col-lg-4 col-md-12 p-4 mb-5 text-center monedas" key={`items-${index}`}>
              <h2 className=" pb-4">Team #{index+1}</h2>
              <p>{votos} global votes</p>
              <img
                className=" pb-4"
                src={"assets/img/VOTACION " + (index+1) + ".png"}
                width="100%"
                alt=" imagen team wold cup"
              />
              
              {claim}
            </div>
        );
      }
    }

    this.setState({
      myInventario: myInventario,
    });
  }

  render() {
    return (
      <>

        <img className="img-fluid" src="images/hero_bg_4.png"></img>

        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container px-5">
              <div className="row">
                <div className="col-lg-12 col-md-12 p-4 text-center" key="headitems">
                  <h2 className=" pb-4">Vote for your favorite mundial team</h2>
                  <p>Only one (1) vote can be per team (max 3)</p>
                  <p>Vote with your GCP tokens for your favorite team to win the World Cup, 90% of the pool accumulated among the voters will be distributed equally among the voters of the winning team of the World Cup.</p>
                  <h2 className=" pb-4">Pool accumulated</h2>
                
                  <h3><img src="assets/img/moneda.png" alt="goal crypto boton" width="50px"/>
                    {" "}<b>{this.state.balanceContract} GCP</b></h3>
                  
                </div>

                {this.state.itemsYoutube}
              </div>
            </div>
          </div>
        </header>
        <div className="container mt-3 mb-3">
        <div className="row text-center">
          <div className="col-12">
          <h2>My Votes</h2>
          <hr color="white"></hr>
          </div>
        </div>
          <div className="row text-center">
            {this.state.myInventario}
          </div>
        </div>

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
        
      </>
    );
  }
}
