import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  // Checkbox,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  // TablePagination,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import { format } from 'date-fns';

// project imports
import MailEmpty from '../../../views/application/mail/MailEmpty';
// import MailListHeader from './MailListHeader';
// import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';

// assets
import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
// import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
// import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
// import LabelTwoToneIcon from '@mui/icons-material/LabelTwoTone';
// import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import { useQuery } from '@tanstack/react-query';
import { getOwnerNotifications } from '../../../api/d2d-api';
import { useEffect, useState } from 'react';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';
import { useNavigate } from 'react-router-dom';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ selected }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="none" colSpan={5}>
          <EnhancedTableToolbar numSelected={selected.length} />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selected: PropTypes.array
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main
      })
    }}
  >
    {numSelected > 0 && (
      <Typography color="inherit" variant="h4" component="div">
        {numSelected} Mail Selected
      </Typography>
    )}
  </Toolbar>
);

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  //console.log(user);
  const {
    data: { data = [] } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getOwnerNotifications', user.tokenParsed.preferred_username],
    queryFn: async (queryKey) => {
      const data = await getOwnerNotifications(queryKey);
      return data;
    }
  });

  // console.log(notifications);
  useEffect(() => {
    if (!isLoading && !isError && data) {
      setNotifications(data);
    }
    setPage(1);
    setRowsPerPage(5);
  }, [isLoading, data, isError]);

  const handleClickDetails = (e, row) => {
    console.log(e);
    navigate(`/notification/${row.id}`);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //
  //   setSelected(newSelected);
  // };

  // const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notifications.length) : 0;

  const darkBG = theme.palette.mode === 'dark' ? 'dark.main' : 'grey.100';

  return (
    <>
      <Grid container spacing={matchDownSM ? 3 : 1}>
        <Grid item xs={12}>
          {notifications.length ? (
            <MainCard
              content={false}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50'
              }}
            >
              {/* table */}
              <TableContainer>
                <Table
                  size={'small'}
                  aria-labelledby="tableTitle"
                  sx={{
                    minWidth: 320,
                    '& td': {
                      whiteSpace: 'nowrap',
                      px: 0.75,
                      py: 0.5
                    }
                  }}
                >
                  {/*{selected.length > 0 && (*/}
                  {/*  <EnhancedTableHead selected={selected} />*/}
                  {/*)}*/}
                  <TableBody>
                    {notifications.map((row, index) => {
                      // const isItemSelected = isSelected(
                      //   row.dispatchOwner.displayName
                      // );
                      // console.log(row);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          sx={{
                            bgcolor: !row.notificationRead ? darkBG : '',
                            '& td:last-of-type>div': {
                              position: 'absolute',
                              top: '50%',
                              right: 5,
                              transform: 'translateY(-50%)',
                              display: 'none',
                              background:
                                theme.palette.mode === 'dark'
                                  ? theme.palette.dark[800]
                                  : '#fff',
                              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                              borderRadius: '12px',
                              py: 1,
                              px: 1.75,
                              '& button + button': {
                                ml: 0.625
                              }
                            },
                            '&:hover': {
                              '& td:last-of-type>div': {
                                display: 'block'
                              }
                            }
                          }}
                          // aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index}
                          // selected={isItemSelected}
                        >
                          {/*<TableCell>*/}
                          {/*  <Checkbox*/}
                          {/*    checked={isItemSelected}*/}
                          {/*    color="primary"*/}
                          {/*    onChange={(event) =>*/}
                          {/*      handleClick(*/}
                          {/*        event,*/}
                          {/*        row.dispatchOwner.displayName*/}
                          {/*      )*/}
                          {/*    }*/}
                          {/*    inputProps={{*/}
                          {/*      'aria-labelledby': labelId*/}
                          {/*    }}*/}
                          {/*  />*/}
                          {/*  <Checkbox*/}
                          {/*    icon={<StarBorderTwoToneIcon />}*/}
                          {/*    checkedIcon={<StarTwoToneIcon />}*/}
                          {/*    sx={{*/}
                          {/*      '&.Mui-checked': {*/}
                          {/*        color: theme.palette.warning.dark*/}
                          {/*      }*/}
                          {/*    }}*/}
                          {/*    checked={row.starred}*/}
                          {/*    // onChange={(event) =>*/}
                          {/*    //   handleStarredChange(event, row)*/}
                          {/*    // }*/}
                          {/*    size="small"*/}
                          {/*  />*/}
                          {/*  <Checkbox*/}
                          {/*    icon={<LabelOutlinedIcon />}*/}
                          {/*    checkedIcon={<LabelTwoToneIcon />}*/}
                          {/*    sx={{*/}
                          {/*      '&.Mui-checked': {*/}
                          {/*        color: theme.palette.secondary.main*/}
                          {/*      }*/}
                          {/*    }}*/}
                          {/*    checked={row.important}*/}
                          {/*    // onChange={(event) =>*/}
                          {/*    //   handleImportantChange(event, row)*/}
                          {/*    // }*/}
                          {/*    size="small"*/}
                          {/*  />*/}
                          {/*</TableCell>*/}
                          <TableCell
                            id={labelId}
                            sx={{ cursor: 'pointer' }}
                            onClick={(e) => handleClickDetails(e, row)}
                          >
                            <Grid
                              container
                              spacing={2}
                              alignItems="center"
                              sx={{ flexWrap: 'nowrap' }}
                            >
                              <Grid item>
                                <Avatar
                                  sx={
                                    {
                                      // width: denseTable ? 30 : 40,
                                      // height: denseTable ? 30 : 40
                                    }
                                  }
                                  alt={row.dispatchOwner.displayName}
                                  src={
                                    row.profile &&
                                    row.profile.avatar &&
                                    avatarImage(`./${row.profile.avatar}`)
                                  }
                                />
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <ButtonBase disableRipple>
                                  <Typography
                                    align="left"
                                    variant={
                                      row.notificationRead
                                        ? 'body2'
                                        : 'subtitle1'
                                    }
                                    component="div"
                                  >
                                    {row.senderName}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ cursor: 'pointer' }}
                            onClick={(e) => handleClickDetails(e, row)}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: 'flex',
                                width: {
                                  xs: 220,
                                  md: 350,
                                  lg: 600,
                                  xl: 700
                                }
                              }}
                            >
                              <Typography
                                variant={
                                  row.notificationRead ? 'body2' : 'subtitle1'
                                }
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'block'
                                }}
                              >
                                {row.previewText}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {row.attach && (
                              <IconButton size="large" aria-label="attachment">
                                <AttachmentTwoToneIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ position: 'relative' }}
                          >
                            {row.sentDate &&
                              format(
                                new Date(row.sentDate),
                                'd MMM yy HH:mm a'
                              )}
                            <div>
                              <IconButton size="large" aria-label="archive">
                                <ArchiveTwoToneIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="large" aria-label="mail">
                                <MailTwoToneIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="large" aria-label="delete">
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="large" aria-label="visible">
                                <VisibilityOffTwoToneIcon fontSize="small" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          ) : (
            <MailEmpty />
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default Notifications;
