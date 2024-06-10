import React, { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { Box, Button, Container, Dialog, IconButton } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '../../../apiRoutes';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import MainCard from '../../../ui-component/cards/MainCard';
import FacilityDetails from './FacilityDetails';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true
});

const Facility = () => {
  const user = useKeyCloakAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [facilityId, setFacilityId] = useState();

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => ({
      Facility: row.original.facilityName,
      'Dispatch File Name': row.original.dispatch?.name,
      'Uploaded By': row.original.dispatch?.owner,
      'Date Processed': row.original.dispatch?.dateProcessed,
      Status: row.original.manifest?.isAccepted ? 'SUCCESS' : 'FAILURE'
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const {
    data = {},
    isError,
    isRefetching,
    isLoading
  } = useQuery({
    queryKey: ['table-data'],
    queryFn: async () => {
      const fetchURL = new URL(
        `${apiRoutes.manifest}/Facility/Latest/${user?.OrgUnit}/${user?.OrgUnitValue}?page=1&pageSize=5000`
      );
      const response = await fetch(fetchURL.href);
      return await response.json();
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
        accessorFn: (row) => {
          const date = parseISO(row?.dispatch?.dateProcessed);
          return formatDistanceToNow(date, { addSuffix: true });
        },
        enableColumnFilter: false
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        accessorFn: (row) => {
          return row?.manifest?.isAccepted ? 'SUCCESS' : 'FAILURE';
        },
        enableColumnFilter: true
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
            setFacilityId(row.original.facilityId);
          }}
        >
          <LinkOutlinedIcon />
        </IconButton>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex' }}>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Download Data
        </Button>
      </Box>
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
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseFullscreenOutlinedIcon />
        </IconButton>
        <FacilityDetails facilityId={facilityId} />
      </Dialog>
    </Container>
  );
};
export default Facility;
