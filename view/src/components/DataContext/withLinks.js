import React from 'react';

import LinksContext from './LinksContext';

const withLinks = Comp => props => (
  <LinksContext.Consumer>
    {({ links, isFetching }) => (
      <Comp {...props} {...{ links, isFetching }} />
    )}
  </LinksContext.Consumer>
);

const withLinksFuncs = Comp => props => (
  <LinksContext.Consumer>
    {({ deleteTagFromLink }) => (
      <Comp {...props} {...{ deleteTagFromLink }} />
    )}
  </LinksContext.Consumer>
);

export {
  withLinks, withLinksFuncs,
};
