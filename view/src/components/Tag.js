/** @jsx jsx */
// import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Delete from 'react-feather/dist/icons/x-circle';
import { css, jsx, ClassNames } from '@emotion/core';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
`;

const Tag = ({
  selected, title, to, onClick, editing, onDelete,
}) => {
  const classes = [];
  classes.push(selected ? '' : 'tag', 'no-underline');
  if (typeof onClick === 'function') {
    classes.push('hover:cursor-pointer');
  }
  const Comp = to
    ? Link
    : 'div';
  return (
    <Wrapper className="relative inline-block hover:cursor-pointer">
      <ClassNames>
        {({ cx }) => (
          <Comp
            className={
              cx(
                { 'tag-selected': selected },
                { tag: !selected },
                'on-underline',
                { 'hover:cursor-pointer': typeof onClick === 'function' },
              )
            }
            {...{ to, onClick }}
          >
            {title}
          </Comp>
        )}
      </ClassNames>
      {editing && (
        <Delete
          size={16}
          css={css`
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
          `}
          className="absolute"
          onClick={onDelete}
        />
      )}
    </Wrapper>
  );
};

Tag.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  editing: PropTypes.bool,
  to: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

Tag.defaultProps = {
  selected: false,
  editing: false,
  to: undefined,
  onClick: undefined,
  onDelete: () => {},
};

export default Tag;
