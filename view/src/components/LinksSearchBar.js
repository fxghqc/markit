import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import PersistUpdate from './PersistUpdate';
import { Search } from './Input';
import Shortcuts from './Shortcuts';
import UnTaggedToggle from './UnTaggedToggle';

const LinksSearchBarContainer = styled.div`
  width: 100%;
`;

const LinksSearchBar = ({
  filterText, setFilterText,
  onlyUnTagged, toggleOnlyUnTagged,
}) => (
  <LinksSearchBarContainer className="relative">
    <div className="mb-2 px-8 py-2 bg-white relative flex shadow">
      <div className="flex-1 pr-2">
        <PersistUpdate defaultValue={filterText}>
          {(value, update) => (
            <Search
              value={value}
              onChange={update}
              onEnter={setFilterText}
            />
          )}
        </PersistUpdate>
      </div>
      <div className="flex-no-grow px-2 flex items-center">
        <Shortcuts />
        {
          // TODO: rewrite@2018-09-25
        }
        <UnTaggedToggle
          active={onlyUnTagged}
          onClick={toggleOnlyUnTagged}
        />
      </div>
    </div>
  </LinksSearchBarContainer>
);

LinksSearchBar.propTypes = {
  filterText: PropTypes.string.isRequired,
  setFilterText: PropTypes.func.isRequired,
  onlyUnTagged: PropTypes.bool.isRequired,
  toggleOnlyUnTagged: PropTypes.func.isRequired,
};

export default LinksSearchBar;
