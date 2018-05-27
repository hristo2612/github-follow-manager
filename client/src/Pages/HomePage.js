// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';
import Grid from 'react-data-grid';
import { Formatters } from 'react-data-grid-addons';
import axios from 'axios';
import ordinal from 'ordinal';
import Dialog from '../Generic/Dialog';
import List from '../Generic/List';
import Button from '@material-ui/core/Button';
import GitHubLogin from 'react-github-login';

import '../App.css';

const { ImageFormatter } = Formatters;

const leftListStyle = {
  float: 'left'
}

const rightListStyle = {
  float: 'right'
}


class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._rows = []

    this.state = {
      followers: [],
      following: [],
      username: '',
      pageNumber: 1,
      fetchedFollowers: false,
      fetchedFollowing: false,
      followingSth: [],
      latestFollower: 1,
      tkn: localStorage.getItem('tkn')
    }
    this.getCurrent = this.getCurrent.bind(this)
  }

  onSuccess = (response) => {
    console.log(response);
    axios.post('http://localhost:8000/api/login', { code: response.code, accept: 'json' })
      .then(result => {
        console.log(result)
        localStorage.setItem('tkn', result.data.tkn);
        this.setState({ tkn: result.data.tkn });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onFailure = (response) => {
    console.error(response);
  }


  getFollows = () => {
    console.log(this.state.tkn);
    return axios.request({
      url: `https://api.github.com/users/hristo2612/followers?page=${this.state.pageNumber}`,
      method: 'get',
      headers: { 'Authorization': `token ${this.state.tkn}` }
    })
  }

  createRows = () => {
    let followers = [];
    this.getFollows().then((res) => {
      console.log(res.data);
      var data = res.data;
      if (data.length < 1) alert('No more data to load');
      else {
        for (let i = 0; i < data.length; i++) {
          followers.push({
            id: ordinal(i + this.state.latestFollower),
            avatar: data[i].avatar_url,
            user: data[i].login,
            url: data[i].html_url
          });
        }
        this.setState({ followers: [...this.state.followers, ...followers], pageNumber: this.state.pageNumber + 1, latestFollower: followers.length + this.state.latestFollower });
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  getCurrent() {
    this.createRows();
  }

  rowGetter = (i) => {
    return this._rows[i];
  };

  render() {
    let loginButton = null;
    let followButton = null;
    if (!this.state.tkn) {
      loginButton = <GitHubLogin clientId="3145d9a7608514f31567"
        className="styledButton"
        redirectUri=""
        scope="user"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure} />;
    } else {
      followButton = <button className="styledButton" onClick={this.getCurrent}>
        Load Followers
      </button>;
      loginButton = <button className="styledButton blue">Logged in..</button>;
    }
    return (
      <div>
        {loginButton}
        {followButton}
        <List followers={this.state.followers} style={leftListStyle} />
        <List followers={this.state.followers} style={rightListStyle} />
      </div>
    )
  }
}

export default HomePage;