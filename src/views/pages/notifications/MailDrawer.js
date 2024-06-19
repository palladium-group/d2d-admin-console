import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';

// assets
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LabelTwoToneIcon from '@mui/icons-material/LabelTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';

// ==============================|| MAIL DRAWER ||============================== //

const MailDrawer = ({
  filter,
  handleDrawerOpen,
  handleFilter,
  openMailSidebar,
  unreadCounts,
  errorCounts
}) => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: { xs: 1200, xl: 0 },
        '& .MuiDrawer-paper': {
          height: 'auto',
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          borderRadius: matchDownSM ? 0 : `${borderRadius}px`
        }
      }}
      variant={matchDownSM ? 'temporary' : 'persistent'}
      anchor="left"
      open={openMailSidebar}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {openMailSidebar && (
        <MainCard
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
          }}
          border={!matchDownSM}
          content={false}
        >
          <CardContent sx={{ height: matchDownSM ? '100vh' : 'auto' }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <PerfectScrollbar
                  style={{
                    height: matchDownSM ? 'calc(100vh - 115px)' : '100%',
                    overflowX: 'hidden',
                    minHeight: matchDownSM ? 0 : 435
                  }}
                >
                  <List
                    component="nav"
                    sx={{
                      '& .MuiListItem-root': {
                        mb: 0.75,
                        borderRadius: `${borderRadius}px`,
                        '& .MuiChip-root': {
                          color:
                            theme.palette.mode === 'dark'
                              ? 'primary.main'
                              : 'secondary.main',
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'dark.dark'
                              : 'secondary.light'
                        }
                      },
                      '& .MuiListItem-root.Mui-selected': {
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'dark.dark'
                            : 'secondary.light',
                        '& .MuiListItemText-primary': {
                          color:
                            theme.palette.mode === 'dark'
                              ? 'primary.main'
                              : 'secondary.main'
                        },
                        '& .MuiChip-root': {
                          color:
                            theme.palette.mode === 'dark'
                              ? 'primary.main'
                              : 'secondary.light',
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'dark.main'
                              : 'secondary.main'
                        }
                      }
                    }}
                  >
                    <ListItemButton
                      selected={filter === 'inbox'}
                      onClick={() => handleFilter('inbox')}
                    >
                      <ListItemIcon>
                        <InboxTwoToneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Inbox" />
                      <Chip label={unreadCounts} size="small" />
                    </ListItemButton>
                    <ListItemButton
                      selected={filter === 'trash'}
                      onClick={() => handleFilter('trash')}
                    >
                      <ListItemIcon>
                        <DeleteTwoToneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Trash" />
                      <Chip label={0} size="small" />
                    </ListItemButton>
                    <Divider />
                    <ListSubheader sx={{ bgcolor: 'transparent' }}>
                      Filters
                    </ListSubheader>
                    <ListItemButton
                      selected={filter === 'starred'}
                      onClick={() => handleFilter('starred')}
                    >
                      <ListItemIcon>
                        <StarTwoToneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Starred" />
                      <Chip label={0} size="small" />
                    </ListItemButton>
                    <ListItemButton
                      selected={filter === 'rejected'}
                      onClick={() => handleFilter('rejected')}
                    >
                      <ListItemIcon>
                        <ErrorTwoToneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Rejected" />
                      <Chip label={errorCounts} size="small" />
                    </ListItemButton>
                    <Divider />
                    <ListSubheader sx={{ bgcolor: 'transparent' }}>
                      Labels
                    </ListSubheader>
                    <ListItemButton
                      selected={filter === 'dqa'}
                      onClick={() => handleFilter('dqa')}
                    >
                      <ListItemIcon>
                        <LabelTwoToneIcon
                          sx={{ color: theme.palette.primary.main }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="DQA" />
                      <Chip label={0} size="small" />
                    </ListItemButton>
                  </List>
                </PerfectScrollbar>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </Drawer>
  );
};

MailDrawer.propTypes = {
  filter: PropTypes.string,
  handleDrawerOpen: PropTypes.func,
  handleFilter: PropTypes.func,
  openMailSidebar: PropTypes.bool,
  unreadCounts: PropTypes.number
};

export default MailDrawer;
