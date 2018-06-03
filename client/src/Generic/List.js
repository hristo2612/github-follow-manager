import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Clogged from './Clog';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class CheckboxListSecondary extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} style={this.props.style}>
        <List>
          {(this.props.followers).map(value => (
            <ListItem key={value.id} dense button className={classes.listItem}>
              {/* <Clogged value={value}/> */}
              <a href={value.url} target="_blank"><Avatar alt="Remy Sharp" src={value.avatar} /></a>
              <ListItemText primary={`${value.id} ${value.user}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.props.handleToggle(value)}
                  checked={this.props.checked.indexOf(value.user) !== -1}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

CheckboxListSecondary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxListSecondary);