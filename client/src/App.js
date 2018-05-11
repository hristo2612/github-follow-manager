import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navigation from './Components/Navigation';
import HomePage from './Pages/HomePage';
import FollowersPage from './Pages/FollowersPage';
import FollowingPage from './Pages/FollowingPage';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Navigation/>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/followers" component={FollowersPage}/>
            <Route exact path="/following" component={FollowingPage}/>
            <Route render={function() {
              return(<p>Not Found</p>);
            }}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
