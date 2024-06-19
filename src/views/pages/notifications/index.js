import { Box, Grid, Container } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MailDrawer from './MailDrawer';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';
import MailList from './MailList';
import useKeyCloakAuth from 'hooks/useKeyCloakAuth';
import { useQuery } from '@tanstack/react-query';
import { getOwnerNotifications } from 'api/d2d-api';
import { useEffect, useState } from 'react';
import MailDetails from 'views/application/mail/MailDetails';
import { useLocation } from 'react-router-dom';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: 'calc(100% - 320px)',
    flexGrow: 1,
    paddingLeft: open ? theme.spacing(3) : 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down('xl')]: {
      paddingLeft: 0,
      marginLeft: 0
    },
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter
      }),
      marginLeft: 0
    })
  })
);

const Notifications = () => {
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const user = useKeyCloakAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [errorNotificationsCount, setErrorNotificationsCount] = useState(0);
  const [emailDetails, setEmailDetailsValue] = useState(
    state?.selectedNotification
  );
  const [selectedMail, setSelectedMail] = useState(state?.selectedNotification);

  const handleUserChange = async (data) => {
    /* if (data) {
        await dispatch(setRead(data.id));
        await dispatch(getMails());
    } */
    setSelectedMail(data);
    setEmailDetailsValue((prev) => !prev);
  };

  const handleStarredChange = async (event, dataStarred) => {
    if (dataStarred) {
      //await dispatch(setStarred(dataStarred.id));
      handleFilter(filter);
      console.log(dataStarred);
    }
  };

  const [filter, setFilter] = useState('all');
  const handleFilter = async (string) => {
    setEmailDetailsValue(false);
    setFilter(string);
    //await dispatch(filterMails(string));
  };

  const {
    data: { data = [] } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: [
      'getOwnerNotifications',
      user.tokenParsed.preferred_username,
      user.token
    ],
    queryFn: async (queryKey) => {
      const data = await getOwnerNotifications(queryKey);
      return data;
    }
  });

  // console.log(notifications);
  useEffect(() => {
    if (!isLoading && !isError && data) {
      const unreadNotification = data.filter(
        (obj) => obj.notificationRead === false
      );
      const errorNotification = data.filter((obj) => obj.emailCode === 'ERROR');
      //setNotifications(unreadNotification);
      setNotificationsCount(unreadNotification.length);
      setErrorNotificationsCount(errorNotification.length);
    }
    //setPage(1);
    //setRowsPerPage(5);
  }, [isLoading, data, isError]);
  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        <MailDrawer
          openMailSidebar={true}
          unreadCounts={notificationsCount}
          errorCounts={errorNotificationsCount}
          filter={filter}
          handleFilter={handleFilter}
        />
        <Main theme={theme} open={true}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              {emailDetails ? (
                <MailDetails
                  data={selectedMail}
                  handleUserDetails={(e, d) => handleUserChange(d)}
                  handleStarredChange={handleStarredChange}
                />
              ) : (
                <MailList
                  data={data}
                  handleUserDetails={(e, d) => handleUserChange(d)}
                  handleStarredChange={handleStarredChange}
                />
              )}
            </Grid>
          </Grid>
        </Main>
      </Box>
    </Container>
  );
};

export default Notifications;
