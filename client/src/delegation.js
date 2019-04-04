import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { Drag, raise } from '@vx/drag';

import "./css/bubble.css";

const negativeVote = "0x4e65676174697665000000000000000000000000000000000000000000000000"
const neutralVote = "0x4e65757472616c00000000000000000000000000000000000000000000000000"
const positiveVote = "0x506f736974697665000000000000000000000000000000000000000000000000"

const neg = ['#ff0c9e']
const neut = ['#ff6f0c']
const pos = ['#0cff6d']
const stake = ['#0cffe9']

var largeBubble =  10000;
var mediumBubble =  2500;
var smallBubble =  500;
var tinyBubble =  250;
var minuteBubble = 100;

function genCircles({ width, height, positive, neutral, negative, staking }) {
  var num = positive.sum + 1 + neutral.sum + 1 + negative.sum + 1 + staking.sum;
  var positiveCounter = 0;
  var negativeCounter = 0;
  var neutralCounter = 0;
  var stakingCounter = 0;
   return Array(num)
    .fill(1)
    .map((d, i) => {
      var largeBubbles; var mediumBubbles; var smallBubbles; var tinyBubbles; var minuteBubbles;
      var radius = Math.floor(Math.random() * 10) + 5
      var xcord; var ycord; var option;
      var counter = 0;

      if(i < staking.sum){
        largeBubbles = staking.data[0];
        mediumBubbles = staking.data[1];
        smallBubbles = staking.data[2];
        tinyBubbles = staking.data[3];
        minuteBubbles = staking.data[4];
        stakingCounter++;
        counter = stakingCounter;
        option = staking.sum;
      } else if(i >= staking.sum && i < staking.sum+neutral.sum+1){
        largeBubbles = neutral.data[0];
        mediumBubbles = neutral.data[1];
        smallBubbles = neutral.data[2];
        tinyBubbles = neutral.data[3];
        minuteBubbles = neutral.data[4];
        neutralCounter++;
        counter = neutralCounter;
        option = positive.sum+1;
      } else if(i >= staking.sum+neutral.sum+1
        && i < staking.sum+neutral.sum+negative.sum+2){
        largeBubbles = negative.data[0];
        mediumBubbles = negative.data[1];
        smallBubbles = negative.data[2];
        tinyBubbles = negative.data[3];
        minuteBubbles = negative.data[4];
        negativeCounter++;
        counter = negativeCounter;
        option = negative.sum+1;
      } else if( i >= staking.sum+neutral.sum+negative.sum+2){
        largeBubbles = positive.data[0];
        mediumBubbles = positive.data[1];
        smallBubbles = positive.data[2];
        tinyBubbles = positive.data[3];
        minuteBubbles = positive.data[4];
        positiveCounter++;
        counter = positiveCounter;
        option = positive.sum+1;
      }

      if(counter < largeBubbles){
        radius = 15;
      } else if(counter >= largeBubbles
        && counter < largeBubbles+mediumBubbles){
        radius = 12.5;
      } else if(counter >= largeBubbles+mediumBubbles
        && counter < largeBubbles+mediumBubbles+smallBubbles){
        radius = 10;
      } else if(counter >= largeBubbles+mediumBubbles+smallBubbles
        && counter >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles) {
        radius = 7.5;
      } else if(counter >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles
        && counter >= largeBubbles+mediumBubbles+smallBubbles+tinyBubbles+minuteBubbles) {
        radius = 5;
      }

      var operativeY = radius/2 * counter;
      var operativeX = radius/2 * counter;

      if(i < staking.sum){
        xcord = 550;
        ycord = 250;
      } else if(i >= staking.sum && i < staking.sum+neutral.sum+1){
        xcord = 900;
        ycord = 500 ;
      } else if(i >= staking.sum+neutral.sum+1
        && i < staking.sum+neutral.sum+negative.sum+2){
        xcord = 200;
        ycord = 500;
      } else if( i >= staking.sum+neutral.sum+negative.sum+2){
        xcord = 200;
        ycord = 100
      }

     return {
        id: i,
        owner: d,
        radius,
        x: xcord + operativeX * Math.cos(2 * Math.PI * counter / radius),
        y: ycord + operativeY * Math.sin(2 * Math.PI * counter / radius)
      };
    });
}

function computeBubbles(_amount) {
    var minuteAmount = 0;
    var mediumAmount = 0;
    var smallAmount = 0;
    var tinyAmount = 0;
    var largeAmount = 0;
    var remainder;

    if(_amount >= largeBubble){
      remainder = _amount % largeBubble;
      largeAmount = Math.floor(_amount/largeBubble);
      _amount = _amount - remainder;
    }
    if(_amount != 0){
      remainder = _amount % mediumBubble;
      mediumAmount = Math.floor(_amount/mediumBubble);
      _amount = _amount - remainder;
    }
    if(_amount != 0){
        remainder = _amount % smallBubble;
        smallAmount = Math.floor(_amount/smallBubble);
        _amount = _amount - remainder;
    }
    if(_amount != 0){
          remainder = _amount % tinyBubble;
          tinyAmount = Math.floor(_amount/tinyBubble);
          _amount = _amount - remainder;
   } if (_amount != 0) {
            remainder = _amount % minuteBubble;
            minuteAmount = Math.floor(_amount/minuteBubble);
            _amount = _amount - remainder;
    }


    var data = [ largeAmount, mediumAmount, smallAmount, tinyAmount, smallAmount ]
    var sum = largeAmount+mediumAmount+smallAmount+tinyAmount+smallAmount
    var output = { sum: sum, data: data }
    return output;
  }


class Delegation extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       bubbleStack: computeBubbles(parseInt(props.staking)).sum,
       items: this.genItems( props.width, props.height,
        computeBubbles(parseInt(props.positive)),
          computeBubbles(parseInt(props.neutral)),
            computeBubbles(parseInt(props.negative)),
              computeBubbles(parseInt(props.staking))),
              bubbleState: 0,

            };
       this.colorScale = scaleOrdinal({
        range: this.colorSortation(
          computeBubbles(parseInt(props.staking)).sum,
            computeBubbles(parseInt(props.neutral)).sum+1,
              computeBubbles(parseInt(props.negative)).sum+1,
                computeBubbles(parseInt(props.positive)).sum+1),
        domain: this.state.items.map(d => d.id)
        });
      }

  genItems = (width, height, positive, neutral, negative, staking) =>
    genCircles({
      width: width,
      height: height,
      positive: positive,
      neutral: neutral,
      negative: negative,
      staking: staking
  });

  colorSortation = (_positive, _neutral, _negative, _staking) => {
  return(Array(_positive).fill(stake).concat(Array(_neutral).fill
    (neut).concat(Array(_negative).fill(neg).concat(Array(_staking)
    .fill(pos)))));
  }

  render() {
    const { width, height } = this.props;
    return (
      <div className="Drag" style={{ touchAction: 'none' }}>
        <svg width={width} height={height}>
          <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
          <rect
            fill="transparent"
            width={width}
            height={height}
            rx={14}
          />
          {
            this.state.items.map((d, i) => (
            <Drag
              key={`${d.id}`}
              width={window.screen.width}
              height={window.screen.height}
              onDragEnd={async() => {
                await this.setState({
                  log: true
                })
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
                  if(isDragging && d.id > 2){
                    console.log("ID", d.id);
                    console.log("X", dx);
                    console.log("Y", dy);
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
                    onMouseMove={dragMove}
                    onMouseUp={dragEnd}
                    onMouseDown={dragStart}
                    onTouchStart={dragStart}
                    onTouchMove={dragMove}
                    onTouchEnd={dragEnd}
                  />
                );
              }}
            </Drag>
          ))}
        </svg>
      </div>
    );
  }
}

export default Delegation;
