// External Lib Imports
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Link className="button" to="/"><Button color="inherit">Home</Button></Link>
            <Link className="button" to="/followers"><Button color="inherit">Followers</Button></Link>
            <Link className="button" to="/following"><Button color="inherit">Following</Button></Link>
            
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default Navigation;