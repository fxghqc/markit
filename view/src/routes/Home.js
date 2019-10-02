/** @jsx jsx */
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

// import MarkList from '../components/MarkList';
import EntityList from '../components/EntityList';
import LinkRender from '../components/LinkRender';
import BallRotate from '../components/BallRotate';
import { withFilter } from '../components/DataContext';
import LinksSearchBar from '../components/LinksSearchBar';
import RelatedTags from '../components/RelatedTags';

const render = datum => (
  <LinkRender datum={datum} />
);

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
`;

const Body = styled.div`
  flex: 1;
  margin: 0 -1rem;
  display: flex;
`;

const Left = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
`;

const ListContainer = styled.div`
  overflow: auto;
  flex: 1;
`;

const Right = styled.div`
  width: 40%;
  padding: 1rem;
`;

// const tagPattern = /tag:(([^,\s]+,)*[^,\s]+)/;
// const [tagString, filterTags] = filterText.match(tagPattern);

const Home = ({
  isFetching, filteredLinks, relatedTags, setFilterText,
  addFilterTag, filterText, onlyUnTagged, toggleOnlyUnTagged,
}) => (
  <Container>
    <Header>
      <LinksSearchBar {...{
        setFilterText, filterText, onlyUnTagged, toggleOnlyUnTagged,
      }}
      />
    </Header>
    <Body>
      <Left>
        <ListContainer>
          {isFetching
            ? <BallRotate center />
            : <EntityList list={filteredLinks} render={render} />
          }
        </ListContainer>
      </Left>
      <Right>
        <RelatedTags tags={relatedTags} addFilterTag={addFilterTag} />
      </Right>
    </Body>
  </Container>
);

Home.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onlyUnTagged: PropTypes.bool.isRequired,
  filteredLinks: PropTypes.instanceOf(List).isRequired,
  relatedTags: PropTypes.instanceOf(List).isRequired,
  filterText: PropTypes.string.isRequired,
  setFilterText: PropTypes.func.isRequired,
  addFilterTag: PropTypes.func.isRequired,
  toggleOnlyUnTagged: PropTypes.func.isRequired,
};

export default withFilter(Home);
