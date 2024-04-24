import {
    Box, Container,
} from '@mui/material';

import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {useMemo, useState} from "react";

import DispatchDetailsTable from "./DispatchDetailsTable";
import {useQuery} from "@tanstack/react-query";
import {getDispatches} from "../../api/d2d-api";

const DispatchTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const { data: { data = [] } = {} } = useQuery({
        queryKey: [
            'getDispatches',
            pagination.pageIndex + 1,
            pagination.pageSize
        ],
        queryFn: async (queryKeys) => {
            const data = await getDispatches(queryKeys);
            return data;
        },
    });
    const columns = useMemo(
        () => [
            {
                accessorKey: "creator",
                header: "Owner",
            },
            {
                accessorKey: "date",
                header: "Dispatch Date",
            },
            {
                accessorKey: "statusName",
                header: "Dispatch Status",
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
            {
                accessorKey: "version",
                header: "Version"
            },
            {
                accessorKey: "facilityCount",
                header: "Facility Count"
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
        enableRowActions: false,
        enableRowSelection: false,
        onPaginationChange: setPagination,
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
                <Container>
                    <DispatchDetailsTable manifests={row.original.manifests} />
                </Container>
            </Box>
        ),
    });
    return <MaterialReactTable table={table} />;
};
export default DispatchTable;
