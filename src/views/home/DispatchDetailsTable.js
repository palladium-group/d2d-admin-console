import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useMemo} from "react";
import {Box, IconButton} from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {useNavigate} from "react-router-dom";

const DispatchDetailsTable = ({ manifests }) => {
    const navigate = useNavigate();
    const columns = useMemo(
        () => [
            {
                accessorKey: "facilityName",
                header: "Facility Name",
            },
            {
                accessorKey: "count",
                header: "Count",
            },
            {
                accessorKey: "lastVisitDate",
                header: "Last Visit Date"
            },
            {
                accessorKey: "statusName",
                header: "Status",
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() == "InComplete"
                                    ? theme.palette.error.dark
                                    : cell.getValue() == "InProgress"
                                        ? theme.palette.warning.dark
                                        : theme.palette.success.dark,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {cell.getValue()?.toLocaleString?.('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </Box>
                ),
            },
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data: manifests ? manifests: {},
        enableColumnFilterModes: false,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableColumnPinning: false,
        enableFacetedValues: false,
        enableRowActions: true,
        enableRowSelection: false,
        initialState: {
            showColumnFilters: false,
            showGlobalFilter: false,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions'],
            },
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
        },
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton
                    onClick={() =>
                        navigate(`/project-access/${row.original.id}`)
                    }
                >
                    <AddOutlinedIcon />
                </IconButton>
            </Box>
        ),
    });
    return <MaterialReactTable table={table} />;
};
export default DispatchDetailsTable;
