import React from "react";
// material-ui
import { useTheme, styled } from '@mui/material/styles';
// project imports
import DispatchSection from "./DispatchSection";
// custom style

const SectionWrapper = styled('div')({
    paddingTop: 10,
    paddingBottom: 10
});

const Home = () => {
    const theme = useTheme();

    return (
        <React.Fragment>
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <DispatchSection />
            </SectionWrapper>
        </React.Fragment>
    );
};
export default Home;
