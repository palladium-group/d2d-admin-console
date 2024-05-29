import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import useKeyCloakAuth from '../../hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getFacilityByOrgUnit } from '../../api/d2d-api';
import FacilityDetail from './FacilityDetail';
import { Container } from '@mui/material';

const customIcon = new L.Icon({
  iconUrl: require('./location.svg').default,
  iconSize: new L.Point(40, 47)
});

const HomeMap = () => {
  const user = useKeyCloakAuth();
  const { data: { data = [] } = {} } = useQuery({
    queryKey: ['getFacilityByOrgUnit', user.OrgUnit, user.OrgUnitValue],
    queryFn: async (queryKey) => {
      const data = await getFacilityByOrgUnit(queryKey);
      return data;
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });

  return (
    <Container>
      <MapContainer
        style={{ height: '500px' }}
        center={[-30.5595, 22.9375]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {data.map((address, index) =>
            address.latitude !== null && address.longitude !== null ? (
              <Marker
                key={index}
                position={[address.latitude, address.longitude]}
                title={address.facilityName}
                icon={customIcon}
              >
                <Popup>
                  <FacilityDetail
                    facilityName={address.facilityName}
                    facilityId={address.facilityId}
                  />
                </Popup>
              </Marker>
            ) : null
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </Container>
  );
};
export default HomeMap;
