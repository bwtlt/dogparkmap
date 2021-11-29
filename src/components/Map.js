import React, {
  useState, useEffect,
} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import Loading from './Loading';
import NewParkModal from './NewParkModal';

const MAP_CENTER = [46.756, 3.445];
const WEBHOOK_URL = 'https://webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-kmwss/service/DogParkMap/incoming_webhook/parks';

const ClickHandler = function () {
  const [position, setPosition] = useState(null);

  const closeButtonCallback = () => {
    setPosition(null);
  };

  const checkButtonCallback = async (name) => {
    await axios.post(
      WEBHOOK_URL,
      { name, position: [position.lat.toString(), position.lng.toString()] },
    );
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

const Map = function ({ mongoContext: { client, user } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [map, setMap] = useState(null);
  const [activePark, setActivePark] = useState(null);

  const db = 'dogparkmap';
  const collection = 'parks';

  useEffect(() => {
    async function getAllParks() {
      setLoading(true);
      try {
        const rests = client.db(db).collection(collection);
        setData((await rests.find()).slice(0, 10));
        setLoading(false);
      } catch (errorCode) {
        setError(true);
      }
    }

    if (loading && user && client) {
      getAllParks();
    }
  }, [client, loading, user]);

  if (loading) {
    return (
      <Loading />
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
        zoom={6}
        scrollWheelZoom
        whenCreated={(m) => {
          setMap(m);
        }}
      >
        {data.length > 0
        && data.map((park) => (
          <Marker
            key={park._id}
            position={[park.position[0], park.position[1]]}
            eventHandlers={{
              click: () => {
                setActivePark(park);
              },
            }}
          />
        ))}

        {activePark && (
          <Popup
            position={[activePark.position[0], activePark.position[1]]}
            onClose={() => {
              setActivePark(null);
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
};

Map.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mongoContext: PropTypes.object.isRequired,
};

export default Map;
