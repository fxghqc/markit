import React from 'react';
import PropTypes from 'prop-types';
import { List, fromJS } from 'immutable';
import fetch from 'unfetch';

import env from '../../lib/env';
import TagsContext from './TagsContext';

/* eslint-disable react/no-unused-state */
class TagsProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      tags: List([]),
      fetchTags: this.fetchTags,
      isFetching: false,
      filterText: '',
      setFilterText: this.setFilterText,
    };
  }

  componentDidMount() {
    this.fetchTags();
  }

  setFilterText = (text) => {
    this.setState({
      filterText: text,
    });
  }

  fetchTags = async () => {
    this.setState({
      isFetching: true,
    });
    const url = `${env.REACT_APP_API}/tag?order=name.asc`;
    const res = await fetch(url);
    const json = await res.json();

    this.setState({
      tags: fromJS(json),
      isFetching: false,
    });
  }

  render() {
    return (
      <TagsContext.Provider value={this.state}>
        {this.props.children}
      </TagsContext.Provider>
    );
  }
}

export default TagsProvider;
