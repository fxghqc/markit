import React from 'react';
import NProgress from 'nprogress';

class PProgress extends React.Component {
  componentDidMount() {
    NProgress.start();
  }
  componentWillUnmount() {
    NProgress.done();
  }

  render() {
    return null;
  }
}

export default PProgress;
