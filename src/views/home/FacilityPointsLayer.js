import MarkerClusterGroup from 'react-leaflet-cluster';
import { Marker, Popup } from 'react-leaflet';
import FacilityDetail from './FacilityDetail';
import L from 'leaflet';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { getFacilityByOrgUnit } from '../../api/d2d-api';
import './MarkerCluster.css';
import { useTheme } from '@mui/material/styles';

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true)
  });
};

const StyledPop = styled(Popup)`
  margin: 0;
  padding: 0;
`;

const FacilityPointsLayer = ({ user, handleOpenDialog }) => {
  const theme = useTheme();
  const customIcon = (recency) =>
    new L.divIcon({
      //iconUrl: require('./location.svg').default,
      iconSize: [40, 47], //new L.Point(40, 47),
      html: createSVGIcon(recency),
      iconAnchor: [16, 16]
    });

  const createSVGIcon = (recency) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="32" height="32">
  <g>
    <g>
      <g>
        <path style="fill:#C9DFF7;" d="M256,512c-65.972,0-128.206-8.8-175.238-24.779C14.012,464.543,0,435.495,0,415.121     c0-26.579,23.749-45.205,43.671-56.149c7.263-3.989,16.38-1.336,20.369,5.924c3.989,7.261,1.337,16.381-5.924,20.369     C40.248,395.081,30,405.963,30,415.121c0,11.201,15.87,28.561,60.413,43.694C134.418,473.767,193.225,482,256,482     s121.582-8.233,165.587-23.185C466.13,443.683,482,426.322,482,415.121c0-9.158-10.248-20.04-28.116-29.857     c-7.261-3.988-9.913-13.108-5.924-20.369c3.987-7.26,13.106-9.913,20.369-5.924C488.251,369.916,512,388.542,512,415.121     c0,20.374-14.012,49.422-80.762,72.1C384.206,503.2,321.972,512,256,512z"/>
        <path style="fill:#AECEF2;" d="M468.329,358.972c-7.263-3.989-16.382-1.336-20.369,5.924c-3.989,7.261-1.337,16.381,5.924,20.369     C471.752,395.081,482,405.963,482,415.121c0,11.201-15.87,28.561-60.413,43.694C377.582,473.767,318.775,482,256,482     c-0.001,0-0.003,0-0.004,0v30c0.001,0,0.003,0,0.004,0c65.972,0,128.206-8.8,175.238-24.779     c66.75-22.678,80.762-51.726,80.762-72.1C512,388.542,488.251,369.916,468.329,358.972z"/>
      </g>
      <g>
        <path style="fill:#C9DFF7;" d="M256,450.47c-42.579,0-82.798-4.737-113.248-13.34c-37.253-10.523-56.142-25.757-56.142-45.275     c0-19.519,18.889-34.751,56.142-45.274c30.45-8.603,70.669-13.34,113.248-13.34s82.798,4.737,113.248,13.34     c37.253,10.523,56.142,25.756,56.142,45.274c0,19.518-18.889,34.752-56.142,45.275C338.798,445.732,298.579,450.47,256,450.47z      M116.864,391.854c2.059,3.023,12.074,10.884,39.49,17.866c27.213,6.932,62.602,10.749,99.645,10.749s72.433-3.817,99.646-10.749     c27.416-6.982,37.431-14.844,39.49-17.866c-2.06-3.022-12.075-10.883-39.491-17.866c-27.213-6.931-62.601-10.748-99.645-10.748     s-72.432,3.817-99.645,10.748C128.939,380.972,118.924,388.832,116.864,391.854z M395.478,392.475h0.011H395.478z"/>
        <path style="fill:#AECEF2;" d="M369.248,346.58c-30.45-8.603-70.669-13.34-113.248-13.34c-0.001,0-0.003,0-0.004,0v30     c0.001,0,0.003,0,0.004,0c37.044,0,72.432,3.817,99.645,10.748c27.416,6.983,37.432,14.844,39.491,17.866     c-2.06,3.023-12.074,10.884-39.49,17.866c-27.213,6.932-62.602,10.749-99.646,10.749c-0.001,0-0.003,0-0.004,0v30     c0.001,0,0.003,0,0.004,0c42.579,0,82.798-4.737,113.248-13.34c37.253-10.523,56.142-25.757,56.142-45.275     C425.39,372.336,406.501,357.103,369.248,346.58z"/>
      </g>
    </g>
    <g>
      <path style="fill:${getColor(
        recency
      )};" d="M256,0c-76.888,0-139.44,62.552-139.44,139.439c0,47.891,58.183,153.137,106.992,232.994    c6.966,11.398,19.096,18.201,32.448,18.201c13.353,0,25.482-6.804,32.448-18.201c48.81-79.857,106.992-185.103,106.992-232.994    C395.44,62.552,332.888,0,256,0z M256,185.911c-30.904,0-56.047-25.142-56.047-56.046c0-30.903,25.143-56.045,56.047-56.045    s56.047,25.142,56.047,56.045C312.047,160.77,286.904,185.911,256,185.911z"/>
      <path style="fill:${getColor(
        recency
      )};" d="M256,0c-0.001,0-0.003,0-0.004,0v73.82c0.001,0,0.003,0,0.004,0    c30.904,0,56.047,25.142,56.047,56.045c0,30.904-25.143,56.046-56.047,56.046c-0.001,0-0.003,0-0.004,0v204.723    c0.001,0,0.003,0,0.004,0c13.353,0,25.482-6.804,32.448-18.201c48.81-79.857,106.992-185.103,106.992-232.994    C395.44,62.552,332.888,0,256,0z"/>
    </g>
  </g>
  </svg>
  `;
  };

  const getColor = (d) => {
    if (d) {
      return theme.palette.heatmap.one;
    } else return theme.palette.heatmap.five;
  };

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

  return (
    data && (
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        iconCreateFunction={createClusterCustomIcon}
      >
        {data
          ?.filter((row) => row.expectedToReport)
          .map((address, index) =>
            address.latitude !== null && address.longitude !== null ? (
              <Marker
                key={index}
                position={[address.latitude, address.longitude]}
                title={address.facilityName}
                icon={customIcon(address.isRecentQuarter)}
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
    )
  );
};
export default FacilityPointsLayer;
