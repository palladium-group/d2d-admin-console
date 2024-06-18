import React, { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import useKeyCloakAuth from '../../hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getFacilityByOrgUnit } from '../../api/d2d-api';
import FacilityDetail from './FacilityDetail';
import { Dialog, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import FacilityDetails from '../pages/facility/FacilityDetails';
import SubCard from 'ui-component/cards/SubCard';
import { Container } from '@mui/system';

const customIcon = new L.Icon({
  iconUrl: require('./location.svg').default,
  iconSize: new L.Point(40, 47)
});

const StyledPop = styled(Popup)`
  margin: 0;
  padding: 0;
`;

const HomeMap = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [facilityId, setFacilityId] = useState();

  const user = useKeyCloakAuth();
  const { data: { data = [] } = {} } = useQuery({
    queryKey: [
      'getFacilityByOrgUnit',
      user.OrgUnit,
      user.OrgUnitValue,
      user.token
    ],
    queryFn: async (queryKey) => {
      const data = await getFacilityByOrgUnit(queryKey);
      return data;
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });

  const handleOpenDialog = (v_FacilityId) => {
    setOpenDialog(true);
    setFacilityId(v_FacilityId);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <SubCard title="Recency Distribution">
        <MapContainer
          style={{ height: '500px', borderRadius: '5px' }}
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
                  <StyledPop>
                    <FacilityDetail
                      facilityName={address.facilityName}
                      facilityId={address.facilityId}
                      handleOpenDialog={handleOpenDialog}
                    />
                  </StyledPop>
                </Marker>
              ) : null
            )}
          </MarkerClusterGroup>
        </MapContainer>
        <Dialog
          open={openDialog}
          fullWidth={true}
          onClose={handleClose}
          maxWidth="lg"
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseFullscreenOutlinedIcon />
          </IconButton>
          <FacilityDetails facilityId={facilityId} />
        </Dialog>
      </SubCard>
    </Container>
  );
};
export default HomeMap;
