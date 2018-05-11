// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <Link className="button" to="/"><button>Home</button></Link>
        <Link className="button" to="/followers"><button>Followers</button></Link>
        <Link className="button" to="/following"><button>Following</button></Link>
      </div>
    )
  }
}

export default Navigation;