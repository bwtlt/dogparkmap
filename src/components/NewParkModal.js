import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

class NewParkModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    const { value } = this.state;
    event.preventDefault();
    const { checkCallback } = this.props;
    checkCallback(value);
  };

  render() {
    const { closeCallback } = this.props;
    return (
      <Modal show onHide={closeCallback}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un parc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom du parc</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom du parc"
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Chiens détachés autorisés" />
            </Form.Group>
            <Button variant="secondary" onClick={closeCallback}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

NewParkModal.propTypes = {
  closeCallback: PropTypes.func,
  checkCallback: PropTypes.func,
};

NewParkModal.defaultProps = {
  closeCallback: () => {},
  checkCallback: () => {},
};

export default NewParkModal;
