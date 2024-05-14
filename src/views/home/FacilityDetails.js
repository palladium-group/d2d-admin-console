import { useQuery } from '@tanstack/react-query';
import { getFacilityDetails } from '../../api/d2d-api';
import { Grid } from '@mui/material';
import { format } from 'date-fns';

const FacilityDetails = ({ facilityId }) => {
  const { data: { data = [] } = {} } = useQuery({
    queryKey: ['getFacilityDetails', facilityId],
    queryFn: async (queryKey) => {
      const data = await getFacilityDetails(queryKey);
      return data;
    },
    enabled: !!facilityId
  });
  if (data) {
    return (
      <Grid container spacing={1}>
        <Grid item md={12}>
          Patient Count: {data?.facility?.patients}
        </Grid>
        <Grid item md={12}>
          Last Visit Date:{' '}
          {data?.facility?.lastVisitDate
            ? format(new Date(data?.facility?.lastVisitDate), 'dd-MM-yyyy')
            : ''}
        </Grid>
      </Grid>
    );
  }
};
export default FacilityDetails;
