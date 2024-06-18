import React, { useEffect, useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import {
  Box,
  CircularProgress,
  Grid,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@mui/lab';
import { styled } from '@mui/material/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useQuery } from '@tanstack/react-query';
import { getFacilityDetails } from '../../../api/d2d-api';
import { format } from 'date-fns';
import SubCard from 'ui-component/cards/SubCard';
import { FolderZipTwoTone } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import { red } from '@mui/material/colors';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone';
import useKeyCloakAuth from 'hooks/useKeyCloakAuth';

const CustomTimeline = styled(Timeline)({
  padding: 0,
  margin: 0
});

const CustomTimelineItem = styled(TimelineItem)({
  '&:before': {
    display: 'none'
  }
});

const CustomTimelineOppositeContent = styled(Box)({
  flex: 0,
  padding: 0
});

const FacilityDetails = ({ facilityId }) => {
  const [facilityData, setFacilityData] = useState();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  const user = useKeyCloakAuth();

  const {
    data: { data = {} } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getFacilityDetails', facilityId, user.token],
    queryFn: async (queryKey) => {
      return await getFacilityDetails(queryKey);
    },
    enabled: !!facilityId
  });

  /*  const createZones = (val = []) => {
    const zones = [];
    let currentZone = { value: 0, dashStyle: 'Solid' };

    val.forEach((point, index) => {
      if (point === null) {
        currentZone = { value: index, dashStyle: 'Dot' };
        zones.push(currentZone);
        currentZone = { value: index + 1, dashStyle: 'Dot' };
        zones.push(currentZone);
      }
    });

    zones.push({ value: val.length - 1 });
    return zones;
  }; */

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setFacilityData(data);

      const seriesData = [];
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const category = [];
      let startYear;
      if (currentMonth < 11) {
        const startMonth = 11 - currentMonth;
        for (let i = startMonth; i <= 11; i++) {
          startYear = currentYear - 1;
          category.push(monthNames[i] + ' ' + startYear);
        }
        for (let j = 0; j <= currentMonth; j++) {
          category.push(monthNames[j] + ' ' + currentYear);
        }
      } else {
        for (let j = 0; j <= currentMonth; j++) {
          category.push(monthNames[j] + ' ' + currentYear);
        }
      }

      const visits = [];
      const patients = [];
      for (let i = 0; i < 12; i++) {
        const res = data.history.filter(
          (obj) => formatDateToMonthYear(obj.date) === category[i]
        );
        if (res.length > 0) {
          visits.push(res[0].visits);
          patients.push(res[0].patients);
        } else {
          visits.push(null);
          patients.push(null);
        }
      }
      seriesData.push(
        {
          name: 'Visits',
          data: visits,
          connectNulls: true,
          zoneAxis: 'x'
          //zones: createZones(visits)
        },
        {
          name: 'Patients',
          data: patients,
          connectNulls: true,
          zoneAxis: 'x',
          //zones: createZones(patients),
          yAxis: 1
        }
      );
      setSeries(seriesData);
      setCategories(category);
    }
    // eslint-disable-next-line
  }, [data, isLoading, isError, monthNames]);
  const [options, setOptions] = useState({});

  function formatDateToMonthYear(dateStr) {
    const date = new Date(dateStr);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  useEffect(() => {
    setOptions({
      chart: {
        type: 'spline'
      },
      title: {
        text: '',
        align: 'left'
      },

      subtitle: {
        text: '',
        align: 'left'
      },

      yAxis: [
        {
          title: {
            text: 'Visits'
          }
          //type: 'logarithmic',
          //minorTickInterval: 0.1
        },
        {
          opposite: true,
          title: {
            text: 'Patients'
          }
          //type: 'logarithmic',
          //minorTickInterval: 0.1
        }
      ],

      xAxis: {
        accessibility: {
          rangeDescription: 'Months'
        },
        categories: categories
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          }
        },
        spline: {
          dataLabels: {
            enabled: true
          }
          //enableMouseTracking: false
        }
      },
      series: series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }
        ]
      }
    });
  }, [categories, series]);

  const TruncatedName = ({ name }) => {
    return (
      <Tooltip title={name}>
        <span
          style={{
            display: 'inline-block',
            maxWidth: '150px', // Adjust the width as needed
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'blue'
          }}
        >
          {name}
        </span>
      </Tooltip>
    );
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <MainCard
          title={
            <Box display="flex" alignItems="center">
              <LocalHospitalTwoToneIcon />
              <Typography variant="body" ml={1}>
                {facilityData?.facility?.facilityName}
              </Typography>
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <SubCard
                title={
                  <Box display="flex" alignItems="center">
                    <FolderZipTwoTone />
                    <Typography variant="h5" ml={1}>
                      Most Recent Dispatch
                    </Typography>
                  </Box>
                }
              >
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container>
                      <Grid item md={5}>
                        <Typography variant="h5">Last Submitted On:</Typography>
                      </Grid>
                      <Grid item md={7}>
                        {facilityData?.facility?.dispatch?.dateCreated &&
                          format(
                            new Date(
                              facilityData?.facility?.dispatch?.dateCreated
                            ),
                            "d MMM yyyy hh:mmaaaaa'm'"
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={5}>
                        <Typography variant="h5">Submitted By:</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        {facilityData?.facility?.dispatch?.creator}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={5}>
                        <Typography variant="h5">Status:</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        {facilityData?.facility?.manifest?.isAccepted && (
                          <Box display="flex" alignItems="center">
                            <CheckCircle sx={{ color: 'green' }} />
                            <Typography variant="h5" color="green" ml={1}>
                              SUCCESS
                            </Typography>
                          </Box>
                        )}
                        {!facilityData?.facility?.manifest?.isAccepted && (
                          <Box display="flex" alignItems="center">
                            <ErrorIcon sx={{ color: 'red' }} />
                            <Typography variant="h5" color="red" ml={1}>
                              REJECTED
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    {!facilityData?.facility?.manifest?.isAccepted && (
                      <Grid container>
                        <Grid item xs={5}>
                          &nbsp;
                        </Grid>
                        <Grid item xs={7}>
                          <Typography variant="subtitle2" sx={{ color: 'red' }}>
                            {
                              facilityData?.facility?.manifest
                                ?.rejectReasonLongDescription
                            }
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography variant="h5">File Name:</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={7}
                        style={{
                          overflowX: 'auto',
                          whiteSpace: 'nowrap',
                          color: 'blue'
                        }}
                      >
                        <TruncatedName
                          name={facilityData?.facility?.dispatch?.name}
                        />
                        <Typography variant="subtitle2" gutterBottom>
                          {facilityData?.facility?.dispatch?.facilityCount}{' '}
                          facilities in this dispatch.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <React.Fragment>
                    {facilityData?.facility?.manifest?.isAccepted ? (
                      <Grid item xs={12}>
                        <CustomTimeline>
                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Dashboards updated
                              </Typography>
                              <Typography variant="subtitle2">
                                {format(
                                  new Date(
                                    facilityData?.facility?.dispatch?.dateProcessed
                                  ),
                                  "d MMM  yyyy hh:mm aaaaa'm'"
                                )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>

                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Processing complete
                              </Typography>
                              <Typography variant="subtitle2">
                                {format(
                                  new Date(
                                    facilityData?.facility?.dispatch?.dateProcessed
                                  ),
                                  "d MMM  yyyy hh:mm aaaaa'm'"
                                )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>

                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Dispatch uploaded by{' '}
                                <strong>
                                  {facilityData?.facility?.dispatch?.owner}
                                </strong>
                              </Typography>
                              <Typography variant="subtitle2">
                                {format(
                                  new Date(
                                    facilityData?.facility?.dispatch?.dateProcessed
                                  ),
                                  "d MMM  yyyy hh:mm aaaaa'm'"
                                )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>

                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Dispatch created by{' '}
                                <strong>
                                  {facilityData?.facility?.dispatch?.creator}
                                </strong>
                              </Typography>
                              <Typography variant="subtitle2">
                                {format(
                                  new Date(
                                    facilityData?.facility?.dispatch?.dateCreated
                                  ),
                                  "d MMM  yyyy hh:mm aaaaa'm'"
                                )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>
                        </CustomTimeline>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <CustomTimeline>
                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <ErrorIcon sx={{ color: red[500] }} />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Processing failed
                              </Typography>
                              <Typography variant="subtitle2">
                                {facilityData?.facility?.dispatch
                                  ?.dateProcessed &&
                                  format(
                                    new Date(
                                      facilityData?.facility?.dispatch?.dateProcessed
                                    ),
                                    "d MMM  yyyy hh:mm aaaaa'm'"
                                  )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>

                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Dispatch uploaded by{' '}
                                <strong>
                                  {facilityData?.facility?.dispatch?.owner}
                                </strong>
                              </Typography>
                              <Typography variant="subtitle2">
                                {facilityData?.facility?.dispatch
                                  ?.dateProcessed &&
                                  format(
                                    new Date(
                                      facilityData?.facility?.dispatch?.dateProcessed
                                    ),
                                    "d MMM  yyyy hh:mm aaaaa'm'"
                                  )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>

                          <CustomTimelineItem>
                            <CustomTimelineOppositeContent />
                            <TimelineSeparator>
                              <TimelineDot
                                variant="outlined"
                                sx={{ padding: 0 }}
                              >
                                <CheckCircle sx={{ color: 'green' }} />
                              </TimelineDot>
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" component="span">
                                Dispatch created by{' '}
                                <strong>
                                  {facilityData?.facility?.dispatch?.creator}
                                </strong>
                              </Typography>
                              <Typography variant="subtitle2">
                                {facilityData?.facility?.dispatch
                                  ?.dateCreated &&
                                  format(
                                    new Date(
                                      facilityData?.facility?.dispatch?.dateCreated
                                    ),
                                    "d MMM  yyyy hh:mm aaaaa'm'"
                                  )}
                              </Typography>
                            </TimelineContent>
                          </CustomTimelineItem>
                        </CustomTimeline>
                      </Grid>
                    )}
                  </React.Fragment>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={8}>
              <SubCard
                title={
                  <Box display="flex" alignItems="center">
                    <TrendingUpRoundedIcon />
                    <Typography variant="h5" ml={1}>
                      Record Growth over Time
                    </Typography>
                  </Box>
                }
              >
                <HighchartsReact highcharts={Highcharts} options={options} />
              </SubCard>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </React.Fragment>
  );
};
export default FacilityDetails;
