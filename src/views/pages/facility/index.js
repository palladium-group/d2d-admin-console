import MainCard from '../../../ui-component/cards/MainCard';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const Facility = () => {
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'facilityName',
        header: 'Province'
      },
      {
        accessorKey: 'count',
        header: 'District'
      },
      {
        accessorKey: 'lastVisitDate',
        header: 'Sub District'
      },
      {
        accessorKey: 'facility',
        header: 'Facility'
      },
      {
        accessorKey: 'dispatch',
        header: 'Dispatch File Name'
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By'
      },
      {
        accessorKey: 'dateProcessed',
        header: 'Date Processed'
      },
      {
        accessorKey: 'lastARTVisitDate',
        header: 'Last ART Visit Date'
      },
      {
        accessorKey: 'dispatchStatus',
        header: 'Dispatch Status'
      },
      {
        accessorKey: 'validationOutcome',
        header: 'Validation Outcome'
      },
      {
        accessorKey: 'patientCount',
        header: 'Patient Count'
      }
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data: {},
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
        right: ['mrt-row-actions']
      }
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined'
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined'
    },
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton onClick={() => navigate(`/facility/${row.original.id}`)}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>
    )
  });
  return (
    <MainCard>
      <MaterialReactTable table={table} />;
    </MainCard>
  );
};
export default Facility;
