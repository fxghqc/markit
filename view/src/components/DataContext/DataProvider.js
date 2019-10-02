import React from 'react';
import PropTypes from 'prop-types';

import LinksProvider from './LinksProvider';
import TagsProvider from './TagsProvider';

const DataProvider = ({ children }) => (
  <LinksProvider>
    <TagsProvider>
      {children}
    </TagsProvider>
  </LinksProvider>
);

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataProvider;
