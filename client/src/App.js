import React, { Component } from "react";
import Button from "@atlaskit/button";

import Validation from "./contracts/communalValidation.json";
import ERC20d from "./contracts/ERC20d.json";

import truffleContract from "truffle-contract";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

const decimal = Math.pow(10,18);

class App extends Component {
  state = { web3: null, account: null, token: null , dapp: null };

  componentDidUpdate = async () => {
      await this.getBalances();
  }

  componentDidMount = async () => {

      const web = await getWeb3()
      const accounts = await web.eth.getAccounts()

      const AB1 = truffleContract(ERC20d)
      const AB2 = truffleContract(Validation)

      AB1.setProvider(web.currentProvider)
      AB2.setProvider(web.currentProvider)

      const instance1 = await AB1.deployed()
      const instance2 = await AB2.deployed()

      await this.setState({
        account: accounts[0],
          token: instance1,
           dapp: instance2,
           web3: web })
  };

  getBalances = async() => {
    const EGEM = (parseFloat(await this.state.web3.eth.getBalance(this.state.account))/decimal).toFixed(2);
    const VLDY = (parseFloat(await this.state.token.balanceOf(this.state.account))/decimal).toFixed(2)
    await this.setState({
      tokenBal: VLDY,
      gasBal: EGEM })
  }

  render() {
    return (
      <div className="App">
        <h1>VLDY MVP</h1>
        <h2> {this.state.account} </h2>
        <h3> {this.state.gasBal} &nbsp;EGEM</h3>
        <h3> {this.state.tokenBal} &nbsp;VLDY</h3>
      </div>
    );
  }
}

export default App;
