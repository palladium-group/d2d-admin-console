import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { gridSpacing } from '../../store/constant';
import MainCard from '../../ui-component/cards/MainCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import DispatchesYoY from './DispatchesYoY';
import useKeyCloakAuth from '../../hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../api/d2d-api';

const RunDeckInfo = () => {
  const theme = useTheme();
  const color = theme.palette.error.main;
  const IconPrimary = ArrowDownwardIcon;
  const primaryIcon =
    ArrowDownwardIcon !== undefined ? (
      <IconPrimary fontSize="large" sx={{ width: 20, height: 20, color }} />
    ) : null;
  const secondary = '8% less Last 3 Months';
  const greyColor = grey[600];

  const leftColumnRef = useRef(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState(300);
  const [numberOfFacilities, setNumberOfFacilities] = useState(0);
  const [recentQuarterCount, setRecentQuarterCount] = useState(0);
  const [monthlyPercent, setMonthlyPercent] = useState(0);
  const [quarterPercent, setQuarterPercent] = useState(0);

  const user = useKeyCloakAuth();
  const { data: { data = [] } = {}, isLoading } = useQuery({
    queryKey: ['getDashboardSummary', user.OrgUnit, user.OrgUnitValue],
    queryFn: async (queryKey) => {
      const data = await getDashboardSummary(queryKey);
      return data;
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });

  useEffect(() => {
    if (leftColumnRef.current) {
      setLeftColumnHeight(leftColumnRef.current.offsetHeight);
    }

    if (data) {
      setNumberOfFacilities(data.expected);
      setRecentQuarterCount(data.recentQuarterCount);
      const quarter = Number(
        (data.recentQuarterCount / data.expected) * 100
      ).toFixed(1);
      const monthly = Number(
        (data.recentMonthCount / data.expected) * 100
      ).toFixed(1);
      setMonthlyPercent(monthly);
      setQuarterPercent(quarter);
    }
  }, [leftColumnRef, data]);

  return (
    <Container>
      <Box display="flex" height="100%">
        <Grid container spacing={gridSpacing} style={{ flexGrow: 1 }}>
          <Grid
            item
            md={3}
            style={{ display: 'flex', flexDirection: 'column' }}
            ref={leftColumnRef}
          >
            <Grid container spacing={gridSpacing} style={{ flexGrow: 1 }}>
              <Grid item md={12} style={{ flexGrow: 1, display: 'flex' }}>
                <MainCard
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {isLoading ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid
                      container
                      justifyContent="space-between"
                      direction="column"
                      alignItems="left"
                      sx={{ flexGrow: 1 }}
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
                      <Grid item sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={3}
                          sx={{ my: 1.75, mx: 'auto' }}
                        >
                          {primaryIcon}
                          <Typography variant="h3">
                            {quarterPercent}%
                          </Typography>
                          <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                          <Typography variant="h3">
                            {recentQuarterCount}/{numberOfFacilities}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="textSecondary">
                          {secondary}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </MainCard>
              </Grid>
              <Grid item md={12} style={{ flexGrow: 1, display: 'flex' }}>
                <MainCard
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {isLoading ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid
                      container
                      justifyContent="space-between"
                      direction="column"
                      alignItems="left"
                      sx={{ flexGrow: 1 }}
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
                      <Grid item sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={3}
                          sx={{ my: 1.75, mx: 'auto' }}
                        >
                          {primaryIcon}
                          <Typography variant="h3">
                            {monthlyPercent}%
                          </Typography>
                          <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                          <Typography variant="h3">
                            {recentQuarterCount}/{numberOfFacilities}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="textSecondary">
                          {secondary}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            md={9}
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: leftColumnHeight
            }}
          >
            <MainCard
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: leftColumnHeight
              }}
            >
              <DispatchesYoY height={leftColumnHeight} data={data} />
            </MainCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RunDeckInfo;
