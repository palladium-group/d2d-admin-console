// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, LinearProgress, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const D2DCardList = () => {
  const theme = useTheme();
  return (
    <MainCard>
      <Grid container alignItems="center" spacing={gridSpacing}>
        <Grid item xs={12} lg={3} sm={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="left">
                Total Dispatches
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" align="left">
                4,600
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress
                variant="determinate"
                value={100}
                color="secondary"
                aria-label="project progress"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="left">
                Completed Dispatches
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" align="left">
                4,569
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/** had wrong colour, colour is an enum not string */}
              <LinearProgress
                variant="determinate"
                value={90}
                sx={{
                  bgcolor: theme.palette.success.light,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.success.dark
                  }
                }}
                aria-label="completed task progress"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="left">
                InProgress Dispatches
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" align="left">
                30
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/** had wrong colour, colour is an enum not string */}
              <LinearProgress
                variant="determinate"
                value={10}
                sx={{
                  bgcolor: theme.palette.orange.light,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.orange.main
                  }
                }}
                aria-label="pending task progress"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="left">
                Incomplete Dispatches
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" align="left">
                15
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress
                variant="determinate"
                value={5}
                sx={{
                  bgcolor: theme.palette.error.light,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.error.main
                  }
                }}
                aria-label="issues progress"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default D2DCardList;
