import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { Drag, raise } from '@vx/drag';

const negativeVote = "0x4e65676174697665000000000000000000000000000000000000000000000000"
const neutralVote = "0x4e65757472616c00000000000000000000000000000000000000000000000000"
const positiveVote = "0x506f736974697665000000000000000000000000000000000000000000000000"

const neg = ['#ff0c9e']
const neut = ['#ff6f0c']
const pos = ['#0cff6d']
const stake = ['#0cffe9']

var largeBubble =  10000;
var mediumBubble =  1250;
var smallBubble =  500;
var tinyBubble =  100;
var minuteBubble = 7;

function genCircles({ num, width, height, positive, neutral, negative, staking }) {
  num.sum = positive + neutral + negative + staking;
   return Array(num.sum)
    .fill(1)
    .map((d, i) => {
      var xcord;
      var ycord;
      var largeBubbles = num.data[0]-1;
      var mediumBubbles = num.data[1]-1;
      var smallBubbles = num.data[2]-1;
      var tinyBubbles = num.data[3]-1;
      var minuteBubbles = num.data[4]-1;
      var radius = 25 - Math.random() * 20;
      if(i < positive){
        xcord = 950;
        ycord = 100;
      } else if(i >= positive && i < positive+neutral){
        xcord = 950;
        ycord = 550;
      } else if(i >= positive+neutral
        && i < positive+neutral+negative){
        xcord = 100;
        ycord = 550;
      } else if( i >= positive+neutral+negative){
        xcord = 500;
        ycord = 300;
      }

      if(i < largeBubbles){
        radius = 25;
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
        radius = 2;
      }
     return {
        id: i,
        owner: d,
        radius,
        x: Math.round(xcord + (Math.floor(Math.random() * (radius * 5)))),
        y: Math.round(ycord + (Math.floor(Math.random() * (radius * 5)))),
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
    if(remainder != 0){
      _amount = _amount - remainder;
      remainder = _amount % mediumBubble;
      mediumAmount = Math.floor(_amount/mediumBubble);
      if(remainder != 0){
        _amount = _amount - remainder;
        remainder = _amount % smallBubble;
        smallAmount = Math.floor(_amount/smallBubble);
        if(remainder != 0){
          _amount = _amount - remainder;
          remainder = _amount % tinyBubble;
          tinyAmount = Math.floor(_amount/tinyBubble);
         if (remainder != 0) {
            _amount = _amount - remainder;
            remainder = _amount % minuteBubble;
            minuteAmount = Math.floor(_amount/minuteBubble);
          }
        }
      }
    } } else {
        remainder = _amount % tinyBubble;
        tinyAmount = Math.floor(_amount/tinyBubble);
        _amount = _amount - remainder;
        remainder = _amount % minuteBubble;
        minuteAmount = Math.floor(_amount/minuteBubble);
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
       items: this.genItems( props.total, props.width, props.height,
        computeBubbles(parseInt(props.positive)).sum+1,
          computeBubbles(parseInt(props.neutral)).sum+1,
            computeBubbles(parseInt(props.negative)).sum+1,
              computeBubbles(parseInt(props.staking)).sum),
              bubbleState: 0 };
       this.colorScale = scaleOrdinal({
        range: this.colorSortation(
          computeBubbles(parseInt(props.positive)).sum+1,
            computeBubbles(parseInt(props.neutral)).sum+1,
              computeBubbles(parseInt(props.negative)).sum+1,
                computeBubbles(parseInt(props.staking)).sum),
        domain: this.state.items.map(d => d.id)
        });
      }

  genItems = (total, width, height, positive, neutral, negative, staking) =>
    genCircles({
      num: width < 360 ? 40 : computeBubbles(parseInt(total)),
      width: width,
      height: height,
      positive: positive,
      neutral: neutral,
      negative: negative,
      staking: staking
  });

  colorSortation = (_positive, _neutral, _negative, _staking) => {
  return(Array(_positive).fill(pos).concat(Array(_neutral).fill
    (neut).concat(Array(_negative).fill(neg).concat(Array(_staking)
    .fill(stake)))));
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
              width={width}
              height={height}
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
                    if(dx > 300 && dy < -150){
                      console.log("POSITIVE");
                      if(this.state.log == true){
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: positiveVote,
                          log: false,
                        })
                      }
                    } else if(dx > 275 && dy > 150){
                      console.log("NEUTRAL");
                      if(this.state.log == true){
                        this.setState({
                          bubbleState: this.state.bubbleState+1,
                          votingOption: neutralVote,
                          log: false,
                        })
                      }
                    } else if(dx < -200 && dy > 150){
                      console.log("NEGATIVE");
                      if(this.state.log == true){
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
                    fillOpacity={0.9}
                    stroke={isDragging ? 'white' : 'transparent'}
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
