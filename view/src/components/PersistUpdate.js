import React from 'react';
import PropTypes from 'prop-types';
/*
 * use this carefully!!!
 * shouldComponentUpdate!!!
 * TODO: rename this component to CacheUpdateCarefulHandler
 */
class PersistUpdate extends React.Component {
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/forbid-prop-types */
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultValue: PropTypes.any.isRequired,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue !== state.prevDefaultValue) {
      return {
        value: props.defaultValue,
        prevDefaultValue: props.defaultValue,
      };
    }
    return null;
  }

  state = {
    value: this.props.defaultValue,
    prevDefaultValue: this.props.defaultValue,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.value !== this.state.value) {
      return true;
    }

    return false;
  }

  update = (newValue) => {
    this.setState({ value: newValue });
  }

  render() {
    return this.props.children(this.state.value, this.update);
  }
}

export default PersistUpdate;
