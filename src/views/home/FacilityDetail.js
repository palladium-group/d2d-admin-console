import { useQuery } from '@tanstack/react-query';
import { getFacilityDetails } from '../../api/d2d-api';
import { Grid, Link } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import MainCard from '../../ui-component/cards/MainCard';

const FacilityDetail = ({ facilityName, facilityId, handleOpenDialog }) => {
  const { data: { data = [] } = {} } = useQuery({
    queryKey: ['getFacilityDetails', facilityId],
    queryFn: async (queryKey) => {
      const data = await getFacilityDetails(queryKey);
      return data;
    },
    enabled: !!facilityId
  });

  const handleDetailsClick = () => {
    handleOpenDialog(facilityId);
  };

  if (data) {
    return (
      <MainCard title={facilityName}>
        <Grid container spacing={1}>
          <Grid item md={12}>
            <strong>Patient Count:</strong> {data?.facility?.patients}
          </Grid>
          <Grid item md={12}>
            <strong>Last Visit Date: </strong>{' '}
            {data?.facility?.lastVisitDate
              ? format(new Date(data?.facility?.lastVisitDate), 'dd-MM-yyyy')
              : ''}
          </Grid>
          <Grid item md={12}>
            <strong>Recent For Quarterly Reporting: </strong>{' '}
            {data?.facility?.isRecentQuarter === 1 ? 'Yes' : 'No'}
          </Grid>
          <Grid item md={12}>
            <Link onClick={handleDetailsClick} style={{ cursor: 'pointer' }}>
              Details
            </Link>
          </Grid>
        </Grid>
      </MainCard>
    );
  }
};
export default FacilityDetail;
