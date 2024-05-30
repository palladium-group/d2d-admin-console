import React, { useEffect, useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { Box, Grid, Typography } from '@mui/material';
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
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useQuery } from '@tanstack/react-query';
import { getFacilityDetails } from '../../../api/d2d-api';
import { format } from 'date-fns';

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
  // const [series, setSeries] = useState([]);
  const {
    data: { data = {} } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getFacilityDetails', facilityId],
    queryFn: async (queryKey) => {
      const data = await getFacilityDetails(queryKey);
      return data;
    },
    enabled: !!facilityId
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setFacilityData(data);
    }
  }, [data, isLoading, isError]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setOptions({
      title: {
        text: '',
        align: 'left'
      },

      subtitle: {
        text: '',
        align: 'left'
      },

      yAxis: {
        title: {
          text: 'Number'
        }
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Months'
        },
        categories: [
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
        ]
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
        }
      },

      series: [
        {
          name: 'Patients',
          data: [
            43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
            161454, 154610
          ]
        },
        {
          name: 'Visits',
          data: [
            24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
            34243, 31050
          ]
        }
      ],

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
  }, []);

  return (
    <React.Fragment>
      <MainCard title={facilityData?.facility?.facilityName}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <MainCard title="Most Recent Dispatch" sx={{ border: 2 }}>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <Grid container>
                    <Grid item md={5}>
                      Last Submitted On:
                    </Grid>
                    <Grid item md={7}>
                      {facilityData?.facility?.dispatch?.dateCreated}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5}>
                      Submitted By:
                    </Grid>
                    <Grid item xs={7}>
                      {facilityData?.facility?.dispatch?.creator}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5}>
                      Status:
                    </Grid>
                    <Grid item xs={7}>
                      {facilityData?.facility?.manifest?.isAccepted && (
                        <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                      )}
                      {!facilityData?.facility?.manifest?.isAccepted && (
                        <ReportProblemOutlinedIcon sx={{ color: 'red' }} />
                      )}
                    </Grid>
                  </Grid>
                  {!facilityData?.facility?.manifest?.isAccepted && (
                    <Grid container>
                      <Grid item xs={5}>
                        &nbsp;
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body1" sx={{ color: 'red' }}>
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
                  <Grid container>
                    <Grid item xs={5}>
                      File Name:
                    </Grid>
                    <Grid item xs={7}>
                      {facilityData?.facility?.dispatch?.share?.file}
                    </Grid>
                  </Grid>
                </Grid>

                {facilityData?.facility?.manifest?.isAccepted && (
                  <Grid item xs={12}>
                    <CustomTimeline>
                      <CustomTimelineItem>
                        <CustomTimelineOppositeContent />
                        <TimelineSeparator>
                          <TimelineDot>
                            <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            Dispatch Created By{' '}
                            {facilityData?.facility?.dispatch?.creator}
                          </Typography>
                          <Typography>
                            {format(
                              new Date(
                                facilityData?.facility?.dispatch?.dateCreated
                              ),
                              "d MMM  yyyy hh:mm aaaaa'm'"
                            )}
                          </Typography>
                        </TimelineContent>
                      </CustomTimelineItem>
                      <CustomTimelineItem>
                        <CustomTimelineOppositeContent />
                        <TimelineSeparator>
                          <TimelineDot>
                            <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            Dispatch Uploaded By{' '}
                            {facilityData?.facility?.dispatch?.owner}
                          </Typography>
                          <Typography>
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
                          <TimelineDot>
                            <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            Processing Complete
                          </Typography>
                          <Typography>
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
                          <TimelineDot>
                            <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                          </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            Dashboards Updated
                          </Typography>
                          <Typography>
                            {format(
                              new Date(
                                facilityData?.facility?.dispatch?.dateProcessed
                              ),
                              "d MMM  yyyy hh:mm aaaaa'm'"
                            )}
                          </Typography>
                        </TimelineContent>
                      </CustomTimelineItem>
                    </CustomTimeline>
                  </Grid>
                )}
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={8}>
            <MainCard title="Record Growth Over Time" sx={{ border: 2 }}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </React.Fragment>
  );
};
export default FacilityDetails;
