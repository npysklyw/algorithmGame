import React, { Component } from 'react';
import { notification } from 'antd';
import axios from 'axios';
import './Timer.css';

// component to display the time the user takes on a level
export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: '00:00',
      start: new Date(),
      completed: this.props.completed
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      let sec = 1000;
      let min = 60 * sec;

      let milliseconds = (new Date().getTime() - this.state.start.getTime());

      let seconds = Math.floor((milliseconds / sec) % 60);
      seconds = seconds < 10 ? '0' + seconds : seconds

      let minutes = Math.floor(milliseconds / min);
      minutes = minutes < 10 ? '0' + minutes : minutes;

      let timer = minutes + ':' + seconds;

      this.setState({ display: timer });
      
    }, 1000);

    // display notification that the timer has started
    notification.info({
      message: 'Timer has started!',
      description: 'Complete the level as soon as possible!',
      placement: 'topLeft'
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    console.log(this.props);

    if (!localStorage.getItem('token')) {
      // notify the user to login
      notification.error({
        message: 'Need to be logged in to do that!',
        description: `Please login to record your score`,
        placement: 'topLeft'
      });

      return;
    }

    if (this.props.completed) {
      // notify the user of their time when they finish
      notification.info({
        message: 'Timer has stopped!',
        description: `You completeted this level in ${this.state.display} minutes`,
        placement: 'topLeft'
      });

      // change the display into a decimal number
      const time = this.state.display.split(':').join('.');

      // axios request to save the best time
      axios({
        method: "POST",
        url: "/add_entry",
        data: {
          algorithm: this.props.algorithm,
          level: this.props.level,
          time: parseFloat(time),
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      }
  }

  render() {
    return (
      <div id="timer" className="timer">
        {this.state.display} MINUTES
      </div>
    )
  }
}
