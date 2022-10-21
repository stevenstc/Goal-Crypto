import React, { Component } from "react";
import M1 from "../Matches/M1";
import M2 from "../Matches/M2";


var BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: 3 });


export default class HomeFan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      balanceCSC: 0
    };

  }

  async componentDidMount() {
    setInterval(() => {
      this.balance();

    }, 3 * 1000);
  }

  async balance() {
    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount).call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(6).toString(10);

    this.setState({
      balanceCSC: balance
    });
  }



  render() {
    return (
      <>

        <img className="img-fluid" src="images/pvotacion.png"></img>

        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container px-5">
              <div className="row">
                <div className="col-lg-12 col-md-12 p-4 text-center" key="headitems">
                  <h2 className=" pb-4">Vote for your favorite Team</h2>
                  <p>Only one (1) vote can be per Match </p>
                  

                  
                </div>

              </div>
            </div>
          </div>
        </header>

        <M1 wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>
        <M2 wallet={this.props.wallet} currentAccount={this.props.currentAccount}/>


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
