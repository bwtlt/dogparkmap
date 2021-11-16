import React, {
  useState,
} from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, useMapEvents,
} from 'react-leaflet';
import './Map.css';
import * as parkData from './data/parks.json';

const ClickHandler = function () {
  const [position, setPosition] = useState(null);

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
    <Marker position={position}>
      <Popup>You clicked here.</Popup>
    </Marker>
  );
};

const Map = function () {
  const [activePark, setActivePark] = useState(null);

  const MAP_CENTER = [45.4394, 4.3871];

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={12}
      scrollWheelZoom
    >
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
