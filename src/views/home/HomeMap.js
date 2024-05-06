import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

export const addressPoints = [
  [-23.074212, 29.760491, '571'],
  [-29.201315, 26.24207, '486'],
  [-25.802356, 28.258748, '807']
];

const customIcon = new L.Icon({
  iconUrl: require('./location.svg').default,
  iconSize: new L.Point(40, 47)
});

const HomeMap = () => {
  return (
    <MapContainer
      style={{ height: '500px' }}
      center={[-30.5595, 22.9375]}
      zoom={6}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {addressPoints.map((address, index) => (
          <Marker
            key={index}
            position={[address[0], address[1]]}
            title={address[2]}
            icon={customIcon}></Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
export default HomeMap;
