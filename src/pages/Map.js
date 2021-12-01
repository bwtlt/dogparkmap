import React, {
  useState, useEffect,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../components/Loading';
// import NewParkModal from '../components/NewParkModal';
import GeoSearchBar from '../components/GeoSearchBar';
import FlyToButton from '../components/FlyToButton';
import { isAnon } from '../utils';

require('../media/pin.svg');

const MAP_CENTER = [46.756, 3.445];
const db = 'dogparkmap';
const collection = 'parks';

// eslint-disable-next-line no-unused-vars
const ClickHandler = function ({ client, onClick }) {
  // const [position, setPosition] = useState(null);

  /*
  const closeButtonCallback = () => {
    setPosition(null);
  };

  const checkButtonCallback = async (name) => {
    const parks = client.db(db).collection(collection);
    await parks.insertOne({
      name,
      position: [position.lat.toString(), position.lng.toString()],
    });
    setPosition(null);
  };
  */

  const map = useMapEvents({
    click: (location) => {
      onClick([location.latlng.lat, location.latlng.lng]);
      map.flyTo(location.latlng, map.getZoom());
    },
  });

  return null;
};

ClickHandler.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  client: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Map = function ({ mongoContext: { client, user } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [activePark, setActivePark] = useState(null);

  useEffect(() => {
    async function getAllParks() {
      setLoading(true);
      try {
        const parks = client.db(db).collection(collection);
        setData((await parks.find()).slice(0, 10));
        setLoading(false);
      } catch (errorCode) {
        setError(true);
      }
    }

    if (loading && user && client) {
      getAllParks();
    }
  }, [client, loading, user]);

  const handleClick = (position) => {
    const markers = data.slice();
    markers.push({ _id: uuidv4(), position, temporary: true });
    setData(markers);
  };

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
      <MapContainer
        center={MAP_CENTER}
        zoom={6}
        scrollWheelZoom
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
        {!isAnon(user)
        && (
        <ClickHandler
          client={client}
          onClick={handleClick}
        />
        )}
        <GeoSearchBar />
        <FlyToButton />
      </MapContainer>
    </div>
  );
};

Map.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mongoContext: PropTypes.object.isRequired,
};

export default Map;
