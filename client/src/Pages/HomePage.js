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
import GitHubLogin from '../Components/GithubLogin';

import '../App.css';

const { ImageFormatter } = Formatters;

const GithubClientId = process.env.REACT_APP_CLIENT_ID;
const AppUrl = process.env.REACT_APP_URL;

const leftListStyle = {
  float: 'left'
}

const rightListStyle = {
  float: 'right'
}


class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      followers: [],
      following: [],
      username: '',
      pageNumber: 1,
      pageNumberFollowing: 1,
      fetchedFollowers: false,
      fetchedFollowing: false,
      followingSth: [],
      latestFollower: 1,
      latestFollowing: 1,
      checkedFollowers: [],
      checkedFollowing: [],
      tkn: localStorage.getItem('tkn')
    }
  }

  onSuccess = (response) => {
    console.log(response);
    axios.post(AppUrl + '/api/login', { code: response.code, accept: 'json' })
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


  getFollowers = () => {
    console.log(this.state.tkn);
    return axios.request({
      url: `https://api.github.com/users/hristo2612/followers?page=${this.state.pageNumber}`,
      method: 'get',
      headers: { 'Authorization': `token ${this.state.tkn}` }
    })
  }

  unfollowPerson = (user) => {
    return axios.request({
      url: `https://api.github.com/user/following/${user}`,
      method: 'delete',
      headers: { 'Authorization': `token ${this.state.tkn}` }
    })
  }

  getFollowing = () => {
    console.log(this.state.tkn);
    return axios.request({
      url: `https://api.github.com/users/hristo2612/following?page=${this.state.pageNumberFollowing}`,
      method: 'get',
      headers: { 'Authorization': `token ${this.state.tkn}` }
    })
  }

  getCurrentFollowers = () => {
    let followers = [];
    this.getFollowers().then((res) => {
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
        this.setState({ followers: [...this.state.followers, ...followers], pageNumber: this.state.pageNumber + 1, latestFollower: followers.length + this.state.latestFollower }, () => {
          this.checkPeople();
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  getCurrentFollowing = () => {
    let following = [];
    this.getFollowing().then((res) => {
      console.log(res.data);
      var data = res.data;
      if (data.length < 1) alert('No more data to load');
      else {
        for (let i = 0; i < data.length; i++) {
          following.push({
            id: ordinal(i + this.state.latestFollowing),
            avatar: data[i].avatar_url,
            user: data[i].login,
            url: data[i].html_url
          });
        }
        this.setState({ following: [...this.state.following, ...following], pageNumberFollowing: this.state.pageNumberFollowing + 1, latestFollowing: following.length + this.state.latestFollowing }, () => {
          this.checkPeople();   
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  checkPeople = () => {
    let followers = this.state.followers;
    let following = this.state.following;
    let checkedFollowing = this.state.checkedFollowing;
    let peopleNotFollowingYou = [];

    if (followers.length > 0 && following.length > 0) {
      for (let i = 0; i < following.length; i++) {
        if (followers.find(item => item.user === following[i].user) === undefined) {
          peopleNotFollowingYou.push(following[i].user);
        }
      }
      this.setState({ checkedFollowing: peopleNotFollowingYou });
    }
  }

  unfollowChecked = () => {
    let unfollowPromises = [];
    let checked = this.state.checkedFollowing;
    for (let i = 0; i < checked.length; i++) {
      unfollowPromises.push(this.unfollowPerson(checked[i]));
    }
    let following = this.state.following;
    let self = this;
    axios.all(unfollowPromises).then(axios.spread(function (acct, perms) {
      alert('Successfully unfollowed selected users!');
      let newFollowing = self.state.following;
      for (let i = 0; i < checked.length; i++) {
        let checkedIndex = self.state.following.findIndex(item => item.user === checked[i]);
        if (checkedIndex > -1) {
          newFollowing.splice(checkedIndex, 1);
        }
      }
      self.setState({ following: newFollowing, checkedFollowing: [] });
    }));
  }

  handleFollowerToggle = value => () => {
    const { checkedFollowers } = this.state;
    const currentIndex = checkedFollowers.indexOf(value.user);
    const newChecked = [...checkedFollowers];

    if (currentIndex === -1) {
      newChecked.push(value.user);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checkedFollowers: newChecked,
    });
  };

  handleFollowingToggle = value => () => {
    const { checkedFollowing } = this.state;
    const currentIndex = checkedFollowing.indexOf(value.user);
    const newChecked = [...checkedFollowing];

    if (currentIndex === -1) {
      newChecked.push(value.user);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checkedFollowing: newChecked,
    });
  };

  render() {
    let loginButton = null;
    let followerButton = null;
    let followingButton = null;
    let unfollowButton = null;

    if (!this.state.tkn) {
      loginButton = <GitHubLogin clientId={GithubClientId}
        className="styledButton"
        redirectUri=""
        scope="user"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure} />;
    } else {
      followerButton = <button className="styledButton" onClick={this.getCurrentFollowers}>
        Followers ({this.state.followers.length})
      </button>;
      followingButton = <button className="styledButton red" onClick={this.getCurrentFollowing}>
        Following ({this.state.following.length})
    </button>;
      loginButton = <button className="styledButton blue">Logged in..</button>;
      unfollowButton = <button className="styledButton" onClick={this.unfollowChecked}>Unfollow Checked</button>
    }
    return (
      <div>
        {loginButton}
        {followerButton}
        {followingButton}
        {unfollowButton}
        <List followers={this.state.followers} checked={this.state.checkedFollowers} handleToggle={this.handleFollowerToggle} style={leftListStyle} />
        <List followers={this.state.following} checked={this.state.checkedFollowing} handleToggle={this.handleFollowingToggle} style={rightListStyle} />
      </div>
    )
  }
}

export default HomePage;