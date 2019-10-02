import React from 'react';
import { List } from 'immutable';

const LinksContext = React.createContext({
  links: List([]),
  fetchLinks: () => {},
  isFetching: false,
  addTags2Link: () => {},
  deleteTagFromLink: () => {},
});

export default LinksContext;
