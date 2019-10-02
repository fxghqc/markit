/** @jsx jsx */
/**
 * TODO: row render schema
 */
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { AutoSizer, List } from 'react-virtualized';
import { css, jsx } from '@emotion/core';

import lastingFormat from '../lib/date';
// import Tag from './Tag';
import NoData from './NoData';
// import AddTag from './AddTag';
// import DeleteTag from './DeleteTag';

const listStyle = css`
  width: 100%;
  border: 1px solid #DDD;
  border-left-width: 0;
  border-right-width: 0;
  outline: 0;
`;

const rowStyle = css`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 25px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

const isScrollingPlaceholderStyle = css`
  // opacity: .5;
  // font-style: italic;
`;


class EntityList extends React.PureComponent {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List),
    render: PropTypes.func,
  };

  static defaultProps = {
    list: Immutable.List(),
    render: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      listRowHeight: 120,
      overscanRowCount: 10,
      scrollToIndex: undefined,
      showScrollingPlaceholder: false,
      useDynamicRowHeight: false,
    };

    this.listRef = React.createRef();
    this.getRowHeight = this.getRowHeight.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.list.equals(prevProps.list)) {
      if (!this.listRef.current) return;
      this.listRef.current.forceUpdateGrid();
    }
  }

  getDatum(index) {
    const { list } = this.props;
    return list.get(index % list.size);
  }

  getRowHeight({ index }) {
    return this.getDatum(index).size;
  }

  // eslint-disable-next-line class-methods-use-this
  noRowsRenderer() {
    return <NoData />;
  }

  rowRenderer({
    index, isScrolling, key, style,
  }) {
    const { showScrollingPlaceholder } = this.state;
    const { render } = this.props;
    const datum = this.getDatum(index);
    const tags = datum.get('tags');
    // const linkId = datum.get('id');

    if (showScrollingPlaceholder && isScrolling) {
      return (
        <div
          css={[rowStyle, isScrollingPlaceholderStyle]}
          key={key}
          style={style}
        >
          {/* remove this div, 模拟真实的数据，但性能更好 */}
          <div>
            <div className="leading-loose">
              <a className="align-middle text-blue">{datum.get('title')}</a>
            </div>
            {/* <div className="py-1 h-8 w-8" /> */}
            {/* perf!!! */}
            <div className="py-1 h-8">
              {tags.join(' ')}
              {/* {tags.map(tag => (
                <span className="mr-4" key={tag}>
                  <Tag
                    title={tag}
                    to={`/tags/${tag}`}
                  />
                </span>
              ))} */}
              {/* <AddTag />
              <DeleteTag /> */}
            </div>
            <div className="leading-loose text-sm text-grey-darker">
              {/* 如何提升这里的性能 */}
              {lastingFormat(datum.get('add_date'), 'Added')}
            </div>
          </div>
        </div>
      );
    }


    return (
      <div css={rowStyle} key={key} style={style}>
        {render(datum)}
      </div>
    );
  }

  render() {
    const {
      listRowHeight,
      overscanRowCount,
      scrollToIndex,
      useDynamicRowHeight,
    } = this.state;
    const { list } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={this.listRef}
            css={listStyle}
            height={height}
            overscanRowCount={overscanRowCount}
            noRowsRenderer={this.noRowsRenderer}
            rowCount={list.size}
            rowHeight={
              useDynamicRowHeight ? this.getRowHeight : listRowHeight
            }
            rowRenderer={this.rowRenderer}
            scrollToIndex={scrollToIndex}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}

export default EntityList;
