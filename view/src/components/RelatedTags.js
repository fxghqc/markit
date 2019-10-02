import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Tag from './Tag';

const RelatedTags = ({ tags, addFilterTag }) => (
  <div>
    {tags.map(tag => (
      <span className="mr-4 mb-4 inline-block" key={tag}>
        <Tag
          title={tag}
          onClick={() => {
            addFilterTag(tag);
          }}
        />
      </span>
    ))}
  </div>
);

RelatedTags.propTypes = {
  tags: PropTypes.instanceOf(List).isRequired,
  addFilterTag: PropTypes.func.isRequired,
};

export default RelatedTags;
