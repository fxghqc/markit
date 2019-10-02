import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { compose, withState } from 'recompose';

import lastingFormat from '../lib/date';
import Tag from './Tag';
import AddTag from './AddTag';
import DeleteTag from './DeleteTag';
import { withLinksFuncs } from './DataContext/withLinks';

const enhance = compose(
  withLinksFuncs,
  withState('editing', 'toggleEdit', false),
);

const TagsRender = enhance(({
  tags, editing, toggleEdit, linkId, deleteTagFromLink,
}) => (
  <div className="py-1 h-8">
    {tags.map(tag => (
      <span className="mr-4" key={tag}>
        <Tag
          title={tag}
          to={`/tags/${tag}`}
          editing={editing}
          onDelete={() => { deleteTagFromLink(tag, linkId); }}
        />
      </span>
    ))}
    <AddTag linkId={linkId} />
    <DeleteTag active={editing && tags.size > 0} onClick={() => toggleEdit(!editing)} />
  </div>
));

TagsRender.propTypes = {
  tags: PropTypes.instanceOf(List).isRequired,
};

const LinkRender = ({ datum, style }) => (
  <div style={style}>
    <div className="leading-loose">
      <a href={datum.get('href')} className="align-middle text-blue">{datum.get('title')}</a>
    </div>
    { /* FIXME: use context ? */ }
    <TagsRender tags={datum.get('tags')} linkId={datum.get('id')} />
    <div className="leading-loose text-sm text-grey-darker">
      {lastingFormat(datum.get('add_date'), 'Added')}
    </div>
  </div>
);

LinkRender.propTypes = {
  datum: PropTypes.shape({}).isRequired,
  style: PropTypes.shape({}),
};

LinkRender.defaultProps = {
  style: {},
};

export default LinkRender;
