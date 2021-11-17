import React, {
  Component, useState,
} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import './Map.css';
import NewParkModal from './NewParkModal';

const ClickHandler = function () {
  const [position, setPosition] = useState(null);

  const closeButtonCallback = () => {
    setPosition(null);
  };

  const checkButtonCallback = async (name) => {
    await axios.post('http://localhost:8888/parks/add', { name, position: [position.lat.toString(), position.lng.toString()] });
    setPosition(null);
  };

  const map = useMapEvents({
    click: (location) => {
      setPosition(location.latlng);
      map.flyTo(location.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <NewParkModal
      closeCallback={closeButtonCallback}
      checkCallback={checkButtonCallback}
    />
  );
};

const MAP_CENTER = [45.4394, 4.3871];

const FlyToButton = function ({ map }) {
  return (
    <Button
      onClick={() => {
        map.locate().on('locationfound', (e) => {
          map.flyTo(e.latlng, map.getZoom());
        });
      }}
    >
      Centrer sur votre position
    </Button>
  );
};

FlyToButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  map: PropTypes.object,
};

FlyToButton.defaultProps = {
  map: null,
};

class Map extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      data: null,
      activePark: null,
      map: null,
    };
  }

  componentDidMount() {
    this.getAllParks();
  }

  async getAllParks() {
    this.setState({ loading: true });
    try {
      const response = await axios.get('http://localhost:8888/parks');
      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      error, loading, data, activePark, map,
    } = this.state;

    if (loading) {
      return (
        <Spinner animation="border" role="status" className="container">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      );
    }

    if (error || data === null) {
      return <div>Erreur de chargement des données</div>;
    }

    return (
      <div className="container">
        <FlyToButton map={map} />
        <MapContainer
          center={MAP_CENTER}
          zoom={12}
          scrollWheelZoom
          whenCreated={(m) => { this.setState({ map: m }); }}
        >
          {data.map((park) => (
            <Marker
              key={park._id}
              position={[park.position[0], park.position[1]]}
              eventHandlers={{
                click: () => {
                  this.setState({ activePark: park });
                },
              }}
            />
          ))}

          {activePark && (
            <Popup
              position={[activePark.position[0], activePark.position[1]]}
              onClose={() => {
                this.setState({ activePark: null });
              }}
            >
              <div>
                <h2>{activePark.name}</h2>
                <p>{activePark.description}</p>
              </div>
            </Popup>
          )}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickHandler />
        </MapContainer>
      </div>
    );
  }
}

export default Map;
