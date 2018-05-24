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
    //this.createRows();
    this._columns = [
      { key: 'id', name: 'Place' },
      { key: 'avatar', name: 'Avatar', formatter: ImageFormatter },
      { key: 'user', name: 'User' } ];

    this._rows = [] 

    this.state = {
      followers: [],
      following: [],
      username: '',
      pageNumber: 1,
      fetchedFollowers: false,
      fetchedFollowing: false,
      followingSth: [],
      latestFollower: 1
    }
    this.getCurrent = this.getCurrent.bind(this)
  }

  getFollows = () => {
    return axios.request({
      url: `https://api.github.com/users/hristo2612/followers?page=${this.state.pageNumber}`,
      method: 'get',
      headers: { 'Authorization': 'token YOUR_AUTH_TOKEN_HERE' }
    })
  }

  createRows = () => {
    let rows = [];
    this.getFollows().then((res) => {
      console.log(res.data);
      var followers = res.data;
      if (followers.length < 1) alert('No more followers to load');
      for (let i = 0; i < followers.length; i++) {
        rows.push({
          id: ordinal(i + this.state.latestFollower),
          avatar: followers[i].avatar_url,
          user: followers[i].login
        });
      }
      
      this._rows = [...this._rows, ...rows];
      this.setState({followers: this._rows, pageNumber: this.state.pageNumber + 1, latestFollower: followers.length + this.state.latestFollower});
      this.forceUpdate();
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
    return (
      <div>
        <h1>Home Page</h1>
        <Button variant="raised" color="primary" onClick={this.getCurrent}>
           Load More Followers
        </Button>   
        <Dialog/>  
        {/* <Grid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
        defaultRow={{id: 1}}
        minHeight={500} /> */}
        <List followers={this.state.followers} style={leftListStyle} />
        <List followers={this.state.followers} style={rightListStyle} />
      </div>
    )
  }
}

export default HomePage;