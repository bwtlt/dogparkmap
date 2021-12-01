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
import Button from 'react-bootstrap/Button';
import Loading from '../components/Loading';
import NewParkModal from '../components/NewParkModal';
import GeoSearchBar from '../components/GeoSearchBar';
import FlyToButton from '../components/FlyToButton';
import { isAnon } from '../utils';

const MAP_CENTER = [46.756, 3.445];
const db = 'dogparkmap';
const collection = 'parks';

const ClickHandler = function ({ onClick }) {
  useMapEvents({
    click: (location) => {
      onClick([location.latlng.lat, location.latlng.lng]);
    },
  });

  return null;
};

ClickHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const Map = function ({ mongoContext: { client, user } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [activePark, setActivePark] = useState(null);
  const [newPark, setNewPark] = useState(null);
  const [addPark, setAddPark] = useState(false);

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
    setNewPark({ _id: uuidv4(), position });
  };

  const insertParkInDb = async (park) => {
    const parks = client.db(db).collection(collection);
    await parks.insertOne({
      name: park.name,
      description: park.description,
      position: [newPark.position[0].toString(), newPark.position[1].toString()],
      created: new Date().toISOString(),
    });
    setNewPark(null);
    setAddPark(false);
    setLoading(true);
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

        {addPark
        && (
        <NewParkModal
          closeCallback={() => {
            setNewPark(null);
            setAddPark(false);
          }}
          checkCallback={insertParkInDb}
        />
        )}

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

        {newPark && (
          <Popup
            position={[newPark.position[0], newPark.position[1]]}
            onClose={() => {
              setNewPark(null);
            }}
          >
            <Button onClick={() => { setAddPark(true); }}>Ajouter un parc ici</Button>
          </Popup>
        )}

        {activePark && (
          <Popup
            position={[activePark.position[0], activePark.position[1]]}
            onClose={() => {
              setActivePark(null);
            }}
          >
            <div>
              <h3>{activePark.name}</h3>
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
