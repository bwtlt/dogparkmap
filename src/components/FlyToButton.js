import { React, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-easybutton';

const FlyToButton = function () {
  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line new-cap
    const buttonIcon = renderToString(<FontAwesomeIcon icon={faLocationArrow} />);
    const button = L.easyButton(buttonIcon, () => {
      map.locate().on('locationfound', (e) => {
        map.flyTo(e.latlng, 12);
      });
    });

    map.addControl(button);

    return () => map.removeControl(button);
  }, []);

  return null;
};

export default FlyToButton;
