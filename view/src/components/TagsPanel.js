import React from 'react';
import PropTypes from 'prop-types';
import { withStateHandlers } from 'recompose';

import Tag from './Tag';
import { LinksContext, TagsContext } from './DataContext';
import { filterTags } from './DataContext/selectors';
import { Search } from './Input';
import PersistUpdate from './PersistUpdate';

const SearchBar = () => (
  <TagsContext.Consumer>
    {
      ({ filterText, setFilterText }) => (
        <PersistUpdate defaultValue={filterText}>
          {(value, update) => (
            <Search {...{ value, onChange: update, onEnter: setFilterText }} />
          )}
        </PersistUpdate>
      )
    }
  </TagsContext.Consumer>
);

const Tags = ({ checkSelect, toggleSelect }) => (
  <TagsContext.Consumer>
    {({ tags, filterText }) => (
      <React.Fragment>
        {
          filterTags(tags.toJS(), filterText).map((tag) => {
            const { name } = tag;
            const selected = checkSelect(tag);
            return (
              <span key={name} className="pr-4 mb-2 inline-block">
                <Tag
                  title={name}
                  selected={selected}
                  onClick={() => toggleSelect(tag)(!selected)}
                />
              </span>
            );
          })
        }
      </React.Fragment>
    )}
  </TagsContext.Consumer>
);

Tags.propTypes = {
  checkSelect: PropTypes.func.isRequired,
  toggleSelect: PropTypes.func.isRequired,
};

const withSelection = withStateHandlers(
  ({ initialSelection = [] }) => ({
    selection: initialSelection,
  }),
  {
    select: ({ selection }) => tag => ({
      selection: [...selection, tag],
    }),
    deselect: ({ selection }) => tag => ({
      selection: selection.filter(s => s.id !== tag.id),
    }),
  },
);

const SelectedTags = ({ selection, linkId }) => (
  <div className="flex my-4 leading-loose">
    <div className="flex-1 p-2 text-grey-dark border border-dashed rounded">
      {selection && selection.length > 0
        ? selection.map(({ name }) => (
          <span key={name} className="pr-4 inline-block">
            <Tag
              title={name}
            />
          </span>
        ))
        : 'selected tags will be displayed here...'
      }
    </div>
    <div className="items-start p-2">
      <LinksContext.Consumer>
        {({ addTags2Link }) => (
          <button className="btn" onClick={() => { addTags2Link(selection, linkId); }}>保存</button>
        )}
      </LinksContext.Consumer>
    </div>
  </div>
);

SelectedTags.propTypes = {
  selection: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  linkId: PropTypes.string.isRequired,
};

const TagsPanel = withSelection(({
  selection, select, deselect, linkId,
}) => (
  <div>
    <SearchBar />
    <SelectedTags {...{ selection }} linkId={linkId} />
    <Tags
      checkSelect={tag => selection.findIndex(selected => selected.id === tag.id) >= 0}
      toggleSelect={tag => (selected) => {
        if (selected) {
          select(tag);
        } else {
          deselect(tag);
        }
      }}
    />
  </div>
));

TagsPanel.propTypes = {
  linkId: PropTypes.string.isRequired,
};

export default TagsPanel;
