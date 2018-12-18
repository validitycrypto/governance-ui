import React, { Component } from "react";
import Button from "@atlaskit/button";


import { faUser, faUsers, faShareAlt, faUserTag, faStar, faShieldAlt, faLink, faStreetView, faCheck, faTimes , faDiceFive, faEnvelope, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Segment, Icon, Table } from 'semantic-ui-react'

import Validation from "./contracts/communalValidation.json";
import ERC20d from "./contracts/ERC20d.json";

import truffleContract from "truffle-contract";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

const decimal = Math.pow(10,18);

class App extends Component {
  state = { web3: null, account: null, token: null , dapp: null, log: [[],[],[],[]]};

  componentDidUpdate = async () => {
      await this.getBalances();
      await this.getvID();
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

  getvID = async() => {
    const vID = await this.state.token.getvID(this.state.account)
    await this.setState({
      id: vID
    })
  }

  getPositive = async() => {
    const stat = await this.state.token.positiveVotes(this.state.id)
    await this.setState({
      positive: stat
    })
  }

  getNegative = async() => {
    const stat = await this.state.token.negativeVotes(this.state.id)
    await this.setState({
      negative: stat
    })
  }

  getNeutral = async() => {
    const stat = await this.state.token.neutralVotes(this.state.id)
    await this.setState({
      neutral: stat
    })
  }

  getTotal = async() => {
    const stat = await this.state.token.totalVotes(this.state.id)
    await this.setState({
      total: stat
    })
  }

  getEvents = async() => {
    const stat = await this.state.token.totalEvents(this.state.id)
    await this.setState({
      events: stat
    })
  }

  getTrust = async() => {
    const stat = await this.state.token.trustLevel(this.state.id)
    await this.setState({
      events: stat
    })
  }

  getIdentity = async() => {
    const stat = await this.state.token.getIdentity(this.state.id)
    await this.setState({
      identity: stat
    })
  }

  initialiseOwnership = async() => {
    await this.state.token.adminControl(this.state.dapp.address,
      { from: this.state.account,
        gas: 6720000 })
    await this.state.dapp.initialiseAsset(this.state.token.address,
      { from: this.state.account,
         gas: 6720000 })
  }

  render() {
    return (
      <div className="App">

        <div className="delegationLog">
        <Table color="green" key="green" inverted compact celled>
        <div className="logHeader">
         <Table.Header className="logHeader">
           <Table.Row>
             <Table.HeaderCell textAlign="center" colSpan='4'>
             <FontAwesomeIcon color="white" icon={faUsers} size='lg'/>
             &nbsp;&nbsp;Voting Log
             </Table.HeaderCell>
           </Table.Row>
           <Table.Row>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <FontAwesomeIcon color="white" icon={faWallet} size='lg'/>
             &nbsp;&nbsp;Address
             </Table.HeaderCell>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <FontAwesomeIcon color="white" icon={faUserTag} size='lg'/>
             &nbsp;&nbsp;vID
             </Table.HeaderCell>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <FontAwesomeIcon color="white" icon={faStar} size='lg'/>
             &nbsp;&nbsp;Type
             </Table.HeaderCell>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <FontAwesomeIcon color="white" icon={faLink} size='lg'/>
             &nbsp;&nbsp;Weight
             </Table.HeaderCell>
           </Table.Row>
           </Table.Header>
           </div>

        <div className="logBody">
         <Table.Body>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][0]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][0]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][0]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][0]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][1]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][1]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][1]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][1]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][2]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][2]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][2]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][2]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][3]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][3]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][3]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][3]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][4]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][4]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][4]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][4]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][5]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][5]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][5]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][5]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][6]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][6]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][6]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][6]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][7]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][7]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][7]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][7]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][8]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][8]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][8]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][8]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][9]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][9]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][9]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[3][9]}</Table.Cell>
           </Table.Row>
         </Table.Body>
         </div>

         </Table>
         </div>
      </div>
    );
  }
}

export default App;
