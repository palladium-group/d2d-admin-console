import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography, Stack } from '@mui/material';

import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';

import GridViewIcon from '@mui/icons-material/GridView';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
// import WebOutlinedIcon from '@mui/icons-material/WebOutlined';

const RunDeckInfo = () => {
  const theme = useTheme();
  const cardSX = {
    overflow: 'hidden',
    position: 'relative',
    border: 'none',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 150,
      height: 150,
      border: `35px solid ${theme.palette.background.paper}`,
      opacity: theme.palette.mode === 'dark' ? 0.1 : 0.4,
      borderRadius: '50%',
      top: -72,
      right: -63
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 150,
      height: 150,
      border: `2px solid ${theme.palette.background.paper}`,
      opacity: theme.palette.mode === 'dark' ? 0.05 : 0.21,
      borderRadius: '50%',
      top: -97,
      right: -3
    },
    '& .MuiCardContent-root': {
      padding: '20px 38px 20px 30px'
    }
  };
  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        spacing={{ xs: 3, sm: 5 }}
        sx={{ textAlign: 'center' }}
      >
        <Grid item md={5} sm={6} xs={12}>
          <SubCard sx={{ ...cardSX }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Avatar
                variant="rounded"
                sx={{
                  background: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  opacity: theme.palette.mode === 'dark' ? 1 : 0.5,
                  height: 60,
                  width: 60,
                  borderRadius: '12px'
                }}
              >
                <GridViewIcon sx={{ fontSize: '2.25rem' }} />
              </Avatar>
              <Stack alignItems="flex-start">
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: '2.5rem',
                    zIndex: '99',
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.dark[900]
                        : theme.palette.grey[900]
                  }}
                >
                  Last Processing
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.120rem',
                    textAlign: 'end',
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.dark[900]
                        : theme.palette.grey[900]
                  }}
                >
                  2024-04-25 11:50
                </Typography>
              </Stack>
            </Stack>
          </SubCard>
        </Grid>
        <Grid item md={2} sm={6} xs={12}></Grid>
        <Grid item md={5} sm={6} xs={12}>
          <SubCard sx={{ ...cardSX }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Avatar
                variant="rounded"
                sx={{
                  background: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  opacity: theme.palette.mode === 'dark' ? 1 : 0.5,
                  height: 60,
                  width: 60,
                  borderRadius: '12px'
                }}
              >
                <WidgetsOutlinedIcon sx={{ fontSize: '2.25rem' }} />
              </Avatar>
              <Stack alignItems="flex-start">
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: '2.5rem',
                    zIndex: '99',
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.dark[900]
                        : theme.palette.grey[900]
                  }}
                >
                  Next Processing
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.120rem',
                    textAlign: 'end',
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.dark[900]
                        : theme.palette.grey[900]
                  }}
                >
                  2024-04-26 11:50
                </Typography>
              </Stack>
            </Stack>
          </SubCard>
        </Grid>
      </Grid>
    </Container>
  );
};
export default RunDeckInfo;
