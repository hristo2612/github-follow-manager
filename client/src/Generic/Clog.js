import React from 'react';

class Clogged extends React.Component {
  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <div>
        Clogged
      </div>
    );
  }
}

export default Clogged;