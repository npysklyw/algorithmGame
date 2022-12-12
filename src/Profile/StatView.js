import React, { Component } from 'react';
import './StatView.css';

// component to display a stat row
export default class StatView extends Component {
  // constructor
  constructor(props) {
    super(props);
  }

  


  render() {
    return (
      <div className="stat-row-container">
        <label style={{ color: '#e040fb', fontWeight: 'bold' }}>{this.props.statID}</label>
        <label>{this.props.level}</label>
        <label>{this.props.algorithm}</label>
        <label>{this.props.time}</label>
      </div>
    )
  }
}
