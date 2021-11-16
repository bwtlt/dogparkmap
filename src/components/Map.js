import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import './Map.css';
import * as parkData from './data/parks.json';

const ClickHandler = function () {
  const [position, setPosition] = useState(null);

  const closeButtonCallback = () => {
    console.log('bye');
    setPosition(null);
  };

  const checkButtonCallback = () => {
    console.log('hi');
    setPosition(null);
  };

  const map = useMapEvents({
    click: (location) => {
      setPosition(location.latlng);
      map.flyTo(location.latlng, map.getZoom());
    },
    locationfound: (location) => {
      setPosition(location.latlng);
      map.flyTo(location.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <AddParkModal
      closeCallback={closeButtonCallback}
      checkCallback={checkButtonCallback}
    />
  );
};

const AddParkModal = function ({ closeCallback, checkCallback }) {
  return (
    <Modal show onHide={closeCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un parc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom du parc</Form.Label>
            <Form.Control type="text" placeholder="Entrez le nom du parc" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Chiens détachés autorisés" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeCallback}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={checkCallback}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddParkModal.propTypes = {
  closeCallback: PropTypes.func,
  checkCallback: PropTypes.func,
};

AddParkModal.defaultProps = {
  closeCallback: () => {},
  checkCallback: () => {},
};

const Map = function () {
  const [activePark, setActivePark] = useState(null);

  const MAP_CENTER = [45.4394, 4.3871];

  return (
    <MapContainer className="container" center={MAP_CENTER} zoom={12} scrollWheelZoom>
      {parkData.features.map((park) => (
        <Marker
          key={park.properties.PARK_ID}
          position={[
            park.geometry.coordinates[0],
            park.geometry.coordinates[1],
          ]}
          eventHandlers={{
            click: () => {
              setActivePark(park);
            },
          }}
        />
      ))}

      {activePark && (
        <Popup
          position={[
            activePark.geometry.coordinates[0],
            activePark.geometry.coordinates[1],
          ]}
          onClose={() => {
            setActivePark(null);
          }}
        >
          <div>
            <h2>{activePark.properties.NAME}</h2>
            <p>{activePark.properties.DESCRIPTION}</p>
          </div>
        </Popup>
      )}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler />
    </MapContainer>
  );
};

export default Map;
