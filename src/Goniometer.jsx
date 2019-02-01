import React from 'react';

export default class Goniometer extends React.Component {
  constructor(props) {
    super(props);
    this.updateMeter = this.updateMeter.bind(this);
    this.paintMeter = this.paintMeter.bind(this);
    this.xForLR = this.xForLR.bind(this);
    this.yForLR = this.yForLR.bind(this);
    this.pairs = [];
    for (let i = 0; i < 256; i += 1) {
      this.pairs.push([0, 0]);
    }
    this.meterNode = this.props.audioCtx.createScriptProcessor(2048, 2, 2);
    this.meterNode.connect(this.props.audioCtx.destination);
    this.meterNode.onaudioprocess = this.updateMeter;
  }

  componentDidMount() {
    this.paintMeter();
    this.connectSourceNodes();
  }

  connectSourceNodes() {
    this.props.sourceNodes.forEach(sourceNode => {
      sourceNode.connect(this.meterNode);
    });
  }

  updateMeter(audioProcessingEvent) {
    const inputBuffer = audioProcessingEvent.inputBuffer;
    const lData = inputBuffer.getChannelData(0);
    const rData = inputBuffer.getChannelData(1);
    for (let sample = 0; sample < inputBuffer.length; sample++) {
      if (sample % 8 === 0) {
        this.pairs = this.pairs.slice(1);
        this.pairs.push([lData[sample], rData[sample]]);
      }
    }
  }

  paintMeter() {
    this.pairs.forEach((pair, i) => {
      this['circle' + i].setAttribute('cx', this.xForLR(pair));
      this['circle' + i].setAttribute('cy', this.yForLR(pair));
    });
    window.requestAnimationFrame(this.paintMeter);
  }

  xForLR(pair) {
    const half = this.props.size / 2;
    const multiplier = this.props.size * 0.8;
    return half + ((pair[1] - pair[0]) * multiplier);
  }

  yForLR(pair) {
    const half = this.props.size / 2;
    const multiplier = this.props.size * 0.8;
    return half - ((pair[1] + pair[0]) * multiplier);
  }

  render() {
    const size = this.props.size;
    const pad = 20;
    const styles = {
      outer: {
        height: size + 'px',
        width: size + 'px',
        backgroundColor: '#222',
      },
      axis: {
        stroke: '#888',
        strokeWidth: '1',
      },
      axisLabel: {
        fontSize: '12px',
        fill: '#888',
      },
    };
    return (
      <div style={styles.outer}>
        <svg width={size} height={size}>
          <line x1={pad} x2={size - pad} y1={pad} y2={size - pad} style={styles.axis} />
          <line x1={size - pad} x2={pad} y1={pad} y2={size - pad} style={styles.axis} />
          <text x={pad / 2} y={pad * 0.8} style={styles.axisLabel}>L</text>
          <text x={size - pad} y={pad * 0.8} style={styles.axisLabel}>R</text>
          {
            this.pairs.map((pair, i) => {
              return (
                <circle
                  key={'circle' + i}
                  ref={(c) => { this['circle' + i] = c; }}
                  cx={size / 2}
                  cy={size / 2}
                  r={1}
                  style={{fill: 'rgba(0, 255, 0, ' + i + ')'}}
                />
              );
            })
          }
        </svg>
      </div>
    );
  }
}
