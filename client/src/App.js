import React, { Component, Fragment } from 'react';

import Delegation from './delegation'

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
    toggle: true,
    pool: 0,
    choice: "0x506f736974697665000000000000000000000000000000000000000000000000",
    bubbleComponent: <div/>
  };

  initialiseData = async () => {
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
      await this.getBalances();

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
      const accounts = await web.eth.getAccounts();
      const networkId = await web.eth.net.getId();
      const tokenContract = ERC20d.networks[networkId];
      const validationContract = Validation.networks[networkId];
      const instance1 = new web.eth.Contract(
              ERC20d.abi,
              tokenContract && tokenContract.address,
            );
      const instance2 = new web.eth.Contract(
             Validation.abi,
             validationContract && validationContract.address,
             );
      instance1.setProvider(web.currentProvider)
      instance2.setProvider(web.currentProvider)
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
              <Button appearance="warning" className="stakeButton" onClick={this.eventStake}>
                Stake
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

           <Button appearance="danger" className="ownerButton" onClick={this.initialiseOwnership}>
           Initialise
           </Button>
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  getCommune = async() => {
       var totalBubbles = parseFloat(this.state.eventNegative) + parseFloat(this.state.eventPositive)
       + parseFloat(this.state.eventNeutral) + parseFloat(this.state.voteBal)
       console.log(totalBubbles);
       await this.setState({
         pool: totalBubbles
       })
     }

  renderBubbles = async() => {
    await this.getCommune();
    await this.setState({ bubbleComponent:
      <Delegation
        width={1100}
        height={700}
        total={this.state.pool}
        vote={this.voteEvent}
        negative={parseInt(this.state.eventNegative)}
        positive={parseInt(this.state.eventPositive)}
        neutral={parseInt(this.state.eventNeutral)}
        staking={this.state.voteBal}
        />
    })
  }

  renderSkeleton = () => {
    return <SkeletonContainerView />;
  };

  handleShowContainerChange = () => {
    this.setState({ shouldShowContainer: !this.state.shouldShowContainer });
  };

  logAmount = (event) =>  { this.setState({ amount: this.state.web3.utils.toHex(this.state.web3.utils.toBN(event.target.value).mul(this.state.web3.utils.toBN(1e18))) }); }
  logIdentity = (event) =>  { this.setState({ nickname: this.state.web3.utils.fromAscii(event.target.value) }) }
  logSubject = (event) =>  { this.setState({ subject: this.state.web3.utils.fromAscii(event.target.value) }) }
  logTicker = (event) => { this.setState({ ticker: this.state.web3.utils.fromAscii(event.target.value) }) }
  logType = (event) => { this.setState({ type: this.state.web3.utils.fromAscii(event.value) }) }
  logAddress = (event) =>  { this.setState({ recipent: event.target.value }) }
  logIndex = (event) => { this.setState({ index: event.target.value }) }

  getBalances = async() => {
    const value = await this.state.token.methods.balanceOf(this.state.account).call();
    await this.setState({ tokenBal: parseFloat(value/decimal).toFixed(2), voteBal: parseInt(value/decimal)/10000 })
    await this.state.web3.eth.getBalance(this.state.account,
      async(error, value) => {
        if(error){
          console.log("Error:", error)
        } else if(value) {
          value = parseFloat(value/decimal).toFixed(2)
          this.setState({ gasBal: value })
        }
      })
  }

  getvID = async() => {
    const vID = await this.state.token.methods.getvID(this.state.account).call()
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
    const stat = await this.state.token.methods.positiveVotes(this.state.id).call()
    await this.setState({
      positive: parseFloat(stat).toFixed(2)
    })
  }

  getNegative = async() => {
    const stat = await this.state.token.methods.negativeVotes(this.state.id).call()
    await this.setState({
      negative: parseFloat(stat).toFixed(2)
    })
  }

  getNeutral = async() => {
    const stat = await this.state.token.methods.neutralVotes(this.state.id).call()
    await this.setState({
      neutral: parseFloat(stat).toFixed(2)
    })
  }

  getTotal = async() => {
    const stat = await this.state.token.methods.totalVotes(this.state.id).call()
    await this.setState({
      total: parseFloat(stat).toFixed(2)
    })
  }

  getEvents = async() => {
    const stat = await this.state.token.methods.totalEvents(this.state.id).call()
    await this.setState({
      events: parseFloat(stat).toFixed(2)
    })
  }

  getTrust = async() => {
    const stat = await this.state.token.methods.trustLevel(this.state.id).call()
    await this.setState({
      trust: parseFloat(stat).toFixed(2)
    })
  }

  getIdentity = async() => {
    const stat = await this.state.token.methods.getIdentity(this.state.id).call()
    await this.setState({
      identity: this.state.web3.utils.toAscii(stat)
    })
  }

  getEvent = async() => {
    const stat = await this.state.dapp.methods.currentEvent.call()
    await this.setState({
      eventSubject: stat,
      eventDecode: this.state.web3.utils.toAscii(stat)
    })
  }

  getRound = async() => {
    const stat = await this.state.dapp.methods.currentRound.call()
    await this.setState({
      round: parseInt(stat)
    })
  }

  eventPositive = async() => {
    const stat = await this.state.dapp.methods.eventPositive(this.state.eventSubject, this.state.round).call()
    await this.setState({
      eventPositive: parseFloat(stat).toFixed(2)
    })
  }

  eventNegative = async() => {
    const stat = await this.state.dapp.methods.eventNegative(this.state.eventSubject, this.state.round).call()
    await this.setState({
      eventNegative: parseFloat(stat).toFixed(2)
    })
  }

  eventNeutral = async() => {
    const stat = await this.state.dapp.methods.eventNeutral(this.state.eventSubject, this.state.round).call()
    await this.setState({
      eventNeutral: parseFloat(stat).toFixed(2)
    })
  }

  eventType = async() => {
    const stat = await this.state.dapp.methods.eventType(this.state.eventSubject, this.state.round).call()
    await this.setState({
      eventType: this.state.web3.utils.toAscii(stat)
    })
  }



  registerIdentity = async() => {
      var converge = this.state.web3.utils.fromAscii(this.state.nickname)
      await this.state.token.methods.setIdentity(converge)
      .send({ from: this.state.account, gas: 3725000})
      await await this.getIdentity();
    }

  isStaking = async() => {
    const stat = await this.state.token.methods.isStaking(this.state.account).call()
    var input;
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      stake: input
    })
  }

  isVoted = async() => {
    const stat = await this.state.dapp.methods.isVoted(this.state.account).call()
    var input;
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      voted: input
    })
  }

  createEvent = async() => {
    await this.state.dapp.methods.createEvent(this.state.subject, this.state.ticker, this.state.type, this.state.index)
    .send({from: this.state.account, gas: 3725000 })
  }

  transferValidty = async() => {
      await this.state.token.methods.transfer(this.state.recipent, this.state.amount)
      .send({from: this.state.account, gas: 3725000 });
      await this.getBalances();
    }

  voteEvent = async(_decision) => {
    console.log(_decision)
      await this.state.dapp.methods.voteSubmit(_decision)
      .send({from: this.state.account, gas: 3725000 });
  }

  eventStake = async() => {
    await this.state.token.methods.toggleStake()
    .send({from: this.state.account, gas: 3725000 });
  }

  getLog = async () => {
    return await this.state.token.events.Vote({ fromBlock: 0, toBlock: 'latest' },
    (error, eventResult) => {
    if (error) { console.log(error);
    } else {
      var array = [[],[],[],[]];
      for(var x = 0; x < eventResult.length; x++ ){
          var event = JSON.stringify(eventResult[x].args.subject).replace(/["]+/g, '');
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
    await this.state.token.methods.adminControl(this.state.dapp.address)
    .send({ from: this.state.account, gas: 3725000 })
    await this.state.dapp.methods.initialiseAsset(this.state.token.address)
    .send({ from: this.state.account, gas: 3725000 })
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
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: {this.state.eventDecode}</div>

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
        {this.state.pool}

        <div className="votingBubbles">
        <Button onClick={this.eventStake} appearance="warning"> Stake </Button>
        <Button onClick={this.renderBubbles.bind(this)} appearance="help"> Create </Button>

        {this.state.bubbleComponent}
        </div>

         </GridColumn>
         </Grid>
      </div>
    );
  }
}

export default App;
