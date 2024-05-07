import { Container, Grid } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DispatchTable from './DispatchTable';

const DispatchSection = () => {
  return (
    <Container maxWidth={false}>
      <Grid container>
        <Grid item md={12} sm={12} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DispatchTable />;
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  );
};
export default DispatchSection;
