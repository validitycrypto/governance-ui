import React, { Component } from 'react'
import firebase from 'firebase'

// UX

  // Misc
import { faStarHalfAlt, faLightbulb, faDotCircle, faHome, faPercentage, faFileSignature, faGlobe, faFemale, faMale, faUsers, faShareAlt, faUserTag, faSearch, faStar, faCrosshairs, faSitemap, faShieldAlt, faDove, faLink, faStreetView, faCheck, faTimes, faLayerGroup, faParachuteBox, faEnvelope, faWallet } from '@fortawesome/free-solid-svg-icons'
import { faBitcoin, faGithub, faLinkedin, faTelegramPlane, faDiscord, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { Icon , Segment , Card, Image } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';

  // Atlaskit
import { InlineDialog, Flag, AutoDismissFlag, FlagGroup } from '@atlaskit/flag'
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { AtlaskitThemeProvider } from '@atlaskit/theme'
import { AkCodeBlock } from '@atlaskit/code';
import FieldText from '@atlaskit/field-text';
import Modal from '@atlaskit/modal-dialog'
import Lorem from 'react-lorem-component';
import { colors } from '@atlaskit/theme';
import Lozenge from '@atlaskit/lozenge'
import Button from '@atlaskit/button'
import Select from '@atlaskit/select'

  // MatieralUI
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import ListItem from '@material-ui/core/ListItem';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import MailIcon from '@material-ui/icons/Mail';
import PieChart from 'react-minimal-pie-chart';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

// Images
import messages1 from './images/messages1.png'
import telegram from './images/telegram.png'
import facebook from './images/facebook.png'
import air from './images/VLDY-AIRDROP2.png'
import cdreams from './images/cdreams.png'
import twitter from './images/twitter.png'
import discord from './images/discord.png'
import lines1 from './images/lines1.png'
import github from './images/github.png'
import reddit from './images/reddit.png'
import lines2 from './images/lines2.png'
import halmat from './images/halmat.png'
import base1 from './images/base1.png'
import world from './images/world.png'
import base3 from './images/base3.png'
import gozzy from './images/gozzy.png'
import lukas from './images/lukas.png'
import clabs from './images/clabs.png'
import cnews from './images/cnews.png'
import vldy from './images/vldy.png'
import egem from './images/egem.png'
import bct from './images/bct.png'
import bcc from './images/bcc.png'

// CSS
import 'styled-components'
import './css/raleigh.css'
import './css/home.css'

// Constants
const airdrop = <FontAwesomeIcon icon={faLayerGroup} size='lg'/>
const defn = ` const Communal Validation = Peer production is based on equipotential participation,
  i.e. the a priori self-selection of participants, and the communal vetting of the
  quality of their work in the process of production itself;`

  const styles = createMuiTheme({
     sideBar: {
      background: '#815aff'
    }
  });

const dataMock = [
    { title: 'Airdrop 1', value: 30, color: '#0cff6f' },
    { title: 'Airdrop 2', value: 20, color: '#0c23ff' },
    { title: 'Airdrop 3', value: 10, color: '#ff0c23' },
    { title: 'Team', value: 15, color: '#00bfff' },
    { title: 'Community fund', value: 20, color: '#ffa500' },
    { title: 'Validation supply', value: 5, color: '#ff0c9c' },
  ];

class Home extends Component {
  constructor(props) {
    super(props)
      this.state = {
        sideBar: false,
        segment: 0,
        flags: [],
      }
  }

  componentWillMount = () => {
    this.open()
  }

  animateChart = () => {
     this.setState({ segment: 100 })
  }

  scroll = (event) => {
    var element = document.getElementsByClassName(event)[0];
    element.scrollIntoView({behavior: "smooth"});
    if(event === "page6"){
      this.animateChart()
    }
  }

  formEmail = (event) => this.setState({ email: event.target.value });
  formTelegram = (event) => this.setState({ telegram: event.target.value });
  formDiscord = (event) => this.setState({ discord: event.target.value });
  formFacebook = (event) => this.setState({ facebook: event.target.value });
  formTwitter = (event) => this.setState({ twitter: event.target.value });
  formWallet = (event) => this.setState({ wallet: event.target.value });
  scrollToBottom = () => this.bottomRef.scrollIntoView(true);
  accept = () => this.setState({ isSubmitted: false });
  submit = () => this.setState({ isApply: false });
  reveal = () => this.setState({ isApply: true });
  close = () => this.setState({ isOpen: false });
  open = () => this.setState({ isOpen: true });

  formData = () => {
    if(this.state.email != undefined
       && this.state.telegram != undefined
       && this.state.discord != undefined
       && this.state.twitter != undefined
       && this.state.facebook != undefined
       && this.state.wallet.length == 42){
          var data = {
            telegram: this.state.telegram,
            discord: this.state.discord,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            wallet: this.state.wallet
          };
      }
}

  handleDismiss = () => {
    this.setState(prevState => ({
      flags: prevState.flags.slice(1),
    }));
  };

  toggleSidebar = (_bool) => {
    this.setState({ })
  }

  addFlag = () => {
    const newFlagId = this.state.flags.length + 1;
    const flags = this.state.flags.slice();
    flags.splice(0, 0, newFlagId);
    this.setState({ flags });
  }

  render() {
    const { isSubmitted } = this.state;
    const { isApply } = this.state;
    const { classes } = this.props;
    const { active } = this.state;
    const { isOpen } = this.state;
    return (
      <AtlaskitThemeProvider mode='light'>
        <div className="homepageMenu">
          <div className="menuBar">
            <AppBar fullWidth style={{ backgroundColor: '#815aff', display: 'flex', zIndex: 1 }} position="static">
              <Toolbar>
                <a href='https://egem.io'>
                  <img className='egem' src={egem}/>
                </a>
                <div className="pageSelect">
                  <Select
                    options={[
                      { label: 'What is Validity?', value: '1' },
                      { label: 'Communal Validation', value: '1' },
                      { label: 'How does it work?', value: '1' },
                      { label: 'Tokenonomics', value: '1' },
                      { label: 'Analytics', value: '1' },
                      { label: 'The Team', value: '1' },
                      { label: 'Resources', value: '1' },
                      { label: 'Get involved', value: '1' },
                    ]}
                    placeholder="Navigation"/>
                </div>
                <div className="appbarSpacing"/>
                <a href='https://discord.gg/s5rSvB2'>
                  <img className='discord' src={discord}/>
                </a>
                <a href='https://t.me/ValidityCrypto'>
                  <img className='telegram' src={telegram}/>
                </a>
                <a href='https://www.github.com/ValidityCrypto'>
                  <img className='github' src={github}/>
                </a>
                <a href='https://twitter.com/ValidityCrypto'>
                  <img className='twitter' src={twitter}/>
                </a>
                <a href='https://www.reddit.com/r/ValidityCrypto'>
                  <img className='reddit' src={reddit}/>
                </a>
                <a href='https://www.facebook.com/ValidityCrypto'>
                  <img className='facebook' src={facebook}/>
                </a>
                <a href='https://bitcointalk.org/index.php?topic=4900179'>
                  <img className='bct' src={bct}/>
                </a>
                <div className="landingButton">
                  <Button onClick={() => this.setState({ sideBar: !this.state.sideBar })} appearance="help">Menu</Button>
                </div>
              </Toolbar>
            </AppBar>
          </div>
          <div className="sideBar">
            <Drawer
              variant="persistent"
              style={{ zIndex: -1}}
              classes={{ paper: classes.sideBar }}
              onClose={() => this.setState({ sideBar: false })}
              onOpen={() => this.setState({ sideBar: true })}
              open={this.state.sideBar}
              anchor="right">
                <Paper className="paperMenu" style={{ backgroundColor: fade('#ffffff', 0.275) }}>
                  <Button transperant className="paperButton">
                    <FontAwesomeIcon className="paperIcon" color="#ffffff" icon={faHome} size='lg'/>
                    <span style={{ color: 'white'}}>
                      Home
                    </span>
                  </Button>
                  <Button transperant className="paperButton">
                    <FontAwesomeIcon className="paperIcon" color="#ffffff" icon={faStarHalfAlt} size='lg'/>
                    <span style={{ color: 'white'}}>
                      MVP
                    </span>
                  </Button>
                  <Button transperant className="paperButton">
                    <FontAwesomeIcon className="paperIcon" color="#ffffff" icon={faParachuteBox} size='lg'/>
                    <span style={{ color: 'white'}}>
                      Airdrop
                    </span>
                  </Button>
                  <Button transperant className="paperButton">
                    <FontAwesomeIcon className="paperIcon" color="#ffffff" icon={faFileSignature} size='lg'/>
                    <span style={{ color: 'white'}}>
                      Survey
                    </span>
                  </Button>
                  <Button transperant className="paperButton">
                    <FontAwesomeIcon className="paperIcon" color="#ffffff" icon={faWallet} size='lg'/>
                    <span style={{ color: 'white'}}>
                      Wallet
                    </span>
                  </Button>
                </Paper>
            </Drawer>
          </div>
        </div>
        <div className="landingPage">
          <Page>
            <Grid layout="fluid">
              <GridColumn>
                <div className="landingBranding">
                  <img className='landingLogo' src={vldy}/>
                  <p className="landingTitle">Validity</p>
                </div>
              </GridColumn>
            </Grid>
          </Page>
        </div>
        <FlagGroup>
         {this.state.flags.map(flagId => {
           return (
            <AutoDismissFlag
             actions={[
               { content: 'Ignore', onClick: this.handleDismiss },
               { content: 'Apply', onClick: () => {
                 this.handleDismiss()
                  this.reveal() }}]}
            appearance='warning'
            id={flagId}
            key={flagId}
            icon={airdrop}
            title='Try out our MVP!'
            description='Easily engaging in the alpha form of delegation by using a interactive user interface, vote with a click and some easy mouse movements.'
            />)})}
        </FlagGroup>
        {isSubmitted && (
          <Modal
           actions = {[{ text: 'Dismiss', onClick: this.accept }  ]}
           onClose={this.accept}
           appearance='warning'
           heading='Submission Successful'
           width='500px'>
            You are now registered for the VLDY airdrop round two.
            <br></br>
            <p className="warn"> For any queries or validating submissions contact airdrop@validity.ae </p>
            <br></br>
            Thank you for participating and have a nice day!
          </Modal> )}
        {isOpen && (
          <Modal
          actions = {[
            { text: 'Accept', onClick: async() => {
              await this.close()
              await this.addFlag()
            } },
            { text: 'Refuse', onClick: this.close }, ]}
          onClose={this.close}
          appearance='warning'
          heading='GDPR'
          width='500px'>
          We use cookies and other tracking technologies to improve your browsing experience on our web site,
          to show you personalized content and targeted ads, to analyze our website traffic, and to understand
          where our visitors are coming from. By browsing our website, you consent to our use of cookies and
          other tracking technologies.
          </Modal> )}
        {isApply && (
          <Modal
            heading='VLDY Airdrop Application'
            appearance='warning'
            scrollBehaviour="outside"
            actions = {[
              { text: 'Submit', onClick: this.addFlag  },
              { text: 'Refuse', onClick: this.submit },
              { text: 'Scroll to bottom', onClick: this.scrollToBottom }]}>
              <div className="sect">
                  <img className="mdl" src={air} />
                  <br></br>
                  <br></br>
                  <div className="inpt">
                    <b><i>
                      <p className="warn">Closing Date: 20th of November 2018</p>
                      <p className="warn">DISCLAIMER: ALL PARAMETERS MUST BE CORRECT TO BE COMPLIANT OF THE AIRDROP DISTRIBUTION.</p>
                      <p className="warn">ANY INCORRECT INFORMATION WILL BE FOLLOWED UP AND IF NO SWIFT REPSONSE FROM THE APPLICANT THEY WILL BE EXCLUDED.</p></i></b>
                      <b>Your e-mail address</b>
                      <FieldText shouldFitContainer='true' label='E-Mail' required onChange={this.formEmail}/>
                      <FontAwesomeIcon className="ia" icon={faEnvelope} size='2x'/>
                      <b>Your Telegram account present in <a href="https://t.me/ValidityCrypto">@ValidityCrypto</a></b>
                      <FieldText shouldFitContainer='true' label='Telegram Username' required onChange={this.formTelegram}/>
                      <FontAwesomeIcon className="ia" icon={faTelegramPlane} size='2x'/>
                      <b ref={r => {this.bottomRef = r;}}>Your account present in the <a href="https://discord.gg/s5rSvB2">Validity Discord</a></b>
                      <FieldText shouldFitContainer='true' label='Discord Username' required onChange={this.formDiscord}/>
                      <FontAwesomeIcon className="ia" icon={faDiscord} size='2x'/>
                      <b>Your Twitter account that is following <a href="https://twitter.com/ValidityCrypto">@ValidityCrypto</a></b>
                      <FieldText shouldFitContainer='true' label='Twitter Username' required onChange={this.formTwitter}/>
                      <FontAwesomeIcon className="ia" icon={faTwitter} size='2x'/>
                      <b>Your facebook account that has liked <a href="https://www.facebook.com/ValidityCrypto/">Validity's facebook</a></b>
                      <FieldText shouldFitContainer='true' label='Facebook Username' required onChange={this.formFacebook}/>
                      <FontAwesomeIcon className="ia" icon={faFacebook} size='2x'/>
                      <b>Target <a href="https://www.myegemwallet.com">EtherGem wallet address</a> for the airdrop distribution</b>
                      <FieldText shouldFitContainer='true' label='EtherGem Address' required onChange={this.formWallet}/>
                      <FontAwesomeIcon className="ia" icon={faWallet} size='2x'/>
                  </div>
              </div>
         </Modal>)}
         <div className="page1">
          <Page>
            <Grid layout="fluid">
              <GridColumn>
                <div className="h1">
                  <FontAwesomeIcon icon={faLayerGroup} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;What is Validity?
                </div>
              </GridColumn>
              <GridColumn>
              <div className="page1-p1">
                <p className="pagePoint">With the beauty of decentrilisation comes many bonuses but with any advantage comes a disvantage. Blockchain and technologies alike are on the edge of adoption but cannot fully reach the pinnacle unless a system of evalution takes a stand.</p>
                <p className="pagePoint">This would provide a go-to reference point to verify the integrity of an investment decision but currently investing for the average person isn't a viable task as there is many pitfalls of amoral activity that one can easily fall pray to.</p>
                <p className="pagePoint">How can the people know what is safe to invest in and what is not?</p>
                <p className="pagePoint">The answer to this question is Validity, a self governing decentrilised regulation infrastructure.</p>
              </div>
              </GridColumn>
              <GridColumn>
              <div className="validatingGraphic">
                <img className="base1" src={base1}/>
                <div className="lines1edit"><img className="lines1" src={lines1}/></div>
                <div className="wrong"><FontAwesomeIcon icon={faTimes}/></div>
                <div className="right"><FontAwesomeIcon icon={faCheck}/></div>
                <div><img className="bcc" src={bcc}/></div>
                <div className="messages1edit"><img className="messages1" src={messages1}/> </div>

              </div>
              </GridColumn>
            </Grid>
          </Page>
        </div>
        <div className="page2">
          <Page>
            <Grid layout="fluid">
              <GridColumn>
                <div className="h2">
                  <FontAwesomeIcon icon={faStreetView} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Communal Validation
                </div>
              </GridColumn>
              <GridColumn>
                <div className="page2-p1">
                  <div className="codecommunal">
                    <AkCodeBlock language="java" text={defn}/>
                  </div>
                  <div className="traits">
                    <p className="pagePoint"><FontAwesomeIcon icon={faLink} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Immutable</p>
                    <p className="pagePoint"><FontAwesomeIcon icon={faShieldAlt} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Bias-free</p>
                    <p className="pagePoint"><FontAwesomeIcon icon={faDove} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Pure</p>
                  </div>
                </div>
              </GridColumn>
              <GridColumn>
                <img className="world" src={world}/>
              </GridColumn>
            </Grid>
          </Page>
      </div>
      <div className="page3">
        <Page>
          <Grid layout="fluid">
            <GridColumn>
              <div className="h3">
                <FontAwesomeIcon icon={faSitemap} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;How does it work?
              </div>
            </GridColumn>
            <GridColumn>
              <div className="page3-p1">
                So how does it all work, how does Validity quantify cryptocurrency investment risk?
              </div>
            </GridColumn>
         </Grid>
        </Page>
      </div>
      <div className="page4">
      <Page>
      <Grid layout="fluid">
      <GridColumn>
      <div className="h4">
        <FontAwesomeIcon icon={faUsers} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Validity tipbot
      </div>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      <GridColumn medium={1}>
        <Button onClick={this.scroll.bind(this, "page5")} appearance="help">
          Next
        </Button>
      </GridColumn>
      </Grid>

      <Grid layout="fluid">
        <GridColumn>
        <div className="tipbotInformation">
        <p> A new addition to the Validity community, that allows users on <b>Discord</b> and <b>Telegram</b> to tip others
        EGEM and VLDY seamlessly, including a leaderboard to keep an eye on the top contributors, a rain
        function to distribute a select amount to multiple users in one execution and afew other goodies.</p>
        <p> To register an account simply call <b>/generate</b> in direct message to the bot or a channel that it
        is present in. Commands can be viewed by calling <b>/commands</b> and to find more about command format
        call the <b>/help</b> command.</p>
        </div>
        </GridColumn>
        </Grid>
        <Grid layout="fluid">
        <GridColumn>
        <div className="tipbotTelegram">
        <a href='https://t.me/ValidityBot'>
          <img className="tipbotLogos" src={telegram}/>
        </a>
        </div>
        </GridColumn>
        <GridColumn>
        </GridColumn>
          <GridColumn>
          </GridColumn>
      </Grid>
      <Grid layout="fluid">
      <GridColumn>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      <GridColumn>
      <div className="tipbotDiscord">
        <a href='https://discordapp.com/users/541220071448772608'>
          <img className="tipbotLogos" src={discord}/>
        </a>
        </div>
        </GridColumn>
        <GridColumn>
        </GridColumn>
        </Grid>
      </Page>
      </div>

      <div className="page5">
      <Page>
      <Grid layout="fluid">
      <GridColumn>
      <div className="h4">
        <FontAwesomeIcon icon={faUsers} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Documentation
      </div>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      <GridColumn medium={1}>
        <Button onClick={this.scroll.bind(this, "page6")} appearance="help">
          Next
        </Button>
      </GridColumn>
      </Grid>
      <Grid layout="fluid">
      <GridColumn>
      </GridColumn>
      <GridColumn>
        <a href='https://medium.com/@samuel.jj.gosling/what-is-communal-validation-and-why-does-it-matter-8634dcba2133'>
        <img className='validityArticle' src={vldy}/>
        </a>
        <p className="titleCommunal"> <b> What is communal validation and why does it matter? </b> </p>
      </GridColumn>
      <GridColumn medium={1}>
      </GridColumn>
      <GridColumn>
      <a href='https://medium.com/coinmonks/cryptocurrency-and-blockchain-red-flags-e0ba71885136'>
      </a>
      <p className="titleRedflags"> <b> Blockchain and crypto-currency red flags </b> </p>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      </Grid>
      </Page>
      </div>

      <div className="page6">
      <Page>
      <Grid layout="fluid">
      <GridColumn>
      <div className="h4">
        <FontAwesomeIcon icon={faUsers} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Tokeneconomics
      </div>
      </GridColumn>
      <GridColumn>
      </GridColumn>
      <GridColumn medium={1}>
        <Button onClick={this.scroll.bind(this, "page7")} appearance="help">
          Next
        </Button>
      </GridColumn>
      </Grid>

      <Grid layout="fluid">
      <GridColumn>
      <div className="tokenEconomics">
      <PieChart
        data={dataMock}
        lineWidth={15}
        rounded
        radius={20}
        animate={true}
        label={true}
        animationDuration={2250}
        reveal={this.state.segment}
      />
      </div>
      </GridColumn>
      </Grid>

      <Grid layout="fluid">
      <GridColumn>
      <div className="tokenMetrics">
      <p>Decimals: <b>18</b></p>
      <p>Asset type: <b>ERC20d</b> </p>
      <p>Asset ticker: <b>VLDY</b> </p>
      <p>Network: <b>EtherGem (EGEM)</b> </p>
      <p>Initial supply: <b>48,070,000,000 VLDY</b></p>
      <p>Max supply: <b>50,600,000,000 VLDY</b> </p>
      </div>
      </GridColumn>
      <GridColumn>
      <div className="tokenWallet">
      <p>Address: <b>0xb0702df32de0371f39a98cc911a2dd69c3a13e6f</b></p>
      </div>
      </GridColumn>
      <GridColumn>
      <div className="tokenLegend">
      <p><FontAwesomeIcon icon={faDotCircle} color='#ff0c9c' size='s'/>&nbsp;&nbsp;&nbsp;Validation supply</p>
      <p><FontAwesomeIcon icon={faUsers} color='#ffa500' size='s'/>&nbsp;&nbsp;&nbsp;Community fund</p>
      <p><FontAwesomeIcon icon={faParachuteBox} color='#ff0c23' size='s'/>&nbsp;&nbsp;&nbsp;Airdrop three</p>
      <p><FontAwesomeIcon icon={faParachuteBox} color='#0c23ff' size='s'/>&nbsp;&nbsp;&nbsp;Airdrop two </p>
      <p><FontAwesomeIcon icon={faParachuteBox} color='#0cff6f' size='s'/>&nbsp;&nbsp;&nbsp;Airdrop one </p>
      <p><FontAwesomeIcon icon={faWallet} color='#00bfff' size='s'/>&nbsp;&nbsp;&nbsp;Team funds</p>
      </div>
      </GridColumn>
      </Grid>
      </Page>
      </div>

      <div className="page7">
      <Page>
      <Grid layout="fluid">
        <GridColumn>
          <div className="h4">
            <FontAwesomeIcon icon={faUsers} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;The team
          </div>
        </GridColumn>
        <GridColumn>
        </GridColumn>
        <GridColumn medium={1}>
          <Button onClick={this.scroll.bind(this, "page8")} appearance="help">
          Next
          </Button>
        </GridColumn>
        </Grid>
        <Grid layout="compact">
        <GridColumn>
        <div className="teamCards">
          <Card inverted className="gozzy">
            <Image src={gozzy}/>
            <Card.Content>
              <Card.Header><span className="blackt">Samuel JJ Gosling</span></Card.Header>
              <Card.Meta>
                <span className="blackt">Founder</span>
            </Card.Meta>
          </Card.Content>
          <Card.Content>
          <span className="blackt">Ireland 🇮🇪</span>
          </Card.Content>
          <Card.Content>
          <span className="blackt">Betterknown as <b>Gozzy</b>, Samuel is a rookie developer
          with a strong sense of integrity and the ability to ignite ideas via coding to
          make them a reality.</span>
          </Card.Content>
          <Card.Content extra>
          <a className="plink" href="https://www.linkedin.com/in/samuel-jj-gosling/">
          <FontAwesomeIcon icon={faLinkedin} color='white' />
          </a>
          <a className="ptweet" href="https://twitter.com/gozzy_g">
          <FontAwesomeIcon icon={faTwitter} color='white' />
          </a>
          <a className="ptele" href="https://discordapp.com/users/359835946491052037/">
          <FontAwesomeIcon icon={faDiscord} color='white' />
          </a>
          <a className="pdis" href="https://t.me/xgozzy">
          <FontAwesomeIcon icon={faTelegramPlane} color='white' />
          </a>
          <a className="p" href="https://hub.com/samgos">
          <FontAwesomeIcon icon={faGithub} color='white'/>
          </a>
          </Card.Content>
        </Card>
        </div>
        </GridColumn>
        <GridColumn>
        <div className="teamCards">
        <Card className="lukas">
            <Image src={lukas}/>
            <Card.Content>
              <Card.Header><span className="blackt">Lukas Fischereder</span></Card.Header>
              <Card.Meta>
              <span className="blackt">Analyst</span>
              </Card.Meta>
            </Card.Content>
            <Card.Content>
            <span className="blackt">Austria 🇦🇹</span>
            </Card.Content>
            <Card.Content>
            <span className="blackt">Lukas is an out-going individual who has a determination to learn
            and unravel the unknown. His attention to detail allows nothing to go unoticed.</span>
            </Card.Content>
            <Card.Content extra>
            <a className="plink" href="https://www.linkedin.com/in/lukas-fischereder-bb5758145/">
            <FontAwesomeIcon icon={faLinkedin} color='white' />
            </a>
            <a className="ptweet" href="https://twitter.com/LukiFischereder">
            <FontAwesomeIcon icon={faTwitter} color='white' />
            </a>
            <a className="ptele" href="https://discordapp.com/users/406776100299997185/">
            <FontAwesomeIcon icon={faDiscord} color='white' />
            </a>
            <a className="pdis" href="https://t.me/lufisch">
            <FontAwesomeIcon icon={faTelegramPlane} color='white' />
            </a>
            </Card.Content>
          </Card>
          </div>
          </GridColumn>
          <GridColumn>
          <div className="teamCards">
                  <Card className="halmat">
                      <Image src={halmat}/>
                      <Card.Content>
                        <Card.Header><span className="blackt">Halmat Sarzali</span></Card.Header>
                        <Card.Meta>
                        <span className="blackt">Strategist</span>
                        </Card.Meta>
                      </Card.Content>
                      <Card.Content>
                      <span className="blackt">Norway	🇳🇴</span>
                      </Card.Content>
                      <Card.Content>
                      <span className="blackt">Halmat is a man of words but that doesn't inhibit his reach, utilsing his gramatical
                      and negotating skills allows an unyielding range of potential opportunities to arise.
                       </span>
                      </Card.Content>
                      <Card.Content extra>
                      <a className="plink" href="https://www.linkedin.com/in/halmat-sarzali-575330b7/">
                      <FontAwesomeIcon icon={faLinkedin} color='white' />
                      </a>
                      <a className="ptweet" href="https://twitter.com/RealCrypto420">
                      <FontAwesomeIcon icon={faTwitter} color='white' />
                      </a>
                      <a className="ptele" href="https://discordapp.com/users/379338535104413734/">
                      <FontAwesomeIcon icon={faDiscord} color='white' />
                      </a>
                      <a className="pdis" href="https://t.me/Hali420">
                      <FontAwesomeIcon icon={faTelegramPlane} color='white' />
                      </a>
                      </Card.Content>
                    </Card>
                    </div>
                  </GridColumn>
                  <GridColumn>
                  <div className="teamCards">
                    <Card className="marcos">
                        <Card.Content>
                          <Card.Header>
                            <span className="blackt">
                              Marcos Benítez Rubianes
                            </span>
                          </Card.Header>
                          <Card.Meta>
                          <span className="blackt">Strategist</span>
                          </Card.Meta>
                        </Card.Content>
                        <Card.Content>
                        <span className="blackt">Switzerland🇨🇭</span>
                        </Card.Content>
                        <Card.Content>
                        <span className="blackt">Having worked with <b>PwC</b> in financial crimes and
                        now currently with <b>Gazprombank</b> bank, Marcos has the network and the wisdom.
                         </span>
                        </Card.Content>
                        <Card.Content extra>
                        <a className="plink" href="https://www.linkedin.com/in/marcos-benítez-rubianes-9b19b864/">
                        <FontAwesomeIcon icon={faLinkedin} color='white' />
                        </a>
                        <a className="ptweet" href="https://twitter.com/Foxxrex">
                        <FontAwesomeIcon icon={faTwitter} color='white' />
                        </a>
                        <a className="pdis" href="https://t.me/CryptoProphet33">
                        <FontAwesomeIcon icon={faTelegramPlane} color='white' />
                        </a>
                        </Card.Content>
                      </Card>
            </div>
            </GridColumn>
            </Grid>
            </Page>
        </div>


        <div className="page8">
        <Grid layout="fluid">
          <GridColumn>
            <div className="h3">
              <FontAwesomeIcon icon={faShieldAlt} color='#4d00bd' size='s'/>
              &nbsp;&nbsp;&nbsp;Get involved
            </div>
          </GridColumn>
          <GridColumn>
          </GridColumn>
          <GridColumn medium={1}>
            <Button onClick={this.scroll.bind(this, "page9")} appearance="help">
              Next
            </Button>
         </GridColumn>
         </Grid>

        <Grid layout="fluid">
        <GridColumn>
      <div className="joinTeam">
        <p>
        <FontAwesomeIcon icon={faFemale} color='#4d00bd' size='2x'/>
        &nbsp;&nbsp;&nbsp;
        <FontAwesomeIcon icon={faMale} color='#4d00bd' size='2x'/>
        &nbsp;&nbsp;&nbsp;
        Do you think you have what it takes to join our team? We are looking
        for innovational and committed people to help make Validity a reality.
        The onboarding process for one to become appicable requires a face to
        face interview with our founder. If you are interested please send your
        resume and a short bio to: <b>team@validity.ae</b>
        </p>
      </div>
      </GridColumn>
      </Grid>

      <Grid layout="fluid">
      <GridColumn>
      <div className="bountyTitle">
      <p>
        <FontAwesomeIcon icon={faStar} color='#4d00bd' size='2x'/>
        &nbsp;&nbsp;&nbsp; <b> Bounties </b>
      </p>
      </div>
      </GridColumn>
      <GridColumn>
      <div className="websiteBounties">
      <p>
        <FontAwesomeIcon icon={faFileSignature} color='#4d00bd' size='2x'/>
        &nbsp;&nbsp;&nbsp; <b> Validity survey </b>
      </p>
      <p>🇯🇵 Japanese&nbsp;&nbsp;&nbsp;🇪🇸 Spanish&nbsp;&nbsp;&nbsp;🇷🇺 Russian&nbsp;&nbsp;&nbsp;
      🇨🇳 Chinese&nbsp;&nbsp;&nbsp;🇮🇹 Italian&nbsp;&nbsp;&nbsp;🇫🇷 French&nbsp;&nbsp;&nbsp;🇰🇷 Korean
      &nbsp;&nbsp;&nbsp;🇳🇱 Dutch&nbsp;&nbsp;&nbsp;🇮🇳 Hindi&nbsp;&nbsp;&nbsp;🇹🇭 Siamese</p>
      </div>
    </GridColumn>
    </Grid>

        </div>


        <div className="page9">
        <Page>
        <Grid layout="fluid">
          <GridColumn>
          <div className="h4">
          <FontAwesomeIcon icon={faStar} color='#4d00bd' size='s'/>&nbsp;&nbsp;&nbsp;Featured by</div>
          </GridColumn>
          </Grid>

          <Grid layout="fluid">
          <GridColumn medium={2}>
          </GridColumn>
          <GridColumn>
          <div className="featuredPartners">
          <a href="https://chainlabs.ai/"><img className="clabs" src={clabs}/></a>
          </div>
          </GridColumn>
          <GridColumn>
          <div className="featuredPartners">
          <a href="https://telegram.me/coinnewschannel"><img className="cnews" src={cnews}/></a>
          </div>
          </GridColumn>
          <GridColumn>
          <div className="featuredPartners">
          <a href="https://coindreams.io/"><img className="cdreams" src={cdreams}/></a>
          </div>
          </GridColumn>
          </Grid>

        </Page>
        </div>
      </AtlaskitThemeProvider>
    );
  }
}

export default withStyles(styles)(Home);
