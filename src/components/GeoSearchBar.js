import { useEffect } from 'react';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';

const GeoSearchBar = function () {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      showMarker: false,
      searchLabel: 'Chercher une adresse',
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default GeoSearchBar;
