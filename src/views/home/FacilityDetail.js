import { useQuery } from '@tanstack/react-query';
import { getFacilityDetails } from '../../api/d2d-api';
import { Grid, Link, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import { Box } from '@mui/system';
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone';
import Chip from 'ui-component/extended/Chip';
import useKeyCloakAuth from 'hooks/useKeyCloakAuth';

const FacilityDetail = ({ facilityName, facilityId, handleOpenDialog }) => {
  const user = useKeyCloakAuth();
  const { data: { data = [] } = {} } = useQuery({
    queryKey: ['getFacilityDetails', facilityId, user.token],
    queryFn: async (queryKey) => {
      const data = await getFacilityDetails(queryKey);
      console.log(data);
      return data;
    },
    enabled: !!facilityId
  });

  const handleDetailsClick = () => {
    handleOpenDialog(facilityId);
  };

  if (data) {
    return (
      <SubCard
        title={
          <Box display="flex" alignItems="center">
            <LocalHospitalTwoToneIcon fontSize="small" />
            <Typography variant="body" ml={1}>
              {facilityName}
            </Typography>
          </Box>
        }
      >
        <Grid container spacing={1}>
          <Grid item md={12}>
            <strong>Patient Count:</strong>{' '}
            {Number(data?.facility?.patients).toLocaleString()}
          </Grid>
          <Grid item md={12}>
            <strong>Last Visit Date: </strong>{' '}
            {data?.facility?.lastVisitDate
              ? format(new Date(data?.facility?.lastVisitDate), 'do MMMM yyyy')
              : ''}
          </Grid>
          <Grid item md={12}>
            <strong>Recent: </strong>{' '}
            {data?.facility?.isRecentQuarter === 1 ? (
              <Chip label="Yes" chipcolor="success" />
            ) : (
              <Chip label="No" chipcolor="error" />
            )}
          </Grid>
          <Grid item md={12}>
            <Link
              onClick={handleDetailsClick}
              style={{ cursor: 'pointer' }}
              variant="overline"
            >
              More
            </Link>
          </Grid>
        </Grid>
      </SubCard>
    );
  }
};
export default FacilityDetail;
