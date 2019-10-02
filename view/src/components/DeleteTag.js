import React from 'react';
import PropTypes from 'prop-types';

import Delete from 'react-feather/dist/icons/x-circle';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: inline-block;
  cursor: pointer;
  line-height: 0;
  vertical-align: middle;
  user-select: none;
  opacity: ${props => (props.active ? '1' : '.4')};
  &:hover {
    opacity: 1;

    svg {
      fill: #f87795;
      // fill: #71c6c6;
    }
  }
`;

const DeleteTag = ({ active, ...extras }) => (
  <Wrapper active={active} {...extras}>
    <Delete size={16} />
  </Wrapper>
);

DeleteTag.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default DeleteTag;
