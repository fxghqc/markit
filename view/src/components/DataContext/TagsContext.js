import React from 'react';
import { List } from 'immutable';

const TagsContext = React.createContext({
  tags: List(),
  fetchTags: () => {},
  isFetching: false,
  filterText: '',
});

export default TagsContext;
