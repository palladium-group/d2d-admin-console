import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  CardContent,
  Grid,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAcknowledged } from '../../../api/d2d-api';
import { useEffect } from 'react';

// ==============================|| MAIL DETAILS ||============================== //

const MailDetails = ({ data }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const emailBody = typeof data.emailBody === 'string' ? data.emailBody : '';
  const sanitizedHtml = DOMPurify.sanitize(emailBody);

  const mutation = useMutation({ mutationFn: notificationAcknowledged });

  useEffect(() => {
    mutation.mutate({ id: data.id });
    queryClient
      .invalidateQueries(['getOwnerNotifications'])
      .then((r) => console.log(r));
  }, [data]);
  return (
    <MainCard
      sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50' }}
      content={false}
    >
      <CardContent>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={matchDownSM ? 1 : 0}
            >
              <Grid item>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={matchDownSM ? 1 : 2}
                >
                  <MarkEmailReadOutlinedIcon />
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <Stack
                        direction={matchDownSM ? 'column' : 'row'}
                        alignItems={matchDownSM ? 'flex-start' : 'center'}
                        spacing={matchDownSM ? 0 : 1}
                      >
                        <Typography variant={matchDownSM ? 'h5' : 'h4'}>
                          {data.senderName}
                        </Typography>
                        <Typography
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                          variant="subtitle2"
                        >
                          From: &lt;{data.senderEmail}&gt;
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography variant="subtitle2">
                        From: &lt;{data.senderEmail}&gt;
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  {format(new Date(data?.sentDate), 'd MMM')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={0}>
                  <Grid item>
                    <Typography variant={matchDownSM ? 'h4' : 'h3'}>
                      RE: {data?.emailSubject}
                    </Typography>
                  </Grid>
                  <Grid item xs zeroMinWidth />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      '& > p': {
                        ...theme.typography.body1,
                        marginBottom: 0
                      }
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="div"
                      dangerouslySetInnerHTML={{
                        __html: sanitizedHtml
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

MailDetails.propTypes = {
  data: PropTypes.object
};

export default MailDetails;
