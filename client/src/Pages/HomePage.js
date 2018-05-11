// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Home Page</h1>
        <Link className="button" to="/following"><button>following</button></Link>
        <Link className="button" to="/followers"><button>followers</button></Link>
      </div>
    )
  }
}

export default HomePage;