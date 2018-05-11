// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';

class FollowersPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Followers Page</h1>
        <Link className="button" to="/following"><button>following</button></Link>
        <Link className="button" to="/"><button>home</button></Link>
      </div>
    )
  }
}

export default FollowersPage;