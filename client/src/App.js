import React, { Component, Fragment } from 'react';

import { Segment, Icon, Table } from 'semantic-ui-react'
import TextField from '@atlaskit/field-text';
import Toggle from 'react-toggle'
import Select from '@atlaskit/select';
import {
  GlobalNav,
  LayoutManager,
  NavigationProvider,
  MenuSection,
  SkeletonContainerView,
  light,
  dark,
  settings,
  ContainerHeader,
  HeaderSection,
  ItemAvatar,
  Item,
  ThemeProvider,
} from '@atlaskit/navigation-next';
import Button from '@atlaskit/button';
import { Reset, Theme } from '@atlaskit/theme';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { faEdit, faInfo, faBullseye, faIdCard, faCrosshairs, faBalanceScale, faStore, faTag, faWallet, faCog, faVoteYea, faWeightHanging, faUser, faUsers, faUserTag, faStar, faShieldAlt, faLink, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

import Validation from "../build/contracts/communalValidation.json";
import ERC20d from "../build/contracts/ERC20d.json";

import truffleContract from "truffle-contract";
import getWeb3 from "./utils/getWeb3";

import "react-toggle/style.css" // for ES6 modules
import "./css/mvp.css";

const decimal = Math.pow(10,18);

const userIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faUser} size='lg'/>

const cogIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faCog} size='lg'/>
const walletIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faWallet} size='lg'/>
const neutralIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faBalanceScale} size='1x'/>
const positiveIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faCheck} className="positiveIcon" size='lg'/>
const negativeIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faTimes} className="neutralIcon" size='lg'/>
const crosshairsIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faCrosshairs} className="eventsIcon" size='1x'/>
const starIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faStar} className="starIcon" size='1x'/>
const trustIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faShieldAlt} className="starIcon" size='1x'/>
const identityIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faIdCard} className="starIcon" size='1x'/>
const tokenIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faTag} className="starIcon" size='1x'/>
const ethIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faEthereum} className="starIcon" size='1x'/>
const bullseyeIcon = () => <FontAwesomeIcon color="#0cff6f" icon={faBullseye} className="starIcon" size='1x'/>

const themeModes = { light, dark, settings };

const GlobalNavigation = () => (
  <GlobalNav primaryItems={[
    { key: 'market', icon: userIcon, label: 'Stats' },
    { key: 'wager', icon: walletIcon, label: 'Wallet' },
    { key: 'settings', icon: cogIcon, label: 'settings' },
  ]} secondaryItems={[]} />
);

class App extends Component {
  state = {
    web3: null,
    account: null,
    token: null ,
    dapp: null,
    log: [[],[],[],[]],
    themeMode: 'dark',
    toggle: true
  };

  initialiseData = async () => {
      await this.getBalances();
      await this.getEvent();
      await this.getRound();
      await this.getvID();
      await this.getTotal();
      await this.getNeutral();
      await this.getNegative();
      await this.getPositive();
      await this.eventType();
      await this.getEvents();
      await this.getIdentity();
      await this.getTrust();
      await this.isStaking();
      await this.isVoted();
      await this.eventPositive();
      await this.eventNegative();
      await this.eventNeutral();
      await this.getLog();

  }

  refreshData = async () => {
      await this.getBalances();
      await this.getTotal();
      await this.getNeutral();
      await this.getNegative();
      await this.getPositive();
      await this.getEvents();
      await this.getTrust();
      await this.isStaking();
      await this.isVoted();
      await this.eventPositive();
      await this.eventNegative();
      await this.eventNeutral();
      await this.getLog();
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
           web3: web });
      await this.initialiseData()
  };


  renderSidebar = () => {
    if(this.state.toggle) {
      return (this.renderStatistics())
    } else if(this.state.wallet){
      return (this.renderWallet())
    } else if(this.state.admin){
      return (this.renderAdmin())
    }
  }

  renderStatistics= () => {
    return (
      <Fragment>
      <ContainerHeader
      text="&nbsp;&nbsp;Voting Statistics">
      </ContainerHeader>
        <MenuSection>
          {({ className }) => (
            <div className={className}>
              <Item before={identityIcon} text={this.state.identity} subText="Identity" />
              <Item before={crosshairsIcon} text={this.state.events} subText="Events" />
              <Item before={starIcon} text={this.state.total} subText="Total" />
              <Item before={trustIcon} text={this.state.trust} subText="Trust" />
              <Item before={positiveIcon} text={this.state.positive} subText="Positive" />
              <Item before={neutralIcon} text={this.state.neutral} subText="Neutral" />
              <Item before={negativeIcon} text={this.state.negative} subText="Negative" />


              <TextField onChange={this.logIdentity} placeholder="Identity"/>
              <Button appearance="primary" className="addressButton" onClick={this.registerIdentity}>
                Register
              </Button>
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  renderWallet= () => {
    return (
      <Fragment>
      <ContainerHeader
      text="&nbsp;&nbsp;Delegate Funds">
      </ContainerHeader>
        <MenuSection>
          {({ className }) => (
            <div className={className}>
            <TextField onChange={this.logAddress} placeholder="Address"/>
            <TextField onChange={this.logAmount} placeholder="Amount"/>
              <Button appearance="primary" className="addressButton" onClick={this.transferValidty}>
                Send VLDY
              </Button>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <Item before={tokenIcon} text={this.state.tokenBal} subText="VLDY" />
              <Item before={ethIcon} text={this.state.gasBal} subText="EGEM" />
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  renderAdmin= () => {
    return (
      <Fragment>
      <ContainerHeader
      text="&nbsp;&nbsp;Admin Panel">
      </ContainerHeader>
        <MenuSection>
          {({ className }) => (
            <div className={className}>
            <Select className="subjectType" onChange={this.logType}
                options={[
                  { label: 'dApp', value: "dApp"  },
                  { label: 'Coin', value: "Coin" },
                  { label: 'Token', value: "Token" },
                  { label: 'Exchange', value: "Exchange" },
                ]}
                placeholder="Type"
              />
              <TextField onChange={this.logSubject} placeholder="Name"/>
              <TextField onChange={this.logTicker} placeholder="Ticker"/>
              <TextField onChange={this.logIndex} placeholder="Round"/>
           <Button appearance="primary" className="subjectButton" onClick={this.createEvent}>
           Create
           </Button>

           <Button appearance="danger" className="ownerButton" onClick={this.timeTravel}>
           Initialise
           </Button>
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  renderSkeleton = () => {
    return <SkeletonContainerView />;
  };

  handleShowContainerChange = () => {
    this.setState({ shouldShowContainer: !this.state.shouldShowContainer });
  };

  logAmount = (event) =>  { this.setState({ amount: parseFloat(event.target.value*Math.pow(10,18)) }) }
  logIdentity = (event) =>  { this.setState({ nickname: event.target.value }) }
  logSubject = (event) =>  { this.setState({ subject: event.target.value }) }
  logAddress = (event) =>  { this.setState({ recipent: event.target.value }) }
  logTicker = (event) => { this.setState({ ticker: event.target.value }) }
  logIndex = (event) => { this.setState({ index: event.target.value }) }
  logType = (event) => { this.setState({ type: event.value }) }

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

  timeTravel = async() => {
    for(var x = 0 ; x < 100 ; x++){
    this.state.web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine',
      params: [],
      id: 0,
    })
  }
}


  getPositive = async() => {
    const stat = await this.state.token.positiveVotes(this.state.id)
    await this.setState({
      positive: parseFloat(stat).toFixed(2)
    })
  }

  getNegative = async() => {
    const stat = await this.state.token.negativeVotes(this.state.id)
    await this.setState({
      negative: parseFloat(stat).toFixed(2)
    })
  }

  getNeutral = async() => {
    const stat = await this.state.token.neutralVotes(this.state.id)
    await this.setState({
      neutral: parseFloat(stat).toFixed(2)
    })
  }

  getTotal = async() => {
    const stat = await this.state.token.totalVotes(this.state.id)
    await this.setState({
      total: parseFloat(stat).toFixed(2)
    })
  }

  getEvents = async() => {
    const stat = await this.state.token.totalEvents(this.state.id)
    await this.setState({
      events: parseFloat(stat).toFixed(2)
    })
  }

  getTrust = async() => {
    const stat = await this.state.token.trustLevel(this.state.id)
    await this.setState({
      trust: parseFloat(stat).toFixed(2)
    })
  }

  getIdentity = async() => {
    const stat = await this.state.token.getIdentity(this.state.id)
    await this.setState({
      identity: this.state.web3.utils.toAscii(stat)
    })
  }

  getEvent = async() => {
    const stat = await this.state.dapp.currentEvent()
    await this.setState({
      eventSubject: this.state.web3.utils.toAscii(stat)
    })
  }

  getRound = async() => {
    const stat = await this.state.dapp.currentRound()
    await this.setState({
      round: parseFloat(stat).toFixed(2)
    })
  }

  eventPositive = async() => {
    const stat = await this.state.dapp.eventPositive(this.state.eventSubject, this.state.round)
    await this.setState({
      eventPositive: parseFloat(stat).toFixed(2)
    })
  }

  eventNegative = async() => {
    const stat = await this.state.dapp.eventNegative(this.state.eventSubject, this.state.round)
    await this.setState({
      eventNegative: parseFloat(stat).toFixed(2)
    })
  }

  eventNeutral = async() => {
    const stat = await this.state.dapp.eventNeutral(this.state.eventSubject, this.state.round)
    await this.setState({
      eventNeutral: parseFloat(stat).toFixed(2)
    })
  }

  eventType = async() => {
    const stat = await this.state.dapp.eventType(this.state.eventSubject, this.state.round)
    await this.setState({
      eventType: this.state.web3.utils.toAscii(stat)
    })
  }


    registerIdentity = async() => {
      const stat = await this.state.token.setIdentity(this.state.nickname , {from: this.state.account, gas: 3725000})
      await await this.getIdentity();
    }

  isStaking = async() => {
    const stat = await this.state.token.isStaking(this.state.account)
    var input;
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      stake: input
    })
  }

  isVoted = async() => {
    const stat = await this.state.dapp.isVoted(this.state.account)
    var input;
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      voted: input
    })
  }

  createEvent = async() => {
    await this.state.dapp.createEvent(this.state.subject, this.state.ticker, this.state.type, this.state.index,
                                     {from: this.state.account, gas: 3725000 });
  }

  transferValidty = async() => {
      console.log(this.state.amount)
      await this.state.token.transfer(this.state.recipent, this.state.amount, {from: this.state.account, gas: 3725000 });
      await this.getBalances();
    }

  voteEvent = async() => {
    console.log(this.state.choice);
    await this.state.dapp.voteSubmit(this.state.choice, {from: this.state.account, gas: 3725000 });
    await this.refreshData();
  }

  eventStake = async() => {
    await this.state.token.initiateStake({from: this.state.account, gas: 3725000 });
  }

  getLog = async () => {
    return await this.state.token.Vote({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
    if (error) { console.log(error);
    } else {
      var array = [[],[],[],[]];
      for(var x = 0; x < eventResult.length; x++ ){
          var event = this.state.web3.utils.toAscii(JSON.stringify(eventResult[x].args.subject).replace(/["]+/g, ''));
          if(event === this.state.eventSubject){
          var choice = this.state.web3.utils.toAscii(JSON.stringify(eventResult[x].args.choice).replace(/["]+/g, ''))
          var id = JSON.stringify(eventResult[x].args.vID).replace(/["]+/g, '')
          var weight = JSON.stringify(eventResult[x].args.weight).replace(/["]+/g, '')
          array[0].push(id)
          array[1].push(choice)
          array[2].push(weight)
        }
      }
      this.setState({log: array});
    }
  })
}


  optionOne = async() => {
    await this.setState({
      choice: "Positive",
      choice1: "0x506f736974697665",
      choice2: null,
      choice3: null,
      option1: true,
      option2: false,
      option3: false
    })
  }

  optionTwo = async() => {
    await this.setState({
      choice: "Neutral",
      choice1: null,
      choice2: "0x4e65757472616c",
      choice3: null,
      option1: false,
      option2: true,
      option3: false
    })
  }

  optionThree = async() => {
    await this.setState({
      choice: "Negative",
      choice1: null,
      choice2: null,
      choice3: "0x4e65676174697665",
      option1: false,
      option2: false,
      option3: true
    })
  }

  initialiseOwnership = async() => {
    await this.state.token.adminControl(this.state.dapp.address,
      { from: this.state.account,
        gas: 3725000 })
    await this.state.dapp.initialiseAsset(this.state.token.address,
      { from: this.state.account,
         gas: 3725000 })
    await this.timeTravel();
  }

  render() {
    const { shouldRenderSkeleton, shouldShowContainer, themeMode } = this.state;
    const renderer = shouldRenderSkeleton
      ? this.renderSkeleton
      : this.renderSidebar;

    return (
      <div className="App">
      <Grid layout="fluid">
        <GridColumn>
        <NavigationProvider>
        <ThemeProvider
          theme={theme => ({
            ...theme,
            mode: themeModes[themeMode],
          })}
        >
        <LayoutManager
          globalNavigation={() =>  (
            <GlobalNav primaryItems={[
              { key: 'market', icon: userIcon, label: 'Stats', onClick: () => this.setState({ toggle: true , wallet: false, admin: false }) },
              { key: 'wager', icon: walletIcon, label: 'Wallet', onClick: () => this.setState({ toggle: false , wallet: true, admin: false }) },
              { key: 'settings', icon: bullseyeIcon, label: 'settings' , onClick: () => this.setState({ toggle: false , wallet: false, admin: true }) },
            ]} secondaryItems ={[  ]} />
          )}
          productNavigation={renderer}
        >
        <div className="validatingIdentifier">
        {this.state.id}
        </div>
        </LayoutManager>
      </ThemeProvider>
      </NavigationProvider>
      </GridColumn>
      <GridColumn>

        <div className="eventStats">
        <div className="eventName"><FontAwesomeIcon color="#0cff6f" icon={faInfo} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: {this.state.eventSubject}</div>

        <div className="eventType"><FontAwesomeIcon color="#0cff6f" icon={faInfo} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type: {this.state.eventType}</div>

        <div className="eventPositive"><FontAwesomeIcon color="#0cff6f" icon={faCheck} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Positive: {this.state.eventPositive}</div>

        <div className="eventNeutral">&nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faBalanceScale} size='1x'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Neutral: {this.state.eventNeutral}</div>

        <div className="eventNegative"><FontAwesomeIcon color="#0cff6f" icon={faTimes} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Negative: {this.state.eventNegative}</div>
        </div>

        <div className="eventBorder">
        </div>

        <div className="statModal">

        </div>

        <div className="voteModal">
        <label className="positiveToggle">
          <Toggle
            defaultChecked={this.state.option1}
            checked={this.state.option1}
            icons={{
              checked: <FontAwesomeIcon color="#0cff6f" icon={faCheck}/>,
              unchecked: null,
            }}
            onChange={this.optionOne} />
          <span className="positiveHeader">Positive: <span className="positiveValue">&nbsp;&nbsp;&nbsp;{this.state.choice1}</span></span>
        </label>
        <label className="neutralToggle">
          <Toggle
            checked={this.state.option2}
            icons={{
              checked: <FontAwesomeIcon color="#0cff6f" icon={faBalanceScale}/>,
              unchecked: null,
            }}
            onChange={this.optionTwo} />
            <span className="neutralHeader">Neutral: <span className="neutralValue">&nbsp;&nbsp;&nbsp;{this.state.choice2}</span></span>
        </label>
        <label className="negativeToggle">
          <Toggle
            checked={this.state.option3}
            icons={{
              checked: <FontAwesomeIcon color="#0cff6f" icon={faTimes}/>,
              unchecked: null,
            }}
            onChange={this.optionThree} />
            <span className="negativeHeader">Negative:  <span className="negativeValue">&nbsp;&nbsp;&nbsp;{this.state.choice3}</span></span>
        </label>

        <Button appearance="warning" className="stakeButton" onClick={this.eventStake}>
        Commit Stake
        </Button>

        <Button appearance="primary" className="voteButton" onClick={this.voteEvent}>
        Submit Vote
        </Button>

        <div className="votingStatus"><FontAwesomeIcon color="#0cff6f" icon={faEdit} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Voted: {this.state.voted}</div>
        <div className="stakingStatus"><FontAwesomeIcon color="#0cff6f" icon={faWallet} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Staking: {this.state.stake}</div>

        </div>

        <div className="delegationLog">
        <table>
        <div className="logHeader">
        <thead>
         <tr>
             <th textAlign="center" colSpan='3'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faVoteYea} size='lg'/>
             &nbsp;&nbsp;Voting Log
             </div>
             </th>
             <th textAlign="center" colSpan='1'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faUserTag} size='lg'/>
             &nbsp;&nbsp;vID
             </div>
             </th>
             <th textAlign="center" colSpan='1'>
            <div className="textColor">
            <FontAwesomeIcon color="#0cff6f" icon={faStar} size='lg'/>
             &nbsp;&nbsp;Type
             </div>
             </th>
             <th textAlign="center" colSpan='1'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faWeightHanging} size='lg'/>
             &nbsp;&nbsp;Weight
             </div>
             </th>
           </tr>
           </thead>
           </div>

        <div className="logBody">
         <tbody>
           <tr>
             <td className="logid" textAlign="center">{this.state.log[0][0]}</td>
             <td textAlign="center">{this.state.log[1][0]}</td>
             <td textAlign="center">{this.state.log[2][0]}</td>
           </tr>
           <tr>
             <td className="logid" textAlign="center">{this.state.log[0][1]}</td>
             <td textAlign="center">{this.state.log[1][1]}</td>
             <td textAlign="center">{this.state.log[2][1]}</td>
           </tr>
           <tr>
             <td className="logid" textAlign="center">{this.state.log[0][2]}</td>
             <td textAlign="center">{this.state.log[1][2]}</td>
             <td textAlign="center">{this.state.log[2][2]}</td>
           </tr>
           <tr>
             <td className="logid" textAlign="center">{this.state.log[0][3]}</td>
             <td textAlign="center">{this.state.log[1][3]}</td>
             <td textAlign="center">{this.state.log[2][3]}</td>
           </tr>
           <tr>
             <td className="logid" textAlign="center">{this.state.log[0][4]}</td>
             <td textAlign="center">{this.state.log[1][4]}</td>
             <td textAlign="center">{this.state.log[2][4]}</td>
           </tr>
           <tr>
             <td textAlign="center">{this.state.log[0][5]}</td>
             <td textAlign="center">{this.state.log[1][5]}</td>
             <td textAlign="center">{this.state.log[2][5]}</td>
           </tr>
           <tr>
             <td textAlign="center">{this.state.log[0][6]}</td>
             <td textAlign="center">{this.state.log[1][6]}</td>
             <td textAlign="center">{this.state.log[2][6]}</td>
           </tr>
           <tr>
             <td textAlign="center">{this.state.log[0][7]}</td>
             <td textAlign="center">{this.state.log[1][7]}</td>
             <td textAlign="center">{this.state.log[2][7]}</td>
           </tr>
           <tr>
             <td textAlign="center">{this.state.log[0][8]}</td>
             <td textAlign="center">{this.state.log[1][8]}</td>
             <td textAlign="center">{this.state.log[2][8]}</td>
           </tr>
           <tr>
             <td textAlign="center">{this.state.log[0][9]}</td>
             <td textAlign="center">{this.state.log[1][9]}</td>
             <td textAlign="center">{this.state.log[2][9]}</td>
           </tr>
         </tbody>
         </div>
         </table>
         </div>
         </GridColumn>
         </Grid>
      </div>
    );
  }
}

export default App;
