import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './BallRotate.css';

const BallRotate = ({ fullscreen, center }) => (
  <div className={cn({ [styles._]: true, [styles.full]: fullscreen, 'mx-auto': center })}>
    <div className={styles['ball-rotate']}>
      <div />
    </div>
  </div>
);

BallRotate.propTypes = {
  fullscreen: PropTypes.bool,
  center: PropTypes.bool,
};

BallRotate.defaultProps = {
  fullscreen: false,
  center: false,
};

export default BallRotate;
