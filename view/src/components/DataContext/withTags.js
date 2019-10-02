import React from 'react';

import TagsContext from './TagsContext';

const withTagsFilter = Comp => props => (
  <TagsContext.Consumer>
    {({ filterText, setFilterText }) => (
      <Comp {...{ filterText, setFilterText, ...props }} />
    )}
  </TagsContext.Consumer>
);

export {
  withTagsFilter,
};

const withTags = Comp => props => (
  <TagsContext.Consumer>
    { params => (
      <Comp {...params} {...props} />
    )}
  </TagsContext.Consumer>
);

export default withTags;
