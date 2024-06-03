import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  // Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { getOwnerNotifications } from '../../../../api/d2d-api';
import useKeyCloakAuth from '../../../../hooks/useKeyCloakAuth';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);

  const user = useKeyCloakAuth();
  const { data: { data = [] } = {}, isLoading } = useQuery({
    queryKey: ['getOwnerNotifications', user.tokenParsed.preferred_username],
    queryFn: async (queryKey) => {
      const data = await getOwnerNotifications(queryKey);
      return data;
    }
  });

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;

    if (!isLoading) {
      const unreadNotification = data.filter(
        (obj) => obj.notificationRead === false
      );
      setNotifications(unreadNotification);
      setNotificationsCount(unreadNotification.length);
    }
  }, [open, isLoading, data]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge
          badgeContent={notificationsCount}
          color="error"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background:
                theme.palette.mode === 'dark'
                  ? theme.palette.dark.main
                  : theme.palette.secondary.light,
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.warning.dark
                  : theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background:
                  theme.palette.mode === 'dark'
                    ? theme.palette.warning.dark
                    : theme.palette.secondary.dark,
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[800]
                    : theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [matchesXs ? 5 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions
              position={matchesXs ? 'top' : 'top-right'}
              in={open}
              {...TransitionProps}
            >
              <Paper>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                  >
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ pt: 2, px: 2 }}
                        >
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">
                                All Notification
                              </Typography>
                              {/*<Chip*/}
                              {/*  size="small"*/}
                              {/*  label="01"*/}
                              {/*  sx={{*/}
                              {/*    color: theme.palette.background.default,*/}
                              {/*    bgcolor: theme.palette.warning.dark*/}
                              {/*  }}*/}
                              {/*/>*/}
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Typography
                              component={Link}
                              to="#"
                              variant="subtitle2"
                              color="primary"
                            >
                              Mark as all read
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PerfectScrollbar
                          style={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflowX: 'hidden'
                          }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs={12} p={0}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          <NotificationList data={notifications} />
                        </PerfectScrollbar>
                      </Grid>
                    </Grid>
                    <Divider />
                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                      <Button size="small" disableElevation>
                        View All
                      </Button>
                    </CardActions>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
