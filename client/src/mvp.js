// Core
import React, { Component, Fragment } from 'react';
import getWeb3 from "./utils/getWeb3"
import firebase from 'firebase'

// Solc
import Validation from "./contracts/communalValidation.json";
import ERC20d from "./contracts/ERC20d.json";

// UX
import { GlobalNav, LayoutManager, NavigationProvider, MenuSection, SkeletonContainerView, light, dark, settings, ContainerHeader, HeaderSection, Item, ThemeProvider } from '@atlaskit/navigation-next';
import { faStreetView, faEdit, faInfo, faShareAlt, faBullseye, faCoins, faIdCard, faCrosshairs, faBalanceScale, faStore, faTag, faWallet, faCog, faVoteYea, faWeightHanging, faUser, faUsers, faUserTag, faStar, faShieldAlt, faLink, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons'
import { InlineDialog, Flag, AutoDismissFlag, FlagGroup } from '@atlaskit/flag'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Page, { Grid, GridColumn } from '@atlaskit/page'
import Avatar, { AvatarItem } from '@atlaskit/avatar'
import InfoIcon from '@atlaskit/icon/glyph/info'
import { Reset, Theme } from '@atlaskit/theme'
import TextField from '@atlaskit/field-text'
import Paper from '@material-ui/core/Paper'
import Select from '@atlaskit/select'
import Button from '@atlaskit/button'

// External Components
import Delegation from './delegation'

// Utils
import Convertor from 'hex2dec'

// CSS
import "react-toggle/style.css"
import "./css/mvp.css"

// Preset Icons
const crosshairsIcon = () => <FontAwesomeIcon color="#815aff" icon={faCrosshairs} className="eventsIcon" size='1x'/>
const positiveIcon = () => <FontAwesomeIcon color="#815aff" icon={faCheck} className="positiveIcon" size='lg'/>
const bullseyeIcon = () => <FontAwesomeIcon color="#815aff" icon={faBullseye} className="starIcon" size='1x'/>
const negativeIcon = () => <FontAwesomeIcon color="#815aff" icon={faTimes} className="neutralIcon" size='lg'/>
const trustIcon = () => <FontAwesomeIcon color="#815aff" icon={faShieldAlt} className="starIcon" size='1x'/>
const identityIcon = () => <FontAwesomeIcon color="#815aff" icon={faIdCard} className="starIcon" size='1x'/>
const ethIcon = () => <FontAwesomeIcon color="#815aff" icon={faEthereum} className="starIcon" size='1x'/>
const tokenIcon = () => <FontAwesomeIcon color="#815aff" icon={faTag} className="starIcon" size='1x'/>
const starIcon = () => <FontAwesomeIcon color="#815aff" icon={faStar} className="starIcon" size='1x'/>
const neutralIcon = () => <FontAwesomeIcon color="#815aff" icon={faBalanceScale} size='1x'/>
const walletIcon = () => <FontAwesomeIcon color="#815aff" icon={faWallet} size='lg'/>
const userIcon = () => <FontAwesomeIcon color="#815aff" icon={faUser} size='lg'/>
const cogIcon = () => <FontAwesomeIcon color="#815aff" icon={faCog} size='lg'/>

// Standards
const negativeVote = "0x4e65676174697665000000000000000000000000000000000000000000000000"
const neutralVote = "0x4e65757472616c00000000000000000000000000000000000000000000000000"
const positiveVote = "0x506f736974697665000000000000000000000000000000000000000000000000"
const decimal = Math.pow(10,18)

// Components
const themeModes = { light, dark, settings };
const GlobalNavigation = () => (
  <GlobalNav primaryItems={[
    { key: 'market', icon: userIcon, label: 'Stats' },
    { key: 'wager', icon: walletIcon, label: 'Wallet' },
    { key: 'settings', icon: cogIcon, label: 'settings' },
  ]} secondaryItems={[]} />
);

firebase.initializeApp({
    apiKey: "AIzaSyBX9yoKTTg4a33ETJ0hydmWcmEPMBWYBhU",
    authDomain: "validity-mvp.firebaseapp.com",
    databaseURL: "https://validity-mvp.firebaseio.com",
    projectId: "validity-mvp",
    storageBucket: "validity-mvp.appspot.com",
    messagingSenderId: "388843201152",
    appId: "1:388843201152:web:192e3cfcec60b81b"
  });
const db = firebase.firestore()

class App extends Component {

  state = {
    bubbleComponent: <div/>,
    log: [[],[],[],[]],
    themeMode: 'dark',
    pastEvents: [],
    pastData: {},
    toggle: true,
    account: null,
    token: null ,
    dapp: null,
    web3: null,
    flags: [],
    pool: 0,
  };

  initialiseData = async () => {
      await this.vxDimensions()
      await this.getEvent()
      await this.getRound()
      await this.getvID()
      await this.getTotal()
      await this.getNeutral()
      await this.getNegative()
      await this.getPositive()
      await this.getEvents()
      await this.getIdentity()
      await this.getTrust()
      await this.isStaking()
      await this.isVoted()
      await this.getLog()
      await this.eventTicker(this.state.eventSubject, this.state.round)
      await this.eventType(this.state.eventSubject, this.state.round)
      await this.eventPositive(this.state.eventSubject, this.state.round)
      await this.eventNegative(this.state.eventSubject, this.state.round)
      await this.eventNeutral(this.state.eventSubject, this.state.round)
      await this.getBalances()
      await this.gatherMetrics()
      await this.getEventImage(this.state.eventSubject)
      await this.getPastEvents()
      await this.renderBubbles()
  }

  refreshData = async () => {
      await this.getLog()
      await this.getEvent()
      await this.getRound()
      await this.getvID()
      await this.getTotal()
      await this.getNeutral()
      await this.getNegative()
      await this.getPositive()
      await this.getEvents()
      await this.getIdentity()
      await this.eventType(this.state.eventSubject, this.state.round)
      await this.eventTicker(this.state.eventSubject, this.state.round)
      await this.eventPositive(this.state.eventSubject, this.state.round)
      await this.eventNegative(this.state.eventSubject, this.state.round)
      await this.eventNeutral(this.state.eventSubject, this.state.round)
      await this.getBalances()
      await this.isStaking()
      await this.isVoted()
      await this.gatherMetrics()
      await this.getEventImage(this.state.eventSubject)
      await this.getPastEvents()
      await this.renderBubbles()
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
              <br></br>
              Register Identity
              <TextField onChange={this.logIdentity} placeholder="Identity"/>
              <div className="transactionalOperatives">
                <Button appearance="primary" className="addressButton" onClick={this.registerIdentity}>
                  Register
                  </Button>
                  <Button appearance="help" className="stakeButton" onClick={this.eventStake}>
                  Stake
                  </Button>
                </div>
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
            <Item before={tokenIcon} text={this.state.tokenBal} subText="VLDY" />
            <Item before={ethIcon} text={this.state.gasBal} subText="EGEM" />
            <br></br>
            Transfer Validity
            <TextField onChange={this.logAddress} placeholder="Address"/>
            <TextField onChange={this.logAmount} placeholder="Amount"/>
              <Button appearance="primary" className="transferButton" onClick={this.transferValidty}>
                Transfer
              </Button>
            </div>
          )}
        </MenuSection>
      </Fragment>
    );
  };

  renderAdmin= () => {
    if(this.state.account == "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"){
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
              <TextField onChange={this.logHTTP} placeholder="Image"/>
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
  } else {
    return (
      <Fragment>
      <ContainerHeader
      text="&nbsp;&nbsp;Event database">
      </ContainerHeader>
        <MenuSection>
          {({ className }) => (
            <div className={className}>
            {this.state.pastEvents.map(data => (
              <div><br></br>
              <Paper style={{ padding: '1vw', backgroundColor: fade('#ffffff', 0.125) }}>
              <div className="databaseLogo"><Avatar src={this.state.pastData[data].image} /></div>
              <div className="databaseName"><FontAwesomeIcon color="#815aff" icon={faInfo} size='1x'/>&nbsp;&nbsp;&nbsp;{data} ({this.state.pastData[data].ticker})</div>
              <div className="databaseType"><FontAwesomeIcon color="#815aff" icon={faCoins} size='1x'/>&nbsp;&nbsp;&nbsp;{this.state.pastData[data].type} </div>
              <div className="databasePositive"><FontAwesomeIcon color="#815aff" icon={faCheck} size='1x'/>&nbsp;&nbsp;&nbsp;{this.state.pastData[data].positive} </div>
              <div className="databaseNegative"><FontAwesomeIcon color="#815aff" icon={faTimes} size='1x'/>&nbsp;&nbsp;&nbsp;{this.state.pastData[data].negative} </div>
              <div className="databaseNeutral"><FontAwesomeIcon color="#815aff" icon={faBalanceScale} size='1x'/>&nbsp;&nbsp;&nbsp;{this.state.pastData[data].neutral} </div>
              <div className="databaseRating"><FontAwesomeIcon color="#815aff" icon={faStar} size='1x'/>&nbsp;&nbsp;&nbsp;{this.state.pastData[data].rating}</div>
              </Paper></div>
            ))}
            </div>
          )}
        </MenuSection>
      </Fragment>
     )
    }
  };

  renderBubbles = async() => {
    await this.setState({ bubbleComponent: <div/> })
    await this.setState({ bubbleComponent:
      <Delegation
        negative={parseInt(this.state.eventNegative)}
        positive={parseInt(this.state.eventPositive)}
        neutral={parseInt(this.state.eventNeutral)}
        user={this.state.userMetrics}
        identity={this.findIdentity}
        height={this.state.vxHeight}
        width={this.state.vxWidth}
        option={this.defineOption}
        pool={this.state.log}
        vote={this.voteEvent}
      />
    })
  }

  renderSkeleton = () => {
    return <SkeletonContainerView />;
  };

  vxDimensions = async() => {
    var dimensionHeight;  var dimensionWidth;
    if(window.innerHeight > 720){
      dimensionHeight = window.screen.height * 0.95;
      dimensionWidth = window.screen.width;
    } else {
      dimensionHeight = window.screen.height * 0.85;
      dimensionWidth = window.screen.width;
    } await this.setState({
      vxHeight: dimensionHeight,
      vxWidth: dimensionWidth
    })
  }

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
  logHTTP = (event) => { this.setState({ httpSource: event.target.value }) }

  getBalances = async() => {
    const value = await this.state.token.methods.balanceOf(this.state.account).call();
    await this.setState({ tokenBal: parseFloat(value/decimal).toFixed(2) })
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

  gatherMetrics = async() => {
    var delegationWeight = parseInt(this.state.tokenBal/10000);
    if(this.state.stake === "False" || this.state.voted === "True") {
      delegationWeight = 0;
    } var rawMetrics = { id: this.state.id, identity: this.state.identity, weight: delegationWeight }
    this.setState({ voteBal: delegationWeight, userMetrics: rawMetrics });
  }

  getvID = async() => {
    const vID = await this.state.token.methods.getvID(this.state.account).call()
    await this.setState({
      id: vID
    })
  }

 timeTravel = async() => {
    for(var x = 0 ; x < 100 ; x++){
      this.state.web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: 0,
      })
    }
 }

  handleDismiss = () => {
    this.setState(prevState => ({
      flags: prevState.flags.slice(1),
    }));
  };

  addFlag = () => {
    const newFlagId = this.state.flags.length + 1;
    const flags = this.state.flags.slice();
    flags.splice(0, 0, newFlagId);
    this.setState({ flags });
  }

  defineOption = async(_option, _stack, _limit) => {
    var optionString; var titleText;
    if(_option === positiveVote){
      titleText = "Positive vote detected"
      optionString = "success";
    } else if(_option === neutralVote){
      titleText = "Neutral vote detected"
      optionString = "warning";
    } else if(_option === negativeVote){
      titleText = "Negative vote detected"
      optionString = "error";
    } await this.setState({
      optionString: optionString,
      option: titleText,
      bubbleState: _stack,
      bubbleStack: _limit }, this.handleDismiss());
      await this.addFlag();
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

  findIdentity = async(_id) => {
    const stat = await this.state.token.methods.getIdentity(_id).call()
    var parse = await this.state.web3.utils.toAscii(stat);
    var blank = await this.state.web3.utils.fromAscii("");
    if(stat === blank) parse = "Validator"
    return parse
  }

  getAddress = async(_id) => {
    return await this.state.token.methods.getAddress(_id).call()
  }

  getEvent = async() => {
    const stat = await this.state.dapp.methods.currentEvent.call()
    console.log(this.state.web3.utils.toAscii(stat))
    await this.setState({
      eventDecode: this.state.web3.utils.toAscii(stat),
      eventSubject: stat
    })
  }

  getRound = async() => {
    const stat = await this.state.dapp.methods.currentRound.call()
    await this.setState({
      round: parseInt(stat)
    })
  }

  eventPositive = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventPositive(_subject, _round).call()
    await this.setState({
      eventPositive: Convertor.hexToDec(stat._hex)
    });
  }

  pastPositive = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventPositive(_subject, _round).call()
    return Convertor.hexToDec(stat._hex)
  }

  eventTicker = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventTicker(_subject, _round).call()
    await this.setState({
      eventTicker: this.state.web3.utils.toAscii(stat)
    });
  }

  pastTicker = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventTicker(_subject, _round).call()
    return this.state.web3.utils.toAscii(stat);
  }

  eventNegative = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventNegative(_subject, _round).call()
    await this.setState({
      eventNegative: Convertor.hexToDec(stat._hex)
    });
  }

  pastNegatitve = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventNegative(_subject, _round).call()
    return Convertor.hexToDec(stat._hex);
  }

  eventNeutral = async(_subject, _round) => {
    var stat = await this.state.dapp.methods.eventNeutral(_subject, _round).call()
    await this.setState({
      eventNeutral: Convertor.hexToDec(stat._hex)
    });
  }

  pastNeutral = async(_subject, _round) => {
  var stat = await this.state.dapp.methods.eventNeutral(_subject, _round).call()
    return Convertor.hexToDec(stat._hex);
  }

  eventType = async(_subject, _round) => {
    const stat = await this.state.dapp.methods.eventType(_subject, _round).call()
    await this.setState({
      eventType: this.state.web3.utils.toAscii(stat)
    });
  }

  pastType = async(_subject, _round) => {
    const stat = await this.state.dapp.methods.eventType(_subject, _round).call()
    return stat;
  }

  registerIdentity = async() => {
      await this.state.token.methods.setIdentity(this.state.nickname)
      .send({ from: this.state.account, gas: 3725000}, async(error, transactionHash) => {
        if(error) { console.log(error)
        } else if(transactionHash) {
          await this.getIdentity()
        }
      })
    }

  logEvent = async() => {
    db.collection("events").add({ eventHex: this.state.subject })
    db.collection(this.state.subject).add({
        http: this.state.httpSource
    }).then(function(docRef) {
        console.log("Documentwritten with ID: ", docRef.id);
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  getEventImage = async(_subject) => {
    await db.collection(_subject).orderBy("http", 'desc').get().then((result) => {
      var imageSource;
      result.forEach(item =>
        imageSource = item.data().http)
        this.setState({ eventImage: imageSource});
    })
  }

  getPastImage = async(_subject) => {
    return await db.collection(_subject).orderBy("http", 'desc').limit(1).get()
    .then((result) => {
      var imageSource;
      result.forEach(item => {
         imageSource = item.data().http;
       }); return imageSource;
    })
  }

  getPastEvents = async() => {
    var eventArray = {}; var pastArray = [];
       await db.collection("events").get().then(async(result) => {
        await result.forEach(async(item) => {
          var eventSubject = item.data().eventHex
          var convertedValue = await this.state.web3.utils.toAscii(eventSubject)
          if(eventSubject != undefined){
          var eventType = await this.state.web3.utils.toAscii(await this.pastType(eventSubject, 1))
          var eventTicker = await this.pastTicker(eventSubject, 1)
          var eventImage = await this.getPastImage(eventSubject)
          var eventPositive = await this.pastPositive(eventSubject, 1)
          var eventNegative = await this.pastNegatitve(eventSubject, 1)
          var eventNeutral = await this.pastNeutral(eventSubject, 1)
          var eventTotal = parseInt(eventPositive)/(parseInt(eventPositive) + parseInt(eventNegative) + parseInt(eventNeutral)) * 10
          var dataEmbed = {
              ticker: eventTicker,
              image: eventImage,
              type: eventType,
              positive: eventPositive,
              neutral: eventNeutral,
              negative : eventNegative,
              rating: eventTotal.toFixed(2)
            }
            eventArray[convertedValue] = dataEmbed
            pastArray.push(convertedValue)
          }
        })
        await this.setState({ pastEvents: pastArray, pastData: eventArray })
      })
  }

  isStaking = async() => {
    var input;
    const stat = await this.state.token.methods.isStaking(this.state.account).call()
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      stake: input
    })
  }

  isVoted = async() => {
    var input;
    const stat = await this.state.dapp.methods.isVoted(this.state.account).call()
    if(stat == true){ input = "True"
    } else if(stat == false){ input = "False"}
    await this.setState({
      voted: input
    })
  }

  createEvent = async() => {
    await this.state.dapp.methods.createEvent(this.state.subject, this.state.ticker, this.state.type, this.state.index)
    .send({from: this.state.account, gas: 3725000 }, async(error, transactionHash) => {
      if(error) { console.log(error)
      } else if(transactionHash) {
        await this.logEvent();
        await this.refreshData();
       }
    })
  }

  transferValidty = async() => {
      await this.state.token.methods.transfer(this.state.recipent, this.state.amount)
      .send({from: this.state.account, gas: 3725000 }, async(error, transactionHash) => {
        if(error) { console.log(error)
        } else if(transactionHash) {
          await this.getBalances();
         }
      })
    }

  voteEvent = async(_decision) => {
      await this.state.dapp.methods.voteSubmit(_decision)
      .send({from: this.state.account, gas: 3725000 }, async(error, transactionHash) => {
        if(error) { console.log(error)
        } else if(transactionHash) {
          await this.refreshData();
        }
      })
  }

  eventStake = async() => {
    await this.state.token.methods.toggleStake()
    .send({from: this.state.account, gas: 3725000 } , async(error, transactionHash) => {
      if(error) { console.log(error)
      } else if(transactionHash) {
        await this.refreshData();
       }
    })
  }

  getLog = async () => {
    var delegationLog = { }
    await this.state.token.events.Vote({ fromBlock: 0, toBlock: 'latest'}, (event,error) => { })
    .on('data', async(eventResult) => {
      console.log(eventResult);
      var activeEvent = JSON.stringify(eventResult.returnValues.subject).replace(/["]+/g, '');
      var blockNumber = JSON.stringify(eventResult.blockNumber).replace(/["]+/g, '');
      var transactionHash = JSON.stringify(eventResult.transactionHash).replace(/["]+/g, '');
      if(activeEvent === this.state.eventSubject){
        var choice = JSON.stringify(eventResult.returnValues.choice).replace(/["]+/g, '')
        var identifier = JSON.stringify(eventResult.returnValues.vID).replace(/["]+/g, '')
        var weight = Convertor.hexToDec(JSON.stringify(eventResult.returnValues.weight._hex).replace(/["]+/g, ''))
        var identity = await this.findIdentity(identifier)
        var address = await this.getAddress(identifier)
        delegationLog[identifier] = { address, transactionHash, blockNumber, identity, choice, weight }
        await this.setState({log: delegationLog}, this.refreshData());
        }
    }).on('changed', (event) => {
        // remove event from local database
    }).on('error', console.error);
}

  initialiseOwnership = async() => {
    await this.state.token.methods.adminControl(this.state.dapp.address)
    .send({ from: this.state.account, gas: 3725000 }, async(error, transactionHash) => {
      if(error) { console.log(error)
        } else if(transactionHash) {
          await this.state.dapp.methods.initialiseAsset(this.state.token.address)
          .send({ from: this.state.account, gas: 3725000 }, (error, transactionHash) => {
            if(error) { console.log(error)
            } else if(transactionHash) { }
          })
        }
    })
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
          })}>
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
          <div/>
        </LayoutManager>
      </ThemeProvider>
      </NavigationProvider>
      </GridColumn>
      <GridColumn>
        <div className="validatingIdentifier">
          {this.state.id}
        </div>
        <div className="eventStats">
          <Paper className="eventName" style={{ padding: '.5vw', backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faInfo} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: {this.state.eventDecode}
          </Paper>
          <Paper className="eventTicker" style={{ padding: '.5vw', backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faShareAlt} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ticker: {this.state.eventTicker}
          </Paper>
          <Paper className="eventType" style={{ backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faCoins} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type: {this.state.eventType}
          </Paper>
          <Paper className="eventPositive" style={{ backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faCheck} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Positive: {this.state.eventPositive}
          </Paper>
          <Paper className="eventNeutral" style={{ backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;<FontAwesomeIcon color="#815aff" icon={faBalanceScale} size='1x'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Neutral: {this.state.eventNeutral}
         </Paper>
         <Paper className="eventNegative" style={{ backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faTimes} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Negative: {this.state.eventNegative}
         </Paper>
        </div>
        <Paper className="eventBorder" style={{ borderRadius: '5vw', padding: '.5vw', backgroundColor: fade('#000000', 0.825) }}>
          <img className="eventImage" src={this.state.eventImage} />
        </Paper>
        <Paper className="votingMetrics" style={{ backgroundColor: fade('#000000', 0.825) }}>
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faStreetView} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Staking: {this.state.stake}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faCrosshairs} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Voted: {this.state.voted}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;<FontAwesomeIcon color="#815aff" icon={faWeightHanging} size='lg'/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Weight: {this.state.voteBal}
        </Paper>
        <div className="votingBubbles">
          {this.state.bubbleComponent}
        </div>
        <FlagGroup>
         {this.state.flags.map(flagId => {
           return (
             <AutoDismissFlag
              description={`Your current delegation stack in this option is: ${this.state.bubbleState} out of ${this.state.bubbleStack}`}
              icon={<FontAwesomeIcon color="#000000" icon={faUser} size='lg'/>}
              actions={[{ content: 'Ok', onClick: this.handleDismiss }]}
              appearance={this.state.optionString}
              title={this.state.option}
              id={flagId}
              key={flagId}
            /> )})}
           </FlagGroup>
         </GridColumn>
         </Grid>
      </div>
    );
  }
}

export default App;
