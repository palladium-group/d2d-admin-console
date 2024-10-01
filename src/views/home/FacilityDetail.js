import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getFacilityDetails } from '../../api/d2d-api';
import { Grid, Link, Typography } from '@mui/material';
import { format, startOfToday, differenceInDays } from 'date-fns';
import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import { Box } from '@mui/system';
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone';
import Chip from 'ui-component/extended/Chip';
import useKeyCloakAuth from 'hooks/useKeyCloakAuth';

const FacilityDetail = ({ facilityName, facilityId, handleOpenDialog }) => {
  const [dispatchAge, setDispatchAge] = useState(0);
  const user = useKeyCloakAuth();
  const { data: { data = [] } = {} } = useQuery({
    queryKey: ['getFacilityDetails', facilityId, user.token],
    queryFn: async (queryKey) => {
      const data = await getFacilityDetails(queryKey);
      return data;
    },
    enabled: !!facilityId
  });

  const handleDetailsClick = () => {
    handleOpenDialog(facilityId);
  };

  const getColorByAge = (age) => {
    if (age < 31) return 'success';
    return 'primary';
  };

  useEffect(() => {
    if (data?.facility?.lastVisitDate) {
      const calcDaysBetween = differenceInDays(
        startOfToday(),
        new Date(data?.facility?.lastVisitDate)
      );
      setDispatchAge(calcDaysBetween);
    }
  }, [data]);

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
            <strong>Dispatch Age: </strong>{' '}
            <Chip
              label={dispatchAge + ' days'}
              chipcolor={getColorByAge(dispatchAge)}
            />
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
