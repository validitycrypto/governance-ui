import React, { Component, Fragment } from 'react';

import { Segment, Icon, Table } from 'semantic-ui-react'
import TextField from '@atlaskit/field-text';
import Toggle from 'react-toggle'
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
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import { faEdit, faInfo, faBullseye, faIdCard, faCrosshairs, faBalanceScale, faStore, faTag, faWallet, faCog, faVoteYea, faWeightHanging, faUser, faUsers, faUserTag, faStar, faShieldAlt, faLink, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

import Validation from "./contracts/communalValidation.json";
import ERC20d from "./contracts/ERC20d.json";

import truffleContract from "truffle-contract";
import getWeb3 from "./utils/getWeb3";

import "react-toggle/style.css" // for ES6 modules
import "./App.css";

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

const gridSize = gridSizeFn();
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
      await this.getTotal();
      await this.getEvents();
      await this.getIdentity();
      await this.getTrust();
      await this.eventPositive();
      await this.eventNegative();
      await this.eventNeutral();
      await this.eventType();

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
    if(this.state.toggle)
      return (this.renderStatistics())
    else{
      return (this.renderWallet())
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

  logSubject = (event) =>  { this.setState({ subject: event }) }
  logTicker = (event) => { this.setState({ ticker: event }) }
  logIndex = (event) => { this.setState({ index: event }) }
  logType = (event) => { this.setState({ type: event }) }

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
    const stat = await this.state.token.getIdentity(this.state.account)
    await this.setState({
      identity: this.state.web3.utils.toAscii(stat)
    })
  }

  getEvent = async() => {
    const stat = await this.state.dapp.currentEvent()
    await this.setState({
      subject: this.state.web3.utils.toAscii(stat)
    })
  }

  getRound = async() => {
    const stat = await this.state.dapp.currentRound()
    await this.setState({
      round: parseFloat(stat).toFixed(2)
    })
  }

  eventPositive = async() => {
    const stat = await this.state.dapp.eventPositive(this.state.subject, this.state.round)
    await this.setState({
      round: stat
    })
  }

  eventNegative = async() => {
    const stat = await this.state.dapp.eventNegative(this.state.subject, this.state.round)
    await this.setState({
      round: stat
    })
  }

  eventNeutral = async() => {
    const stat = await this.state.dapp.eventNeutral(this.state.subject, this.state.round)
    await this.setState({
      round: stat
    })
  }

  eventType = async() => {
    const stat = await this.state.dapp.eventType(this.state.subject, this.state.round)
    await this.setState({
      subject: this.state.web3.utils.toAscii(stat)
    })
  }

  createEvent = async() => {
    await this.state.dapp.createEvent(this.state.subject)
  }

  optionOne = async() => {
    await this.setState({
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
      choice1: null,
      choice2: "0x6e65757472616c",
      choice3: null,
      option1: false,
      option2: true,
      option3: false
    })
  }

  optionThree = async() => {
    await this.setState({
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
        gas: 6720000 })
    await this.state.dapp.initialiseAsset(this.state.token.address,
      { from: this.state.account,
         gas: 6720000 })
  }

  render() {
    const { shouldRenderSkeleton, shouldShowContainer, themeMode } = this.state;
    const renderer = shouldRenderSkeleton
      ? this.renderSkeleton
      : this.renderSidebar;

    return (
      <div className="App">

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
                { key: 'market', icon: userIcon, label: 'Stats', onClick: () => this.setState({ toggle: true })},
                { key: 'wager', icon: walletIcon, label: 'Wallet', onClick: () => this.setState({ toggle: false })},
                { key: 'settings', icon: bullseyeIcon, label: 'settings'},
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

        <Segment raised inverted key="black" color="black" className="eventX">
        &nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faInfo} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: {this.state.type}
        </Segment>

        <Segment raised inverted key="black" color="black" className="eventX">
        &nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faInfo} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type: {this.state.type}
        </Segment>

        <Segment raised inverted key="black" color="black" className="eventX">
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faCheck} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Positive: {this.state.positive}
        </Segment>

        <Segment raised inverted key="black" color="black" className="eventX">
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faBalanceScale} size='1x'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Neutral: {this.state.neutral}
        </Segment>

        <Segment raised inverted key="black" color="black" className="eventX">
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faTimes} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Negative: {this.state.negative}

        </Segment>

        <Segment raised inverted key="black" color="black" className="statModal">
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faWeightHanging} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Weight: {this.state.weight}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<span className="colorMain">Δ</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Impact: {this.state.weight}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faStar} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reward: {this.state.voted}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<FontAwesomeIcon color="#0cff6f" icon={faEdit} size='lg'/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Voted: {this.state.voted}
        </Segment>

        <Segment raised inverted key="black" color="black" className="voteModal">
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

        <Button appearance="primary" className="voteButton">
        Submit Vote
        </Button>

        </Segment>

        <div className="eventBorder">
        <div className="eventPicture">
        </div>
        </div>

        <div className="delegationLog">
        <Table key="black" color="black" inverted compact celled>
        <div className="logHeader">
         <Table.Header className="logHeader">
           <Table.Row>
             <Table.HeaderCell textAlign="center" colSpan='3'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faVoteYea} size='lg'/>
             &nbsp;&nbsp;Voting Log
             </div>
             </Table.HeaderCell>
           </Table.Row>
           <Table.Row>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faUserTag} size='lg'/>
             &nbsp;&nbsp;vID
             </div>
             </Table.HeaderCell>
             <Table.HeaderCell textAlign="center" colSpan='1'>
            <div className="textColor">
            <FontAwesomeIcon color="#0cff6f" icon={faStar} size='lg'/>
             &nbsp;&nbsp;Type
             </div>
             </Table.HeaderCell>
             <Table.HeaderCell textAlign="center" colSpan='1'>
             <div className="textColor">
             <FontAwesomeIcon color="#0cff6f" icon={faWeightHanging} size='lg'/>
             &nbsp;&nbsp;Weight
             </div>
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
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][1]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][1]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][1]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][2]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][2]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][2]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][3]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][3]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][3]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][4]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][4]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][4]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][5]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][5]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][5]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][6]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][6]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][6]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][7]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][7]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][7]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][8]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][8]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][8]}</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell textAlign="center">{this.state.log[0][9]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[1][9]}</Table.Cell>
             <Table.Cell textAlign="center">{this.state.log[2][9]}</Table.Cell>
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
