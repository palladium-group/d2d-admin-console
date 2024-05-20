import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { gridSpacing } from '../../store/constant';
import MainCard from '../../ui-component/cards/MainCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const RunDeckInfo = () => {
  const theme = useTheme();
  const color = theme.palette.error.main;
  const IconPrimary = ArrowDownwardIcon;
  const primaryIcon =
    ArrowDownwardIcon !== undefined ? (
      <IconPrimary fontSize="large" sx={{ width: 20, height: 20, color }} />
    ) : null;
  const primary = 76;
  const secondary = '8% less Last 3 Months';
  const greyColor = grey[600];

  return (
    <Container maxWidth={false}>
      <Grid container spacing={gridSpacing}>
        <Grid item md={3}>
          <Grid container spacing={gridSpacing}>
            <Grid item md={12}>
              <MainCard>
                <Grid
                  container
                  justifyContent="space-between"
                  direction="column"
                  alignItems="left"
                >
                  <Grid item sm={12}>
                    <Typography variant="h5" color="inherit">
                      Facilities with Recent Dispatches
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={greyColor}
                      gutterBottom
                    >
                      End of March
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      // sx={{ my: 1.75, mx: 'auto' }}
                    >
                      {primaryIcon}
                      <Typography variant="h3">{primary}%</Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <Typography variant="h3">144/220</Typography>
                    </Stack>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" color="textSecondary">
                      {secondary}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item md={12}>
              <MainCard>
                <Grid
                  container
                  justifyContent="space-between"
                  direction="column"
                  alignItems="left"
                >
                  <Grid item sm={12}>
                    <Typography variant="h5" color="inherit" gutterBottom>
                      Facilities with Recent Dispatches
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={greyColor}
                      gutterBottom
                    >
                      End of April
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ my: 1.75, mx: 'auto' }}
                    >
                      {primaryIcon}
                      <Typography variant="h3">{primary}%</Typography>
                    </Stack>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" color="textSecondary">
                      {secondary}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9}></Grid>
      </Grid>
    </Container>
  );
};
export default RunDeckInfo;
