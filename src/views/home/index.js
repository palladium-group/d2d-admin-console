import React from 'react';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
// project imports
// import DispatchSection from "./DispatchSection";
// import D2DCardList from "./D2DCardList";
import { gridSpacing } from '../../store/constant';
import { Grid } from '@mui/material';
// import RunDeckInfo from './RunDeckInfo';
import HomeMap from './HomeMap';
// custom style

const SectionWrapper = styled('div')({
  paddingTop: 10,
  paddingBottom: 10
});

const Home = () => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Grid container spacing={gridSpacing}>
        {/*<Grid item md={12}>*/}
        {/*  <SectionWrapper*/}
        {/*    sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>*/}
        {/*    <RunDeckInfo />*/}
        {/*  </SectionWrapper>*/}
        {/*</Grid>*/}

        <Grid item md={12}>
          <SectionWrapper
            sx={{
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'dark.dark'
                  : 'background.default'
            }}
          >
            <HomeMap />
          </SectionWrapper>
        </Grid>

        {/*<Grid item md={12}>*/}
        {/*    <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>*/}
        {/*        <D2DCardList />*/}
        {/*    </SectionWrapper>*/}

        {/*</Grid>*/}

        {/*<Grid item md={12}>*/}
        {/*    <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>*/}
        {/*        <DispatchSection />*/}
        {/*    </SectionWrapper>*/}
        {/*</Grid>*/}
      </Grid>
    </React.Fragment>
  );
};
export default Home;
