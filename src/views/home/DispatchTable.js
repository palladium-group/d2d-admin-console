import {
    Box,
} from '@mui/material';

import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {useMemo} from "react";

import DispatchDetailsTable from "./DispatchDetailsTable";
const data = [
    {
        owner: 'Monica',
        status: 'Crooks',
        when: '3/27/2015',
    },
    {
        owner: 'Callie',
        status: 'Kub',
        when: '8/19/2019',
    },
    {
        owner: 'Wellington',
        status: 'Treutel',
        when: '3/22/2017',
    },
];
const DispatchTable = () => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "owner",
                header: "Owner",
            },
            {
                accessorKey: "when",
                header: "Dispatch Date",
            },
            {
                accessorKey: "status",
                header: "Dispatch Status"
            }
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: false,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
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
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-around',
                    left: '30px',
                    position: 'sticky',
                    width: '100%',
                }}
            >
                <DispatchDetailsTable dispatchid={row.original.id} />
            </Box>
        ),
    });
    return <MaterialReactTable table={table} />;
};
export default DispatchTable;
