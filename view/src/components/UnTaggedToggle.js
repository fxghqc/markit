import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import CheckCircle from 'react-feather/dist/icons/check-circle';

const Wrapper = styled.div`
  color: ${props => (props.active ? '#f76b8a' : '#aaa')};
  cursor: pointer;
  user-select: none;
  line-height: 0;
`;

const UnTaggedToggle = props => (
  <Wrapper {...props} title="Show untagged"><CheckCircle /></Wrapper>
);

UnTaggedToggle.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

UnTaggedToggle.defaultProps = {
  active: false,
};

export default UnTaggedToggle;
