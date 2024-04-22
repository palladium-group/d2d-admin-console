import { useTheme } from '@mui/material/styles';
import {
    Container,
    Grid,
    Typography,
    Stack,
    Box,
    Button,
    lighten,
    MenuItem,
    ListItemIcon
} from '@mui/material';

//MRT Imports
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';
import {useMemo} from "react";

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DispatchTable from "./DispatchTable";


const DispatchSection = () => {
    const theme = useTheme();

    return (
        <Container maxWidth={false}>
            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DispatchTable />;
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </Container>
    );
};
export default DispatchSection;
