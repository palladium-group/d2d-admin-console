import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { gridSpacing } from '../../store/constant';
import MainCard from '../../ui-component/cards/MainCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import DispatchesYoY from './DispatchesYoY';

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
      <Grid
        container
        spacing={gridSpacing}
        style={{ display: 'flex', alignItems: 'stretch' }}
      >
        <Grid item md={3} style={{ display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={gridSpacing} style={{ flex: 1 }}>
            <Grid item md={12} style={{ flex: 1 }}>
              <MainCard sx={{ height: '100%' }}>
                <Grid
                  container
                  justifyContent="space-between"
                  direction="column"
                  alignItems="left"
                  style={{ height: '100%' }}
                >
                  <Grid item>
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
                  <Grid item>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={3}
                      sx={{ my: 1.75, mx: 'auto' }}
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
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      {secondary}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item md={12} style={{ flex: 1 }}>
              <MainCard sx={{ height: '100%' }}>
                <Grid
                  container
                  justifyContent="space-between"
                  direction="column"
                  alignItems="left"
                  style={{ height: '100%' }}
                >
                  <Grid item>
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
                  <Grid item>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={3}
                      sx={{ my: 1.75, mx: 'auto' }}
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
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      {secondary}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={9}
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <Grid container spacing={gridSpacing} style={{ flex: 1 }}>
            <Grid item md={12} style={{ flex: 1 }}>
              <MainCard sx={{ height: '100%' }}>
                <DispatchesYoY />
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RunDeckInfo;
