import React from 'react';
import PropTypes from 'prop-types';
import { List, fromJS } from 'immutable';
import fetch from 'unfetch';

import env from '../../lib/env';
import LinksContext from './LinksContext';

/* eslint-disable react/no-unused-state */
class LinksProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      links: List(),
      fetchLinks: this.fetchLinks,
      isFetching: false,
      addTags2Link: this.addTags2Link,
      deleteTagFromLink: this.deleteTagFromLink,
    };
  }

  componentDidMount() {
    this.fetchLinks();
  }

  fetchLinks = async () => {
    this.setState({
      isFetching: true,
    });
    const url = `${env.REACT_APP_API}/link_with_tags?order=add_date.desc`;
    const res = await fetch(url);
    const json = await res.json();

    this.setState({
      links: fromJS(json),
      isFetching: false,
    });
  }

  addTags2Link = async (tags, linkId) => {
    const payload = tags.map(tag => ({
      link: linkId, tag: tag.id,
    }));

    try {
      const res = await fetch(`${env.REACT_APP_API}/link_tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('add tags to link failed!');
      }
      const { links } = this.state;
      const index = links.findIndex(link => link.get('id') === linkId);
      this.setState({
        links: links.updateIn([index, 'tags'], ts => ts.push(...tags.map(tag => tag.name))),
      });
    } catch (err) {
      console.log(err);
    }
  }

  deleteTagFromLink = async (name, linkId) => {
    try {
      let res = await fetch(`${env.REACT_APP_API}/tag?name=eq.${name}`);
      if (!res.ok) {
        throw new Error('get tag info failed!');
      }
      const result = await res.json();
      const tag = result[0];
      if (!tag) return;
      const tagId = tag.id;
      res = await fetch(`${env.REACT_APP_API}/link_tag?tag=eq.${tagId}&link=eq.${linkId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
        },
      });
      if (!res.ok) {
        throw new Error('delete tag from link failed!');
      }

      const { links } = this.state;
      const index = links.findIndex(link => link.get('id') === linkId);
      this.setState({
        links: links.updateIn(
          [index, 'tags'],
          (ts) => {
            const tIndex = ts.findIndex(t => t === name);
            if (tIndex < 0) return ts;
            return ts.delete(tIndex);
          },
        ),
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <LinksContext.Provider value={this.state}>
        {this.props.children}
      </LinksContext.Provider>
    );
  }
}

export default LinksProvider;
