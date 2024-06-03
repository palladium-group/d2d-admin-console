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
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import DispatchesYoY from './DispatchesYoY';
import useKeyCloakAuth from '../../hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getRecencyAsAtDate } from '../../api/d2d-api';
import { format } from 'date-fns';

const RunDeckInfo = () => {
  const theme = useTheme();
  const color = theme.palette.error.main;
  const greenColor = theme.palette.success.main;
  const IconRedPrimary = ArrowDownwardOutlinedIcon;
  const IconGreenPrimary = ArrowUpwardOutlinedIcon;
  const RedIcon =
    ArrowDownwardOutlinedIcon !== undefined ? (
      <IconRedPrimary fontSize="large" sx={{ width: 20, height: 20, color }} />
    ) : null;
  const GreenIcon =
    ArrowUpwardOutlinedIcon !== undefined ? (
      <IconGreenPrimary
        fontSize="large"
        sx={{ width: 20, height: 20, color: greenColor }}
      />
    ) : null;
  const greyColor = grey[600];

  const leftColumnRef = useRef(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState(300);
  const [numberOfFacilities, setNumberOfFacilities] = useState(0);
  const [recentQuarterCount, setRecentQuarterCount] = useState(0);
  const [recentMonthCount, setRecentMonthCount] = useState(0);
  const [monthlyPercent, setMonthlyPercent] = useState(0);
  const [quarterPercent, setQuarterPercent] = useState(0);
  const [quarterlyDifference, setQuarterlyDifference] = useState(0);
  const [monthlyDifference, setMonthlyDifference] = useState(0);
  const [lastQuarterDate, setLastQuarterDate] = useState();
  const [secondLastQuarterEndDate, setSecondLastQuarterEndDate] = useState();
  const [lastMonthDate, setLastMonthDate] = useState();

  const user = useKeyCloakAuth();
  const { data: { data = [] } = {}, isLoading } = useQuery({
    queryKey: ['getDashboardSummary', user.OrgUnit, user.OrgUnitValue],
    queryFn: async (queryKey) => {
      const data = await getDashboardSummary(queryKey);
      return data;
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });
  const { isLoading: isLoadingRecency, data: recencyData } = useQuery({
    queryKey: [
      'getRecencyAsAtDate',
      lastQuarterDate,
      user.OrgUnit,
      user.OrgUnitValue
    ],
    queryFn: async (queryKey) => {
      const data = await getRecencyAsAtDate(queryKey);
      return data;
    },
    enabled: !!lastQuarterDate && !!user.OrgUnit && !!user.OrgUnitValue
  });
  const {
    isLoading: isLoadingRecencySecondLastQuarter,
    data: recencyDataSecondLastQuarter
  } = useQuery({
    queryKey: [
      'getRecencyAsAtDate',
      secondLastQuarterEndDate,
      user.OrgUnit,
      user.OrgUnitValue
    ],
    queryFn: async (queryKey) => {
      const data = await getRecencyAsAtDate(queryKey);
      return data;
    },
    enabled: !!secondLastQuarterEndDate && !!user.OrgUnit && !!user.OrgUnitValue
  });
  const { isLoading: isLoadingRecencyMonth, data: recencyDataMonthly } =
    useQuery({
      queryKey: [
        'getRecencyAsAtDate',
        lastMonthDate,
        user.OrgUnit,
        user.OrgUnitValue
      ],
      queryFn: async (queryKey) => {
        const data = await getRecencyAsAtDate(queryKey);
        return data;
      },
      enabled: !!lastMonthDate && !!user.OrgUnit && !!user.OrgUnitValue
    });

  useEffect(() => {
    if (leftColumnRef.current) {
      setLeftColumnHeight(leftColumnRef.current.offsetHeight);
    }

    if (
      data &&
      !isLoadingRecency &&
      recencyData &&
      !isLoadingRecencyMonth &&
      recencyDataMonthly &&
      !isLoadingRecencySecondLastQuarter &&
      recencyDataSecondLastQuarter
    ) {
      setNumberOfFacilities(data.expected);
      setRecentQuarterCount(recencyData.data);
      const quarter = Number((recencyData.data / data.expected) * 100).toFixed(
        1
      );
      setRecentMonthCount(recencyDataMonthly.data);
      const monthly = Number(
        (recencyDataMonthly.data / data.expected) * 100
      ).toFixed(1);
      const secondLastQuarter = Number(
        (recencyDataSecondLastQuarter.data / data.expected) * 100
      ).toFixed(1);
      setMonthlyPercent(monthly);
      setQuarterPercent(quarter);
      setMonthlyDifference(quarter - monthly);
      setQuarterlyDifference(secondLastQuarter - quarter);
    }
    const now = new Date();
    const lastQuarterEndDate = getLastQuarterEndDate(now);
    const lastDate = new Date(lastQuarterEndDate);
    const secondLastQuarterEndDate = getLastQuarterEndDate(new Date(lastDate));
    setLastQuarterDate(lastQuarterEndDate);
    setLastMonthDate(getLastDayOfLastMonth());
    setSecondLastQuarterEndDate(secondLastQuarterEndDate);
  }, [
    leftColumnRef,
    data,
    isLoadingRecency,
    recencyData,
    isLoadingRecencyMonth,
    recencyDataMonthly,
    isLoadingRecencySecondLastQuarter,
    recencyDataSecondLastQuarter
  ]);

  function getLastQuarterEndDate(date = new Date()) {
    const currentMonth = date.getMonth(); // getMonth() returns 0-11
    let lastQuarterEndDate;

    if (currentMonth >= 0 && currentMonth <= 2) {
      // Q1: Jan-Mar, last quarter Q4 of the previous year
      lastQuarterEndDate = new Date(date.getFullYear() - 1, 11, 31); // December 31 of last year
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      // Q2: Apr-Jun, last quarter Q1
      lastQuarterEndDate = new Date(date.getFullYear(), 2, 31); // March 31 of this year
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      // Q3: Jul-Sep, last quarter Q2
      lastQuarterEndDate = new Date(date.getFullYear(), 5, 30); // June 30 of this year
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      // Q4: Oct-Dec, last quarter Q3
      lastQuarterEndDate = new Date(date.getFullYear(), 8, 30); // September 30 of this year
    }
    return format(new Date(lastQuarterEndDate), 'yyyy-MM-dd');
  }

  function getLastDayOfLastMonth() {
    const now = new Date();
    // Set the date to the first day of the current month
    const firstDayOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    // Subtract one day to get the last day of the previous month
    const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth - 1);

    return format(new Date(lastDayOfLastMonth), 'yyyy-MM-dd');
  }

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
                          End of Last Quarter
                        </Typography>
                      </Grid>
                      <Grid item sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={3}
                          sx={{ my: 1.75, mx: 'auto' }}
                        >
                          {quarterlyDifference > 0 && RedIcon}
                          {quarterlyDifference <= 0 && GreenIcon}
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
                          {quarterlyDifference > 0 &&
                            `${quarterlyDifference}% less than Last Quarter`}
                          {quarterlyDifference <= 0 &&
                            `${quarterlyDifference}% more than Last Quarter`}
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
                          End of {format(new Date(lastMonthDate), 'MMM')}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={3}
                          sx={{ my: 1.75, mx: 'auto' }}
                        >
                          {monthlyDifference > 0 && RedIcon}
                          {monthlyDifference <= 0 && GreenIcon}
                          <Typography variant="h3">
                            {monthlyPercent}%
                          </Typography>
                          <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                          <Typography variant="h3">
                            {recentMonthCount}/{numberOfFacilities}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="textSecondary">
                          {monthlyDifference > 0 &&
                            `${monthlyDifference}% less than Last 3 months`}
                          {monthlyDifference < 0 &&
                            `${monthlyDifference}% more than Last 3 months`}
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
