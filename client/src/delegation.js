// Core
import React from 'react';

// UX
import { Spotlight, SpotlightManager, SpotlightTarget, SpotlightTransition } from '@atlaskit/onboarding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faLayerGroup, faStreetView, faEdit, faInfo, faShareAlt, faBullseye, faCoins, faIdCard, faCrosshairs, faBalanceScale, faStore, faTag, faWallet, faCog, faVoteYea, faWeightHanging, faUser, faUsers, faUserTag, faStar, faShieldAlt, faLink, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons'

// VX
import { scaleOrdinal } from '@vx/scale'
import { LinearGradient } from '@vx/gradient'
import { Drag, raise } from '@vx/drag'

import './css/bubble.css'

// Voting standards
const negativeVote = "0x4e65676174697665000000000000000000000000000000000000000000000000"
const neutralVote = "0x4e65757472616c00000000000000000000000000000000000000000000000000"
const positiveVote = "0x506f736974697665000000000000000000000000000000000000000000000000"
const neg = ['#ff0c9e']
const neut = ['#0cbbff']
const pos = ['#0cff6d']
const stake = ['#8633ff']
const largeBubble =  10000;
const mediumBubble =  5000;
const smallBubble =  1000;
const tinyBubble =  500;
const minuteBubble = 10;

function computeBubbles(_amount) {
    var minuteAmount = 0; var mediumAmount = 0; var smallAmount = 0;
    var tinyAmount = 0; var largeAmount = 0; var remainder;


    if(_amount >= largeBubble){
      largeAmount = Math.floor(_amount / largeBubble);
      remainder = _amount / largeBubble % 1;
      _amount = (remainder*largeBubble);
    } if(_amount >= mediumBubble){
      mediumAmount = Math.floor(_amount / mediumBubble);
      remainder = _amount / mediumBubble % 1;
      _amount = (remainder*mediumBubble);
    } if(_amount >= smallBubble){
      smallAmount = Math.floor(_amount / smallBubble);
      remainder = _amount / smallBubble % 1;
      _amount = (remainder*smallBubble);
    } if(_amount >= tinyBubble){
      tinyAmount = Math.floor(_amount / tinyBubble);
      remainder = _amount / tinyBubble % 1;
      _amount = (remainder*tinyBubble);
    } if (_amount >= minuteBubble) {
      minuteAmount = Math.floor(_amount / minuteBubble);
      remainder = _amount / minuteBubble % 1;
      _amount = (remainder*minuteBubble);
    }

    var data = [ largeAmount, mediumAmount, smallAmount, tinyAmount, minuteAmount ]
    var sum = largeAmount+mediumAmount+smallAmount+tinyAmount+minuteAmount
    var output = { sum: sum, data: data }
    return output;
  }


class Delegation extends React.Component {
  constructor(props) {
    super(props);
    var bubbleData = this.transcribeData(props.pool, props.user)
     this.state = {
       bubbleStack: computeBubbles(props.user.weight).sum,
       items: bubbleData.items,
       bubbleState: 0,
       active: false
     }; this.colorScale = scaleOrdinal({
        domain: this.state.items.map(d => d.id),
        range: bubbleData.indexes
     })
  }

  transcribeData = (_poolData, _userData) => {
    var outputArray = []; var transcribeArray = []; var colorArray = []; var bubbleId = 0;
    transcribeArray.push(this.testGeneration(_userData.id, _userData.identity, "0x0", _userData.weight, bubbleId, _userData))
    colorArray = Array(transcribeArray[0].length).fill(stake);
    bubbleId = transcribeArray[0].length;
    if(this.props.positive == 0) {
     transcribeArray.push(this.dummyBubble(positiveVote, bubbleId))
     colorArray.push(pos);
     bubbleId++;
   } if(this.props.neutral == 0){
     transcribeArray.push(this.dummyBubble(neutralVote, bubbleId))
     colorArray.push(neut);
     bubbleId++;
   } if(this.props.negative == 0){
     transcribeArray.push(this.dummyBubble(negativeVote, bubbleId))
     colorArray.push(neg);
     bubbleId++;
   } Object.entries(_poolData).forEach((data, index) => {
      if(data[1].choice != undefined){
        transcribeArray.push(this.testGeneration(data[0], data[1].identity, data[1].choice, data[1].weight, bubbleId, data[1]))
        if(data[1].choice == positiveVote) this.fillArray(colorArray, pos, computeBubbles(data[1].weight).sum)
        else if(data[1].choice == negativeVote) this.fillArray(colorArray, neg, computeBubbles(data[1].weight).sum)
        else if(data[1].choice == neutralVote) this.fillArray(colorArray, neut, computeBubbles(data[1].weight).sum)
        bubbleId = bubbleId + transcribeArray[transcribeArray.length-1].length;
   }}); transcribeArray.forEach((x,y) =>
     outputArray = outputArray.concat(transcribeArray[y]))
     return { items: outputArray, indexes: colorArray };
  }

  fillArray = (_array, _value, _amount) => {
    for(var x = 0; x < _amount; x++){
      _array.push(_value);
    } return _array;
  }

  dummyBubble = (_choice, _id, _identity) => {
    return this.testGeneration("0x0", "NA", _choice, 0, _id, { blockNumber: 0, transactionHash: 0 });
  }

 testGeneration = (_id, _identity, _option, _stack, _bubbleId, _metaData) => {
   var totalBubbles = computeBubbles(_stack)
   if(totalBubbles.sum == 0) totalBubbles.sum = 1;
     return Array(totalBubbles.sum)
      .fill(1)
      .map((d, i) => {
        var largeBubbles; var mediumBubbles; var smallBubbles; var tinyBubbles; var minuteBubbles;
        var xcord; var ycord; var option; var bubbleWeight = 0; var bubbleOption;
        var radius = Math.floor(Math.random() * 10) + 5
        largeBubbles = totalBubbles.data[0];
        mediumBubbles = totalBubbles.data[1];
        smallBubbles = totalBubbles.data[2];
        tinyBubbles = totalBubbles.data[3];
        minuteBubbles = totalBubbles.data[4];

        if(i < largeBubbles){
          bubbleWeight = largeBubble;
          radius = 20
        } else if(i >= largeBubbles
          && i < largeBubbles+mediumBubbles){
          bubbleWeight = mediumBubble;
          radius = 15
        } else if(i >= largeBubbles+mediumBubbles
          && i < largeBubbles+mediumBubbles+smallBubbles){
          bubbleWeight = smallBubble;
          radius = 10;
        } else if(i >= largeBubbles+mediumBubbles+smallBubbles
          && i < largeBubbles+mediumBubbles+smallBubbles+tinyBubbles) {
          bubbleWeight = tinyBubble;
          radius = 7.5;
        } else if(i >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles) {
          bubbleWeight = minuteBubble;
          radius = 5;
        }

        var operativeY = (6) * radius;
        var operativeX = (6) * radius;

        if(radius <= 5){
          operativeX = (i/2) * radius
          operativeY = (i/2) * radius
          if(i % 2 == 0){
            operativeY = operativeY * (-1);
          } else {
            operativeX = operativeX * (-1);
          }
        }

        if(_option === neutralVote){
          if(this.props.neutral == 0) bubbleWeight = 0
          bubbleOption = this.props.neutral
          operativeY = operativeY * (-1)
          xcord = 900
          ycord = window.screen.height*0.75;
        } else if(_option === negativeVote){
          if(this.props.negative == 0) bubbleWeight = 0
          bubbleOption = this.props.negative
          operativeY = operativeY * (-1)
          xcord = 200
          ycord = window.screen.height*0.75;
        } else if(_option === positiveVote){
          if(this.props.positive == 0) bubbleWeight = 0
          bubbleOption = this.props.positive
          xcord = 200;
          ycord = 100
        } else if(_option === "0x0"){
          bubbleOption = _stack
          xcord = window.screen.width*0.45;
          ycord = window.screen.height*0.5;
        }

       return {
          radius,
          owner: _id,
          total: _stack,
          option: _option,
          id: i + _bubbleId,
          identity: _identity,
          weight: bubbleWeight,
          account: _metaData.address,
          block: _metaData.blockNumber,
          tx: _metaData.transactionHash,
          percent: (bubbleWeight/_stack * 100).toFixed(2),
          totalPercent: (bubbleWeight/bubbleOption * 100).toFixed(2),
          x: xcord + operativeX * Math.cos(4 * Math.PI * i / radius),
          y: ycord + operativeY * Math.sin(4 * Math.PI * i / radius)
        };
      });
  }

  render() {

    const { height, width } = this.props

    return (
      <SpotlightManager>
      <div className="Drag" style={{ touchAction: 'none' }}>
        {this.state.active && (
          <Spotlight
            actions={[{ onClick: () => this.setState({ active: false }), text: 'Dismiss'}]}
            dialogPlacement="bottom left"
            target={this.state.target}
            key={this.state.target}
            heading={`Bubble ${this.state.target}`}
            targetRadius={25}
            dialogWidth={600}>
              <img className="bubbleIdenticon" src={this.state.accountImage}/>
              <p className="bubbleAccount">&nbsp;&nbsp;<FontAwesomeIcon color="#ffffff" icon={faUser} className="starIcon" size='1x'/>&nbsp;&nbsp;Account: <b>{this.state.account}</b> </p>
              <p className="bubblePercent">&nbsp;<FontAwesomeIcon color="#ffffff" icon={faLayerGroup} className="starIcon" size='1x'/>&nbsp;&nbsp;Weight Percentage: <b>{this.state.percentage} %</b> &nbsp;&nbsp;&nbsp;&nbsp;Total Percentage: <b>{this.state.totalPercent} %</b> </p>
              <p className="bubbleChoice">&nbsp;<FontAwesomeIcon color="#ffffff" icon={faStar} className="starIcon" size='1x'/>&nbsp;&nbsp;Choice: <b>{this.state.option.substring(0, this.state.option.length - 47)}</b></p>
              <p className="bubbleTotal"><FontAwesomeIcon color="#ffffff" icon={faBalanceScale} className="starIcon" size='1x'/>&nbsp;&nbsp;Total Weight: <b>{this.state.total}</b></p>
              <p className="bubbleWeight">&nbsp;<FontAwesomeIcon color="#ffffff" icon={faWeightHanging} className="starIcon" size='1x'/>&nbsp;&nbsp;Weight: <b>{this.state.weight}</b></p>
              <p className="bubbleIdentity">Identity: <b>{this.state.identity}</b></p>
              <p className="bubbleBlock">&nbsp;<FontAwesomeIcon color="#ffffff" icon={faCube} className="starIcon" size='1x'/>&nbsp;&nbsp;Block: <b>{this.state.block}</b></p>
              <p className="bubbleId">vID: <b>{this.state.voter}</b></p>
              <p className="bubbleHash">Transaction: <b>{this.state.tx}</b></p>
          </Spotlight>)}
          <svg width={width} height={height}>
          <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
          <rect fill="transparent" width={width} height={height} rx={14}/>
          {this.state.items.map((d, i) => (
            <Drag
              key={`${d.id}`}
              width={width}
              height={height}
              onDragEnd={async() => {
                await this.setState({
                  log: false
                }); if(this.state.bubbleStack == this.state.bubbleState
                   && this.state.bubbleStack != 0){
                  await this.props.vote(this.state.votingOption)
                }
              }}
              onDragStart={async() => {
                await this.setState({
                  log: true
                }); this.setState((state, props) => {
                  return {
                    items: raise(state.items, i)
                  };
                });
              }}
            >
              {({
                dragStart,
                dragEnd,
                dragMove,
                isDragging,
                dx,
                dy,
              }) => {
                  if(isDragging){
                    if(dx < -75 && dy < -57.5){
                      if(this.state.log == true){
                        this.props.option(positiveVote, this.state.bubbleState+1, this.state.bubbleStack)
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: positiveVote,
                          log: false,
                        })
                      }
                    } else if(dx > 250 && dy > 125){
                      if(this.state.log == true){
                        this.props.option(neutralVote, this.state.bubbleState+1, this.state.bubbleStack)
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: neutralVote,
                          log: false,
                        })
                      }
                    } else if(dx < -200 && dy > 37.5){
                      if(this.state.log == true){
                        this.props.option(negativeVote, this.state.bubbleState+1, this.state.bubbleStack)
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: negativeVote,
                          log: false,
                        })
                      }
                    }
                }

                return (
                  <SpotlightTarget name={d.id}>
                  <circle
                    key={`dot-${d.id}`}
                    cx={d.x}
                    cy={d.y}
                    r={isDragging ? d.radius + 4 : d.radius}
                    transform={`translate(${dx}, ${dy})`}
                    fill={
                      isDragging
                        ? 'url(#stroke)'
                        : this.colorScale(d.id)
                    }
                    fillOpacity={0.75}
                    stroke={isDragging ? 'white' : 'black'}
                    strokeWidth={2}
                    onMouseOver={() => {
                      if(d.option != "0x0"){
                       this.setState({
                        accountImage: `https://eth.vanity.show/${d.account}`,
                        account: d.account,
                        target: d.id,
                        voter: d.owner,
                        weight: d.weight,
                        option: d.option,
                        identity: d.identity,
                        block: d.block,
                        percentage: d.percent,
                        totalPercent: d.totalPercent,
                        total: d.total,
                        tx: d.tx })
                       this.setState({
                        active: true
                      })
                    }}}
                    onMouseMove={dragMove}
                    onMouseUp={dragEnd}
                    onMouseDown={dragStart}
                    onTouchStart={dragStart}
                    onTouchMove={dragMove}
                    onTouchEnd={dragEnd}
                  />
                  </SpotlightTarget>
                );
              }}
            </Drag>
          ))}
        </svg>
      </div>
      </SpotlightManager>
    );
  }
}

export default Delegation;
