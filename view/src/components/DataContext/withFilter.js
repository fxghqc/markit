import React from 'react';
import PropTypes from 'prop-types';
import { List, fromJS } from 'immutable';
import { compose } from 'recompose';
// import memoizeOne from 'memoize-one';

import { withLinks } from './withLinks';

const reserveds = ['tag'];

const getValues = filter => (filter ? filter.values : []);

const findRelatedTags = (links) => {
  const relatedTags = links
    .reduce((result, link) => {
      link.get('tags').forEach(tag => result.add(tag));
      return result;
    }, new Set());

  return [...relatedTags];
};

const getReservedFilters = filterText => reserveds
  .map(word => ({
    index: filterText.indexOf(`${word}:`),
    reserved: word,
  }))
  .filter(s => s.index >= 0)
  .sort((a, b) => a.index - b.index);

function withFilteredLinks(WrappedComponent) {
  class FilterdLinks extends React.Component {
    static propTypes = {
      links: PropTypes.instanceOf(List).isRequired,
      isFetching: PropTypes.bool.isRequired,
    }

    state = {
      data: fromJS({
        filterText: '',
        filteredLinks: this.props.links,
        relatedTags: List(),
        onlyUnTagged: false,
      }),
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.links.equals(this.props.links)) {
        this.filterLinks();
      }
    }

    setFilterText = (text) => {
      if (text === this.state.data.get('filterText')) return;
      const { data } = this.state;
      this.setState(
        { data: data.set('filterText', text) },
        this.filterLinks,
      );
    }

    filterLinks = () => {
      const { data } = this.state;
      const { filteredLinks, relatedTags } =
        this.filterByFilterText(this.props.links, data.get('filterText'));

      // FIXME: ugly
      const filterededLinks = data.get('onlyUnTagged')
        ? filteredLinks.filter(link => link.get('tags').size === 0)
        : filteredLinks;
      const newData = data
        .set('filteredLinks', filterededLinks)
        .set('relatedTags', relatedTags);

      this.setState({ data: newData });
    }

    toggleOnlyUnTagged = () => {
      const { data } = this.state;

      this.setState(
        { data: data.set('onlyUnTagged', !data.get('onlyUnTagged')) },
        this.filterLinks,
      );
    }

    addFilterTag = (tag) => {
      const prevText = this.state.data.get('filterText');
      const filters = getReservedFilters(prevText.trim());
      const index = filters.findIndex(filter => filter.reserved === 'tag');
      if (index < 0) {
        this.setFilterText(`${prevText} tag:${tag}`);
        return;
      }

      const tailIndex = filters[index].index + 4;
      const next = filters[index + 1];
      if (next) {
        const tagExist = filters(index + 1).index > tailIndex;
        const text = `${prevText.slice(0, next.index)}${tagExist ? ',' : ''}${tag} ${prevText.slice(next.index)}`;
        this.setFilterText(text);
        return;
      }

      const tagExist = prevText.trim().length - 1 >= tailIndex;
      const text = `${prevText}${tagExist ? ',' : ''}${tag}`;
      this.setFilterText(text);
    }

    filterByFilterText = (links, filterText) => {
      const filterString = filterText.trim();
      if (!filterString) {
        return { filteredLinks: links, relatedTags: List() };
      }

      const splits = getReservedFilters(filterString);
      let text = '';
      if (!splits[0] || splits[0].index > 0) {
        text = filterString.slice(0, splits[0] && splits[0].index).trim();
      }

      const reservedFilters = splits.map((s, index) => {
        const reservedFilter = filterString.slice(
          s.index,
          index + 1 === splits.length
            ? undefined
            : splits[index + 1].index,
        );
        const params = reservedFilter.replace(`${s.reserved}:`, '');
        const values = params.split(',').map(v => v.trim());

        return {
          key: s.reserved,
          values,
        };
      }).filter(s => s.values.length > 0);

      const filterTags = getValues(reservedFilters.find(rf => rf.key === 'tag'));

      const filteredLinks = links
        .filter(link => (
          (text
            ? (link.get('title').includes(text) || link.get('tags').join('').includes(text))
            : true
          ) &&
          (filterTags.length > 0
            ? filterTags.every(tag => link.get('tags').includes(tag))
            : true
          )
        ));

      return {
        filteredLinks,
        relatedTags: fromJS(findRelatedTags(filteredLinks)),
      };
    }

    render() {
      const { isFetching } = this.props;
      const { data } = this.state;
      return (
        <WrappedComponent
          {...{
            isFetching,
            filteredLinks: data.get('filteredLinks'),
            relatedTags: data.get('relatedTags'),
            filterText: data.get('filterText'),
            onlyUnTagged: data.get('onlyUnTagged'),
            setFilterText: this.setFilterText,
            addFilterTag: this.addFilterTag,
            toggleOnlyUnTagged: this.toggleOnlyUnTagged,
          }}
        />
      );
    }
  }

  return FilterdLinks;
}

export default compose(
  withLinks,
  withFilteredLinks,
);
