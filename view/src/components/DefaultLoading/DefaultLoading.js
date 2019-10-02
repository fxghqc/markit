import React from 'react';
import PropTypes from 'prop-types';

const DefaultLoading = (props) => {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.timedOut) {
    return <div>Taking a long time...</div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

DefaultLoading.propTypes = {
  error: PropTypes.shape({}),
  timedOut: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
};

DefaultLoading.defaultProps = {
  error: undefined,
};

export default DefaultLoading;
