import React, { Component } from 'react'
import axios from "axios";
import './Profile.css';
import Statistics from './Statistics';

export default class Profile extends Component {

  constructor(props) {
    super(props);

    // keep track of the state
    this.state = {
      profileData: null
    }
  }

  getData = () => {
    axios({
      method: "GET",
      url:"/profile",
      headers: {

        Authorization: 'Bearer ' + this.props.token

      }
    })
    .then((response) => {
      const res = response.data
      console.log(res);
      res.access_token && this.props.setToken(res.access_token)
      this.setState({ profileData: {
          profile_name: res.name,
          about_me: res.about,
          favAlg: res.info.favorite,
          bestTime: res.info.best_time,
          highestLevel: res.info.highest_level,
          totalGames: res.info.total_games
        }
      })
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { profileData } = this.state;
    return (
      <div>
        <h1 id="title">User Statistics</h1>
        <div className='dataframe'>
          <div id="profile">
            {
              profileData &&
              <div className="data-container">
                <p>Profile Name <br /> <i>{profileData.profile_name}</i></p>
                <p>About Me <br /> <i>{profileData.about_me}</i></p>
                <p>Favorite Algo <br /> <i>{profileData.favAlg}</i></p>
                <p>PR <br /> <i>{profileData.bestTime} min</i></p>
                <p>Highest Level <br /> <i>{profileData.highestLevel}</i></p>
                <p>Total Games Completed <br /> <i>{profileData.totalGames}</i></p>
              </div>
            }
          </div>
        </div>
        <Statistics token={this.props.token} />
      </div>
    )
  }
}

