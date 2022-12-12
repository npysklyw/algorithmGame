import React, { Component } from 'react';
import axios from 'axios';
import StatView from './StatView';
import './Statistics.css';
import { Link } from "react-router-dom";


// component to display the user statistics
export default class Statistics extends Component {

    // constructor
    constructor(props) {
      super(props);

      // state
      this.state = {
        statistics: []
      }
    }

    componentDidMount() {
        axios({
          method: "GET",
          url:"/get_stats",
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
        .then((response) => {
          const { data } = response["data"];
          this.setState({ statistics: [...data] });
        }).catch((err) => {
          if (err) {
            console.error(err.message);
          }
        });
    }

    render() {
        return (

            <div className="stats-container">
              <Link to='/MenuPage' id='backBtn'> Back </Link>
                <div className="stat-header-container">
                  <label>STAT NO</label>
                  <label>LEVEL</label>
                  <label>ALGORITHM</label>
                  <label>TIME</label>
                </div>
            {
                this.state.statistics.map((item, index) => {
                    return <StatView key={index} statID={index + 1} level={item.level} algorithm={item.algorithm} time={item.time} />
                })
            }
            </div>
        );
    }
}
