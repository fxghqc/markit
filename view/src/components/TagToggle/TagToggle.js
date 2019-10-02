import React from 'react';
import PropTypes from 'prop-types';
import { BooleanValue } from 'react-values';
import styled from '@emotion/styled';
import Tag from 'react-feather/dist/icons/tag';

const Container = styled.div`
  position: relative;
`;

const TagWrapper = styled.div`
  color: ${props => (props.on ? '#333' : '#aaa')};
  cursor: pointer;
  user-select: none;
`;

const TagToggle = ({ value, defaultValue, onChange }) => (
  <BooleanValue value={value} defaultValue={defaultValue} onChange={onChange}>
    {({ value: on, toggle }) => (
      <Container>
        <TagWrapper on={on} onClick={toggle}>
          <Tag />
        </TagWrapper>
      </Container>
    )}
  </BooleanValue>
);

TagToggle.propTypes = {
  value: PropTypes.bool,
  defaultValue: PropTypes.bool,
  onChange: PropTypes.func,
};

TagToggle.defaultProps = {
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
};

export default TagToggle;
