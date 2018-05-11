// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';

class FollowingPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Following Page</h1>
        <Link className="button" to="/followers"><button>followers</button></Link>
        <Link className="button" to="/"><button>home</button></Link>
      </div>
    )
  }
}

export default FollowingPage;