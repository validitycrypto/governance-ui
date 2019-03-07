import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { Drag, raise } from '@vx/drag';

const neg = ['#ff0c9e']
const neut = ['#ff6f0c']
const pos = ['#0cff6d']
const stake = ['#0cffe9']

function genCircles({ num, width, height, positive, neutral, negative, staking }) {
  return Array(num)
    .fill(1)
    .map((d, i) => {
      var xcord;
      var ycord;
      const radius = 25 - Math.random() * 20;
      if(i < positive){
        xcord = 950;
        ycord = 100;
      } else if(i >= positive
        && i < positive+neutral){
        xcord = 950;
        ycord = 550;
      } else if(i >= positive+neutral
        && i < positive+neutral+negative){
        xcord = 100;
        ycord = 550;
      } else if(i >= positive+neutral+negative){
        xcord = 500;
        ycord = 300;
      }
      return {
        id: i,
        radius,
        x: Math.round(xcord + (Math.floor(Math.random() * (radius * 5)))),
        y: Math.round(ycord + (Math.floor(Math.random() * (radius * 5)))),
      };
    });
}

class Delegation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.genItems({ ...props }),
    };
    this.colorScale = scaleOrdinal({
      range: Array(props.negative).fill(pos).concat(
        Array(props.negative).fill(neut).concat(
          Array(props.neutral).fill(neg).concat(
            Array(props.stake).fill(stake)))),
      domain: this.state.items.map(d => d.id),
    });
  }

  componentWillReceiveProps(nextProps) {
      this.setState(() => {
        return {
          items: this.genItems({ ...nextProps }),
        };
      });
  }

  genItems = ({ width, height, amount, negative, positive, neutral, staking }) =>
    genCircles({
      num: width < 360 ? 40 : parseInt(amount),
      width,
      height,
      negative,
      positive,
      neutral,
      staking
  });

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
          {this.state.items.map((d, i) => (
            <Drag
              key={`${d.id}`}
              width={width}
              height={height}
              onDragStart={() => {
                // svg follows the painter model
                // so we need to move the data item
                // to end of the array for it to be drawn
                // "on top of" the other data items
                this.setState((state, props) => {
                  return {
                    items: raise(state.items, i),
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
                console.log("DROP", dx, dy)
                console.log("ID", d.id, dy)

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

export default Delegation
