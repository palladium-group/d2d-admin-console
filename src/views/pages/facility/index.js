import React, { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { Box, Container, Dialog, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '../../../apiRoutes';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';
import { format } from 'date-fns';
import MainCard from '../../../ui-component/cards/MainCard';
import FacilityDetails from './FacilityDetails';

const Facility = () => {
  const user = useKeyCloakAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [facilityId, setFacilityId] = useState();

  const {
    data = {},
    isError,
    isRefetching,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['table-data'],
    queryFn: async () => {
      const fetchURL = new URL(
        `${apiRoutes.manifest}/Facility/Latest/${user?.OrgUnit}/${user?.OrgUnitValue}?page=1&pageSize=5000`
      );
      const response = await fetch(fetchURL.href);
      const json = await response.json();

      return json;
    }
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'facilityName',
        header: 'Facility'
      },
      {
        accessorKey: 'Dispatch File Name',
        header: 'Dispatch File Name',
        accessorFn: (row) => row?.dispatch?.name,
        enableColumnFilter: false
      },
      {
        accessorKey: 'Created By',
        header: 'Uploaded By',
        accessorFn: (row) => row?.dispatch?.owner,
        enableColumnFilter: false
      },
      {
        accessorKey: 'Date Processed',
        header: 'Date Processed',
        accessorFn: (row) =>
          format(new Date(row?.dispatch?.dateProcessed), 'dd-MMM-yyyy'),
        enableColumnFilter: false
      },
      {
        accessorKey: 'patients',
        header: 'Patient Count',
        enableColumnFilter: false
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
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          onClick={() => {
            setOpenDialog(true);
            setFacilityId(row.original.id);
          }}
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
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching
    }
  });

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <MainCard>
        <MaterialReactTable table={table} />;
      </MainCard>
      <Dialog
        open={openDialog}
        fullWidth={true}
        onClose={handleClose}
        maxWidth="lg"
      >
        <FacilityDetails facilityId={facilityId} />
      </Dialog>
    </Container>
  );
};
export default Facility;
