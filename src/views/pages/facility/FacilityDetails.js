import React, { useEffect, useState, useRef } from 'react';
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
import RecordGrowthChart from './RecordGrowthChart';
import { useTheme } from '@mui/material/styles';

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
  const user = useKeyCloakAuth();
  const theme = useTheme();

  const leftColumnRef = useRef(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState(0);

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

  useEffect(() => {
    if (leftColumnRef.current) {
      setLeftColumnHeight(leftColumnRef.current.offsetHeight);
    }

    if (!isLoading && !isError && data) {
      setFacilityData(data);
    }
  }, [leftColumnRef, data, isLoading, isError]);

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
            color: theme.palette.secondary.main
          }}
        >
          {name}
        </span>
      </Tooltip>
    );
  };
  const getRecencyStatus = (row) => {
    //const currentDate = new Date(2025, 5, 30);
    const endOfPreviousMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0
    );
    const diffTime =
      endOfPreviousMonth - new Date(row?.facility?.lastVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const slowFacilityTypes = [
      'Mobile',
      'Correctional Centre',
      'Hospital',
      'Health Post',
      'Non-Medical Site',
      'CDC'
    ];
    if (
      row?.facility?.manifest?.isAccepted &&
      slowFacilityTypes.includes(row?.facility?.facilityType) &&
      row?.facility?.expectedToReport
    ) {
      return diffDays <= 15 ? 'SUCCESS' : 'STALE';
    } else if (
      row?.facility?.manifest?.isAccepted &&
      !slowFacilityTypes.includes(row?.facility?.facilityType) &&
      row?.facility?.expectedToReport
    ) {
      return diffDays <= 7 ? 'SUCCESS' : 'STALE';
    } else if (
      row?.facility?.manifest?.isAccepted &&
      !row?.facility?.expectedToReport
    ) {
      return 'SUCCESS';
    } else if (!row?.facility?.manifest?.isAccepted) {
      return 'REJECTED';
    } else {
      return 'UNKNOWN';
    }
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
              <LocalHospitalTwoToneIcon color="secondary" />
              <Typography variant="body" ml={1}>
                {facilityData?.facility?.facilityName}
              </Typography>
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid
              item
              md={4}
              lg={4}
              xs={12}
              ref={leftColumnRef}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <SubCard
                title={
                  <Box display="flex" alignItems="center">
                    <FolderZipTwoTone color="secondary" />
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
                        <Typography variant="h5">Last Visit Date:</Typography>
                      </Grid>
                      <Grid item md={7}>
                        {facilityData?.facility?.lastVisitDate &&
                          format(
                            new Date(facilityData?.facility?.lastVisitDate),
                            'd MMM yyyy'
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container>
                      <Grid item md={5}>
                        <Typography variant="h5">Dispatch Created:</Typography>
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
                  {/*<Grid item xs={12}>
                    <Grid container>
                      <Grid item md={5}>
                        <Typography variant="h5">Submitted By:</Typography>
                      </Grid>
                      <Grid item md={7}>
                        {facilityData?.facility?.dispatch?.owner}
                      </Grid>
                    </Grid>
                  </Grid>*/}

                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item md={5}>
                        <Typography variant="h5">Status:</Typography>
                      </Grid>
                      <Grid item md={7}>
                        {getRecencyStatus(facilityData) == 'SUCCESS' && (
                          <Box display="flex" alignItems="center">
                            <CheckCircle sx={{ color: 'green' }} />
                            <Typography variant="h5" color="green" ml={1}>
                              SUCCESS
                            </Typography>
                          </Box>
                        )}
                        {/*facilityData?.facility?.manifest?.isAccepted &&
                          !facilityData?.facility?.expectedToReport && (
                            <Box display="flex" alignItems="center">
                              <CheckCircle sx={{ color: 'green' }} />
                              <Typography variant="h5" color="green" ml={1}>
                                SUCCESS
                              </Typography>
                            </Box>
                          )*/}
                        {getRecencyStatus(facilityData) == 'STALE' && (
                          <Box display="flex" alignItems="center">
                            <ErrorIcon color="warning" />
                            <Typography
                              variant="h5"
                              color="palette.warning"
                              ml={1}
                              gutterBottom
                            >
                              STALE
                            </Typography>
                          </Box>
                        )}
                        {getRecencyStatus(facilityData) == 'REJECTED' && (
                          <Box display="flex" alignItems="center">
                            <ErrorIcon sx={{ color: 'red' }} />
                            <Typography variant="h5" color="red" ml={1}>
                              REJECTED
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    {getRecencyStatus(facilityData) == 'REJECTED' && (
                      <Grid container>
                        <Grid item md={5}>
                          &nbsp;
                        </Grid>
                        <Grid item md={7}>
                          <Typography variant="subtitle2" sx={{ color: 'red' }}>
                            {
                              facilityData?.facility?.manifest
                                ?.rejectReasonLongDescription
                            }
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {getRecencyStatus(facilityData) == 'STALE' && (
                      <Grid container>
                        <Grid item md={5}>
                          &nbsp;
                        </Grid>
                        <Grid item md={7}>
                          <Typography variant="subtitle2">
                            This facility&apos;s data was last updated {}
                            {facilityData?.facility?.daysSinceLastVisit} days
                            ago. Consider submitting a newer dispatch.
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={5}>
                        <Typography variant="h5">File Name:</Typography>
                      </Grid>
                      <Grid
                        item
                        md={7}
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
                          {facilityData?.facility?.dispatch?.facilityCount === 1
                            ? 'facility'
                            : 'facilities'}
                          {' in this dispatch'}.
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
                                {facilityData?.facility?.dispatch?.refreshes[0]
                                  ?.endTime
                                  ? format(
                                      new Date(
                                        facilityData?.facility?.dispatch?.refreshes[0]?.endTime
                                      ),
                                      "d MMM  yyyy hh:mmaaaaa'm'"
                                    )
                                  : 'Refresh time not available'}
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
                                  "d MMM  yyyy hh:mmaaaaa'm'"
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
                                    facilityData?.facility?.dispatch?.share?.dateUploaded
                                  ),
                                  "d MMM  yyyy hh:mmaaaaa'm'"
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
                                  "d MMM  yyyy hh:mmaaaaa'm'"
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
                                    "d MMM  yyyy hh:mmaaaaa'm'"
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
                                    "d MMM  yyyy hh:mmaaaaa'm'"
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
                                    "d MMM  yyyy hh:mmaaaaa'm'"
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
            <Grid
              item
              md={8}
              lg={8}
              xs={12}
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <SubCard
                title={
                  <Box display="flex" alignItems="center">
                    <TrendingUpRoundedIcon color="secondary" />
                    <Typography variant="h5" ml={1}>
                      Record Growth over Time
                    </Typography>
                  </Box>
                }
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <RecordGrowthChart height={leftColumnHeight} data={data} />
              </SubCard>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </React.Fragment>
  );
};
export default FacilityDetails;
