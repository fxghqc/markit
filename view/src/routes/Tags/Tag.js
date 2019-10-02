import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ match }) => (
  <div>{match.params.name}</div>
);

Tag.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string }),
  }).isRequired,
};

export default Tag;
