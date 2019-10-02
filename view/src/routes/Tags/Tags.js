import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Tag from './Tag';

const Tags = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={Dashboard} />
    <Route path={`${match.path}/:name`} component={Tag} />
  </Switch>
);

Tags.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default Tags;
