import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';


export default class Timeout extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            timeout:1000 * 60 * 5 * 1,
            isTimedOut: false
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
    }

    _onAction(e) {
      this.setState({isTimedOut: false})
    }
   
    _onActive(e) {
      console.log('user is active', e)
      this.setState({isTimedOut: false})
    }
   
    _onIdle(e) {
      console.log('user is idle', e)
      const isTimedOut = this.state.isTimedOut
      if (isTimedOut) {
          this.props.history.push('/')
      } else {
        this.idleTimer.reset();
        this.setState({isTimedOut: true})
        window.location.href = "./MenuPage";
      }
      
    }

    render(){
      return(
        <>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />

            
        </>
      )
   }

 }

