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

  const {
    data: { data = [] } = {},
    isError,
    isRefetching,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [
      'table-data',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        `${apiRoutes.project}/GetProjects/${user?.tokenParsed?.UserLevel}/${user?.tokenParsed?.email}`
      );

      //read our state and pass it to the API as query params
      /*fetchURL.searchParams.set(
        "implementingOffices",
        JSON.stringify(user?.tokenParsed?.Office)
      );*/

      const implementingOffice =
        localStorage.getItem('office_setting') ?? user?.tokenParsed?.Office;
      fetchURL.searchParams.set(
        'implementingOffices',
        JSON.stringify(['' + implementingOffice + ''])
      );

      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);

      fetchURL.searchParams.set(
        'filters',
        columnFilters && columnFilters.length > 0
          ? JSON.stringify(columnFilters)
          : []
      );
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = await response.json();
      setTotalRowCount(json.pageInfo.totalItems);

      return json;
    }
  });

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
    data: data,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
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
