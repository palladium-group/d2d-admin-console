import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Typography,
  useScrollTrigger
} from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import { format } from 'date-fns';

// project imports
import MenuList from './MenuList';
import useConfig from 'hooks/useConfig';
import { useQuery } from '@tanstack/react-query';
import {
  getNextExecutionTime,
  getPreviousExecutionInfo
} from '../../api/d2d-api';
import { useEffect, useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

// ==============================|| HORIZONTAL MENU LIST ||============================== //

function ElevationScroll({ children, window }) {
  const theme = useTheme();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  theme.shadows[4] = theme.customShadows.z1;

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

// ==============================|| HORIZONTAL MENU LIST ||============================== //

const CustomAppBar = () => {
  const [nextExecutionTime, setNextExecutionTime] = useState();
  const [previousExecutionTime, setPreviousExecutionTime] = useState();
  const theme = useTheme();
  const { container } = useConfig();
  const {
    isLoading,
    isError,
    data: { data = {} } = {}
  } = useQuery({
    queryKey: ['getNextExecutionTime'],
    queryFn: async () => {
      const data = await getNextExecutionTime();
      return data;
    }
  });
  const {
    isLoading: isLoadingPreviousExecution,
    isError: isErrorPreviousExecution,
    data: { data: previous = {} } = {}
  } = useQuery({
    queryKey: ['getPreviousExecutionInfo'],
    queryFn: async () => {
      const data = await getPreviousExecutionInfo();
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setNextExecutionTime(data.nextScheduledExecution);
    }
    if (!isLoadingPreviousExecution && !isErrorPreviousExecution && previous) {
      if (previous.executions.length > 0) {
        setPreviousExecutionTime(previous.executions[0]['date-ended']['date']);
      }
    }
  }, [
    isLoading,
    isError,
    data,
    isLoadingPreviousExecution,
    isErrorPreviousExecution
  ]);

  function getTimeAgo(dateString) {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          top: 71,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'background.default'
              : 'background.paper',
          width: '100%',
          height: 62,
          justifyContent: 'center',
          borderTop: `1px solid ${
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : theme.palette.grey[300] + 98
          }`,
          zIndex: 1098
        }}
      >
        <Container maxWidth={container ? 'lg' : false}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <MenuList />

            <Box sx={{ flexGrow: 1 }} />
            <IconButton sx={{ color: '#72BB53' }}>
              <AlarmIcon />
            </IconButton>
            <Box>
              <Typography variant="h6">
                Last Run:{' '}
                {previousExecutionTime &&
                  format(
                    new Date(previousExecutionTime),
                    "d MMM yyyy hh:mmaaaaa'm'"
                  )}
              </Typography>
              <Typography variant="h6">
                Next Run: {nextExecutionTime && getTimeAgo(nextExecutionTime)}
              </Typography>
            </Box>
          </Box>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default CustomAppBar;
