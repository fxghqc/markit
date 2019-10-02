import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import PlusCircle from 'react-feather/dist/icons/plus-circle';
import styled from '@emotion/styled';

import TagsPanel from './TagsPanel';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Wrapper = styled.div`
  display: inline-block;
  cursor: pointer;
  line-height: 0;
  vertical-align: middle;
  user-select: none;
  opacity: ${props => (props.active ? '1' : '.4')};
  &:hover {
    opacity: 1;

    svg {
      fill: #f87795;
      // fill: #71c6c6;
    }
  }
`;

class AddTag extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    linkId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    active: false,
  }

  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { active, linkId } = this.props;
    return (
      <Wrapper active={active}>
        { /* tabIndex="-1" fix Modal scroll problem */ }
        <PlusCircle size={16} onClick={this.openModal} tabIndex="-1" />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div style={{ width: '80vw', height: '80vh' }}>
            <TagsPanel linkId={linkId} />
          </div>
        </Modal>
      </Wrapper>
    );
  }
}

export default AddTag;
