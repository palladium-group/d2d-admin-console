import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useMemo} from "react";
import {Box} from "@mui/material";

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

const DispatchDetailsTable = ({ manifests }) => {
    console.log(manifests);
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
                header: "Status"
            }
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
        enableRowActions: false,
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
    });
    return <MaterialReactTable table={table} />;
};
export default DispatchDetailsTable;
