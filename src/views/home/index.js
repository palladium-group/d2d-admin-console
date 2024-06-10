import React from 'react';
// material-ui
import { styled } from '@mui/material/styles';
// project imports
// import DispatchSection from "./DispatchSection";
// import D2DCardList from "./D2DCardList";
import { gridSpacing } from '../../store/constant';
import { Grid } from '@mui/material';
import RunDeckInfo from './RunDeckInfo';
import HomeMap from './HomeMap';
// custom style

const SectionWrapper = styled('div')({
  paddingTop: 0,
  paddingBottom: 0
});

const Home = () => {
  // const theme = useTheme();

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item md={12}>
        <SectionWrapper>
          <RunDeckInfo />
        </SectionWrapper>
      </Grid>

      <Grid item md={12}>
        <SectionWrapper>
          <HomeMap />
        </SectionWrapper>
      </Grid>
    </Grid>
  );
};
export default Home;
