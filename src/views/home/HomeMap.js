import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './MarkerCluster.css';
import useKeyCloakAuth from '../../hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getSubDistricts } from '../../api/d2d-api';

import {
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import FacilityDetails from '../pages/facility/FacilityDetails';
import SubCard from 'ui-component/cards/SubCard';
import { Container, Box } from '@mui/system';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import FacilityPointsLayer from './FacilityPointsLayer';
import ReactDOMServer from 'react-dom/server';
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';

const HomeMap = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [facilityId, setFacilityId] = useState();
  const [geojsonData, setGeojsonData] = useState(null);
  //const [map, setMap] = useState(null);

  const user = useKeyCloakAuth();
  const theme = useTheme();

  const {
    data: { data = [] } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getSubDistricts', user.token],
    queryFn: async (queryKey) => {
      const data = await getSubDistricts(queryKey);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    enabled: !!user.token
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      //console.log(data);
      const geojson = {
        type: 'FeatureCollection',
        features: data
          .filter((row) => row.geoJson)
          .map((row) =>
            JSON.parse(row.geoJson.substring(1, row.geoJson.length - 1))
          )
      };
      //console.log(geojson);
      setGeojsonData(geojson);
    }
  }, [isLoading, data, isError]);

  const getColor = (d) => {
    if (d > 0.95) {
      return theme.palette.heatmap.one;
    }
    if (d > 0.85) {
      return theme.palette.heatmap.two;
    }
    if (d > 0.65) {
      return theme.palette.heatmap.three;
    }
    if (d > 0.45) {
      return theme.palette.heatmap.four;
    }
    return theme.palette.heatmap.five;
  };

  const setColor = ({ properties }) => {
    //console.log(properties);
    return {
      weight: 0.5,
      color: getColor(properties.recent_ratio),
      fillOpacity: 0.3
    };
  };

  const handleOpenDialog = (v_FacilityId) => {
    setOpenDialog(true);
    setFacilityId(v_FacilityId);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.short_name) {
      const popupContent = ReactDOMServer.renderToString(
        <ThemeProvider theme={theme}>
          <SubCard
            title={
              <Box display="flex" alignItems="center">
                <MapTwoToneIcon fontSize="small" />
                <Typography variant="body" ml={1}>
                  {feature.properties.short_name}
                </Typography>
              </Box>
            }
          >
            <Grid container>
              <Grid item md={12}>
                <Typography variant="body2">
                  {feature.properties.recent_sum}
                  {'/'}
                  {feature.properties.facility_count}
                  {' facilities'}
                  <strong>
                    {' ('}
                    {(feature.properties.recent_ratio * 100).toFixed(1)}
                    {'%) '}
                  </strong>
                  {'have submitted recent dispatches'}
                </Typography>
              </Grid>
            </Grid>
          </SubCard>
        </ThemeProvider>
      );
      layer.bindPopup(popupContent);
    }
  };

  const Legend = () => {
    const map = useMap();

    useEffect(() => {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
          <i style="background: ${theme.palette.heatmap.one}"></i><span>95-100%</span><br>
          <i style="background: ${theme.palette.heatmap.two}"></i><span>85-94%</span><br>
          <i style="background: ${theme.palette.heatmap.three}"></i><span>65-84%</span><br>
          <i style="background: ${theme.palette.heatmap.four}"></i><span>45-64%</span><br>
          <i style="background: ${theme.palette.heatmap.five}"></i><span>0-44%</span><br>
        `;
        return div;
      };

      legend.addTo(map);

      return () => {
        legend.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <Container>
      <SubCard
        title={
          <Box display="flex" alignItems="center">
            <MapTwoToneIcon fontSize="small" />
            <Typography variant="h5" ml={1}>
              Recency Distribution
            </Typography>
          </Box>
        }
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress />
          </Box>
        ) : (
          <MapContainer
            style={{
              height: '666px',
              borderRadius: '8px'
            }}
            center={[-28.8595, 24.4375]}
            zoom={6}
            scrollWheelZoom={true}
            //whenReady={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png"
              url={
                theme.palette.mode === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              }
            />
            {geojsonData && (
              <GeoJSON
                data={geojsonData}
                style={setColor}
                onEachFeature={onEachFeature}
              />
            )}
            <FacilityPointsLayer
              user={user}
              handleOpenDialog={handleOpenDialog}
            />
            <Legend />
          </MapContainer>
        )}
        <Dialog
          open={openDialog}
          fullWidth={true}
          onClose={handleClose}
          maxWidth="lg"
          sx={{
            '.MuiPaper-root': {
              padding: 0,
              overflow: 'auto'
            }
          }}
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
