import PropTypes from 'prop-types';

// material-ui
import {
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
  useMediaQuery
} from '@mui/material';

// assets
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HeightIcon from '@mui/icons-material/Height';
import SearchIcon from '@mui/icons-material/Search';

// ==============================|| MAIL LIST HEADER ||============================== //

const MailListHeader = ({
  search,
  handleSearch,
  length,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDrawerOpen,
  handleDenseTable
}) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={1.5}
        >
          <IconButton
            onClick={handleDrawerOpen}
            size="small"
            aria-label="click to sidebar menu collapse"
          >
            <MenuRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleDenseTable}
            size="small"
            aria-label="click to size change of mail"
          >
            <HeightIcon fontSize="small" />
          </IconButton>
          <TextField
            sx={{ display: { xs: 'block', sm: 'none' } }}
            fullWidth={matchDownSM}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
            placeholder="Search Notifications"
            value={search}
            size="small"
          />
        </Stack>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1.5}
        >
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
            placeholder="Search Notifications"
            value={search}
            size="small"
          />
          {/* table pagination */}
          <TablePagination
            sx={{ '& .MuiToolbar-root': { pl: 1 } }}
            rowsPerPageOptions={[]}
            component="div"
            count={length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

MailListHeader.propTypes = {
  search: PropTypes.string,
  length: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleSearch: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  handleChangePage: PropTypes.func,
  handleDrawerOpen: PropTypes.func,
  handleDenseTable: PropTypes.func
};

export default MailListHeader;
