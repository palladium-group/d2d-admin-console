// material-ui
import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  // Avatar,
  // Button,
  // Card,
  // CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  // Stack,
  Typography
} from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background:
      theme.palette.mode === 'dark'
        ? theme.palette.dark.main
        : theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.dark.main
        : theme.palette.orange.light,
    marginRight: '5px'
  };

  // const chipWarningSX = {
  //   ...chipSX,
  //   color: theme.palette.warning.dark,
  //   backgroundColor:
  //     theme.palette.mode === 'dark'
  //       ? theme.palette.dark.main
  //       : theme.palette.warning.light
  // };
  //
  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.dark.main
        : theme.palette.success.light,
    height: 28
  };

  function getTimeAgo(dateString) {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const handleClick = (e, val) => {
    console.log(e);
    navigate(`/notification/${val.id}`);
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 380,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {data.map((val, index) => (
        <React.Fragment key={index}>
          <ListItemWrapper onClick={(e) => handleClick(e, val)}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                {val.emailCode === 'ERROR' && (
                  <ReportProblemOutlinedIcon style={{ fill: 'red' }} />
                )}
                {val.emailCode === 'INFO' && (
                  <InfoOutlinedIcon style={{ fill: 'blue' }} />
                )}
              </ListItemAvatar>
              <ListItemText primary={val.dispatchOwner.ownerId} />
              <ListItemSecondaryAction>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {getTimeAgo(val.createdDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
            <Grid container direction="column" className="list-container">
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: val.emailBody }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {!val.notificationRead && (
                    <Grid item>
                      <Chip label="Unread" sx={chipErrorSX} />
                    </Grid>
                  )}
                  {val.notificationRead && (
                    <Grid item>
                      <Chip label="Read" sx={chipSuccessSX} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </ListItemWrapper>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationList;
