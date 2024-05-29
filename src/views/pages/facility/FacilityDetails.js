import React from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { Grid } from '@mui/material';

const FacilityDetails = ({ facilityId }) => {
  console.log(facilityId);
  return (
    <React.Fragment>
      <MainCard title="gp Hillbrow CHC">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <MainCard title="Most Recent Dispatch"></MainCard>
          </Grid>
          <Grid item xs={9}>
            <MainCard title="Record Growth Over Time"></MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </React.Fragment>
  );
};
export default FacilityDetails;
