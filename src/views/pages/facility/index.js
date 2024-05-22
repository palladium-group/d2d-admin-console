import MainCard from '../../../ui-component/cards/MainCard';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '../../../apiRoutes';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';

const Facility = () => {
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  // const [totalRowCount, setTotalRowCount] = useState(0);

  const {
    data = {},
    isError,
    isRefetching,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [
      'table-data',
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        `${apiRoutes.manifest}/Facility/Latest/${user?.OrgUnit}/${user?.OrgUnitValue}?page=1&pageSize=1000`
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
      // setTotalRowCount(json.pageInfo.totalItems);

      return json;
    }
  });

  console.log(data);

  const columns = useMemo(
    () => [
      {
        header: 'Province',
        accessorKey: 'Province',
        accessorFn: (row) => row?.orgHierarchy?.provinceName
      },
      {
        accessorKey: 'District',
        header: 'District',
        accessorFn: (row) => row?.orgHierarchy?.districtName
      },
      {
        accessorKey: 'Sub District',
        header: 'Sub District',
        accessorFn: (row) => row?.orgHierarchy?.subDistrictName
      },
      {
        accessorKey: 'facilityName',
        header: 'Facility'
      },
      {
        accessorKey: 'Dispatch File Name',
        header: 'Dispatch File Name',
        accessorFn: (row) => row?.dispatch?.name
      },
      {
        accessorKey: 'Created By',
        header: 'Created By',
        accessorFn: (row) => row?.dispatch?.owner
      },
      {
        accessorKey: 'Date Processed',
        header: 'Date Processed',
        accessorFn: (row) => row?.dispatch?.dateProcessed
      },
      // {
      //   accessorKey: 'lastVisitDate',
      //   header: 'Last ART Visit Date'
      // },
      // {
      //   accessorKey: 'dispatchStatus',
      //   header: 'Dispatch Status'
      // },
      // {
      //   accessorKey: 'validationOutcome',
      //   header: 'Validation Outcome'
      // },
      {
        accessorKey: 'patients',
        header: 'Patient Count'
      }
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    enablePagination: true,
    positionActionsColumn: 'last',
    initialState: {
      showColumnFilters: true
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          onClick={() => navigate(`/facility-details/${row.original.id}`)}
        >
          <LinkOutlinedIcon />
        </IconButton>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    //rowCount: meta?.totalRowCount ?? 0,
    // rowCount: totalRowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting
    }
  });
  return (
    <MainCard>
      <MaterialReactTable table={table} />;
    </MainCard>
  );
};
export default Facility;
