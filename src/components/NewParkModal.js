import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';

class NewParkModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { parkSpecs: {} };
  }

  handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldVal = event.target.value;
    const { parkSpecs } = this.state;
    parkSpecs[fieldName] = fieldVal;
    this.setState({ parkSpecs });
  };

  handleSubmit = (event) => {
    const { parkSpecs } = this.state;
    event.preventDefault();
    const { checkCallback } = this.props;
    checkCallback(parkSpecs);
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
                name="name"
                placeholder="Entrez le nom du parc"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Entrez une courte courte description du parc"
                onChange={this.handleChange}
              />
            </Form.Group>
            <ButtonToolbar aria-label="Toolbar with button groups">
              <Button variant="secondary" onClick={closeCallback}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </ButtonToolbar>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

NewParkModal.propTypes = {
  closeCallback: PropTypes.func.isRequired,
  checkCallback: PropTypes.func.isRequired,
};

export default NewParkModal;
