// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';

import MailDetails from '../../application/mail/MailDetails';
// import MailList from '../application/mail/MailList';

import { gridSpacing } from 'store/constant';
import { useQuery } from '@tanstack/react-query';
import { getNotificationById } from '../../../api/d2d-api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// drawer content element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    paddingLeft: open ? theme.spacing(3) : 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
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

const NotificationDetail = () => {
  let { id } = useParams();
  const theme = useTheme();
  const [emailBody, setEmailBody] = useState();

  const {
    data: { data = {} } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getNotificationById', id],
    queryFn: async (queryKey) => {
      const data = await getNotificationById(queryKey);
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      setEmailBody(data);
    }
  }, [isLoading, isError, data]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Main theme={theme}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {/* mail details & list */}
            {emailBody && <MailDetails data={emailBody} />}
          </Grid>
        </Grid>
      </Main>
    </Box>
  );
};
export default NotificationDetail;
