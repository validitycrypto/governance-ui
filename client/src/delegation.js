import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { Drag, raise } from '@vx/drag';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';

import "./css/bubble.css";

const negativeVote = "0x4e65676174697665000000000000000000000000000000000000000000000000"
const neutralVote = "0x4e65757472616c00000000000000000000000000000000000000000000000000"
const positiveVote = "0x506f736974697665000000000000000000000000000000000000000000000000"

const neg = ['#ff0c9e']
const neut = ['#ff6f0c']
const pos = ['#0cff6d']
const stake = ['#0cffe9']

var largeBubble =  10000;
var mediumBubble =  5000;
var smallBubble =  1000;
var tinyBubble =  500;
var minuteBubble = 100;

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
      _amount = (remainder*tinyBubble) - (tinyAmount*_amount);
    } if (_amount >= minuteBubble) {
      minuteAmount = Math.floor(_amount / minuteBubble);
      remainder = _amount / minuteBubble % 1;
      _amount = (remainder*minuteBubble);
    }

    var data = [ largeAmount, mediumAmount, smallAmount, tinyAmount, smallAmount ]
    var sum = largeAmount+mediumAmount+smallAmount+tinyAmount+smallAmount
    var output = { sum: sum, data: data }
    return output;
  }


class Delegation extends React.Component {
  constructor(props) {
    super(props);
    var bubbleData = this.transcribeData(props.pool, props.user)
    console.log(bubbleData)
     this.state = {
       bubbleStack: computeBubbles(props.user.weight).sum,
       items: bubbleData.items,
       bubbleState: 0,
       active: false
     };
     this.colorScale = scaleOrdinal({
        domain: this.state.items.map(d => d.id),
        range: bubbleData.indexes
     })
  }

  transcribeData = (_poolData, _userData) => {
    var outputArray = []; var transcribeArray = []; var colorArray = []; var bubbleId = 0;
    transcribeArray.push(this.testGeneration(_userData.id, "0x0", _userData.weight, bubbleId))
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
        bubbleId = bubbleId + transcribeArray[index].length;
        transcribeArray.push(this.testGeneration(data[0], data[1].choice, data[1].weight, bubbleId))
        if(data[1].choice == positiveVote) this.fillArray(colorArray, pos, computeBubbles(data[1].weight).sum)
        else if(data[1].choice == negativeVote) this.fillArray(colorArray, neg, computeBubbles(data[1].weight).sum)
        else if(data[1].choice == neutralVote) this.fillArray(colorArray, neut, computeBubbles(data[1].weight).sum)
        bubbleId++;
   }}); transcribeArray.forEach((x,y) =>
     outputArray = outputArray.concat(transcribeArray[y]))
     return { items: outputArray, indexes: colorArray };
  }

  fillArray = (_array, _value, _amount) => {
    for(var x = 0; x < _amount; x++){
      _array.push(_value);
    } return _array;
  }

  dummyBubble = (_choice, _id) => {
    var returnArray = this.testGeneration("0x0", _choice, 0, _id);
    return returnArray
  }


 testGeneration = (_id, _option, _stack, _bubbleId) => {
   var totalBubbles = computeBubbles(_stack)
   if(totalBubbles.sum == 0) totalBubbles.sum = 1;
     return Array(totalBubbles.sum)
      .fill(1)
      .map((d, i) => {
        var largeBubbles; var mediumBubbles; var smallBubbles; var tinyBubbles; var minuteBubbles;
        var radius = Math.floor(Math.random() * 10) + 5
        var xcord; var ycord; var option;
        largeBubbles = totalBubbles.data[0];
        mediumBubbles = totalBubbles.data[1];
        smallBubbles = totalBubbles.data[2];
        tinyBubbles = totalBubbles.data[3];
        minuteBubbles = totalBubbles.data[4];

        if(_option === neutralVote){
          xcord = 900;
          ycord = 500;
        } else if(_option === negativeVote){
          xcord = 200;
          ycord = 500;
        } else if(_option === positiveVote){
          xcord = 200;
          ycord = 100
        } else if(_option === "0x0"){
          xcord = 550;
          ycord = 350;
        }

        if(i < largeBubbles){
          radius = 20;
        } else if(i >= largeBubbles
          && i < largeBubbles+mediumBubbles){
          radius = 15;
        } else if(i >= largeBubbles+mediumBubbles
          && i < largeBubbles+mediumBubbles+smallBubbles){
          radius = 10;
        } else if(i >= largeBubbles+mediumBubbles+smallBubbles
          && i >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles) {
          radius = 5;
        } else if(i >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles
          && i >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles+minuteBubbles) {
          radius = 1;
        }

        var operativeY = (radius*2) * i;
        var operativeX = (radius*2) * i;

       return {
          id: i + _bubbleId,
          owner: _id,
          weight: _stack,
          option: _option,
          radius,
          x: xcord + operativeX * Math.cos(2 * Math.PI * i / radius),
          y: ycord + operativeY * Math.sin(2 * Math.PI * i / radius)
        };
      });
  }

  render() {
    return (
      <SpotlightManager>
      <div className="Drag" style={{ touchAction: 'none' }}>
        {this.state.active && (
          <Spotlight
            actions={[
              {
                onClick: () => this.setState({ active: false }),
                text: 'Dismiss',
              },
            ]}
            dialogPlacement="bottom left"
            key={this.state.target}
            target={this.state.target}
            targetRadius={25}
            dialogWidth={600}
          >
          <p>vID: <b>{this.state.voter}</b></p>
          <br></br>
          <p>Choice: <b>{this.state.option.substring(0, this.state.option.length - 35)}</b></p>
          <br></br>
          <p>Weight: <b>{this.state.weight}</b></p>
          </Spotlight>
        )}
        <svg width={window.screen.width} height={window.screen.height*0.75}>
          <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
          <rect
            fill="transparent"
            width={window.screen.width}
            height={window.screen.height*0.75}
            rx={14}
          />
          {
            this.state.items.map((d, i) => (
            <Drag
              key={`${d.id}`}
              width={window.screen.width}
              height={window.screen.height*0.75}
              onDragEnd={async() => {
                await this.setState({
                  log: true
                })
                console.log("vID", d.owner);
                console.log("Bubble ID", d.id);
                console.log("Total Bubbles:", this.state.bubbleStack)
                console.log("State Bubbles:", this.state.bubbleState)
                if(this.state.bubbleStack == this.state.bubbleState){
                  await this.props.vote(this.state.votingOption)
                }
              }}
              onDragStart={() => {
                // svg follows the painter model
                // so we need to move the data item
                // to end of the array for it to be drawn
                // "on top of" the other data items

                this.setState((state, props) => {
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
                    if(dx < -50 && dy < -37.5){
                      console.log("POSITIVE");
                      if(this.state.log == true){
                        this.props.option(positiveVote, this.state.bubbleState+1, this.state.bubbleStack)
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: positiveVote,
                          log: false,
                        })
                      }
                    } else if(dx > 275 && dy > 150){
                      console.log("NEUTRAL");
                      if(this.state.log == true){
                        this.props.option(neutralVote, this.state.bubbleState+1, this.state.bubbleStack)
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: neutralVote,
                          log: false,
                        })
                      }
                    } else if(dx < -200 && dy > 37.5){
                      console.log("NEGATIVE");
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
                    onMouseEnter={async () => {
                      if(d.option != "0x0"){
                      await this.setState({
                        target: d.id,
                        voter: d.owner,
                        weight: d.weight,
                        option: d.option })
                      await this.setState({ active: true })
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
