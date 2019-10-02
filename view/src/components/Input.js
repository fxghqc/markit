import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SearchIcon from 'react-feather/dist/icons/search';

const Input = ({ block, className, ...others }) => (
  <input
    className={cn({
      'transition transition-fast transition-delay-none focus:outline-2-shadow border border-transparent focus:bg-white placeholder-grey-darkest rounded bg-grey-lighter py-2 px-4 appearance-none leading-normal ds-input': true,
      'block w-full': block,
      [className]: true,
    })}
    {...others}
  />
);

Input.propTypes = {
  block: PropTypes.bool,
  className: PropTypes.string,
};

Input.defaultProps = {
  block: false,
  className: '',
};

const Search = ({ value, onChange, onEnter }) => (
  <div className="relative text-grey-dark">
    <Input
      className="pl-10"
      placeholder="search tags"
      block
      onChange={e => typeof onChange === 'function' && onChange(e.target.value)}
      onKeyPress={
        e => e.key === 'Enter' &&
          typeof onEnter === 'function' &&
          onEnter(e.target.value)
      }
      {...{ value }}
    />
    <SearchIcon className="absolute pin-l pin-t my-2 ml-2 pointer-events-none" />
  </div>
);

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
};

Search.defaultProps = {
  value: undefined,
  onChange: undefined,
  onEnter: undefined,
};

export {
  Search,
};

export default Input;
