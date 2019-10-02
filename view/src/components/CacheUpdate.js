import React from 'react';
import PropTypes from 'prop-types';

class CacheUpdate extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    state: PropTypes.shape({}).isRequired,
  }

  state = this.props.state

  update = (updation) => {
    this.setState(updation);
  }

  render() {
    return this.props.children(this.state, this.update);
  }
}

export default CacheUpdate;
