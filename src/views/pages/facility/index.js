import React, { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getMostRecentFacilityDispatchTable } from 'api/d2d-api';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import MainCard from '../../../ui-component/cards/MainCard';
import FacilityDetails from './FacilityDetails';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
//import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReadMoreRoundedIcon from '@mui/icons-material/ReadMoreRounded';
import Chip from '@mui/material/Chip';
import { FolderZipTwoTone } from '@mui/icons-material';
import DownloadForOfflineTwoToneIcon from '@mui/icons-material/DownloadForOfflineTwoTone';

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
      'Date Processed': format(
        new Date(row.original.dispatch?.dateProcessed),
        'd MMM yyyy'
      ),
      'Last Visit  Date': format(
        new Date(row.original.lastVisitDate),
        'd MMM yyyy'
      ),
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
    queryKey: ['table-data', user.OrgUnit, user.OrgUnitValue, user.token],
    queryFn: async (queryKey) => {
      const data = await getMostRecentFacilityDispatchTable(queryKey);
      return data.data.sort((a, b) => {
        const dateA = new Date(a.dateProcessed);
        const dateB = new Date(b.dateProcessed);
        return dateA - dateB;
      });
      /*const fetchURL = new URL(
        `${apiRoutes.manifest}/Facility/Latest/${user?.OrgUnit}/${user?.OrgUnitValue}?page=1&pageSize=5000`
      );
      const response = await fetch(fetchURL.href);
      return await response.json();
      */
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });

  const getRecencyStatus = (row) => {
    const currentDate = new Date(2024, 8, 30);
    const diffTime = currentDate - new Date(row?.lastVisitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const slowFacilityTypes = [
      'Mobile',
      'Correctional Centre',
      'Hospital',
      'Health Post',
      'Non-Medical Site'
    ];
    if (
      row?.manifest?.isAccepted &&
      slowFacilityTypes.includes(row?.facilityType) &&
      row?.expectedToReport
    ) {
      return diffDays <= 27 ? 'SUCCESS' : 'STALE';
    } else if (
      row?.manifest?.isAccepted &&
      !slowFacilityTypes.includes(row?.facilityType) &&
      row?.expectedToReport
    ) {
      return diffDays <= 7 ? 'SUCCESS' : 'STALE';
    } else if (row?.manifest?.isAccepted && !row?.expectedToReport) {
      return 'SUCCESS';
    } else if (!row?.manifest?.isAccepted) {
      return 'FAILURE';
    } else {
      return 'UNKNOWN';
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'facilityName',
        header: 'Facility'
      },
      {
        accessorKey: 'Dispatch File Name',
        header: 'Dispatch File Name',
        accessorFn: (row) => {
          const dispatchName = row?.dispatch?.name;
          return dispatchName ? dispatchName.replace(/_/g, ' ') : '';
        },
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
        accessorKey: 'dateProcessed', // Hidden column for sorting
        header: 'Date Processed (Hidden)',
        accessorFn: (row) => row?.dispatch?.dateProcessed,
        enableColumnFilter: false
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        accessorFn: (row) => {
          return getRecencyStatus(row);
        },
        Cell: ({ cell }) => {
          const status = cell.getValue();
          return status === 'SUCCESS' ? (
            <Chip label="SUCCESS" color="success" />
          ) : status === 'STALE' ? (
            <Chip label="STALE" color="warning" />
          ) : (
            <Chip label="FAILURE" color="error" />
          );
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
      showColumnFilters: true,
      sorting: [{ id: 'dateProcessed', desc: true }],
      columnVisibility: { dateProcessed: false }
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
          <ReadMoreRoundedIcon />
        </IconButton>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex' }}>
        <Button
          variant="outlined"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<DownloadForOfflineTwoToneIcon />}
        >
          Download
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
      <MainCard
        title={
          <Box display="flex" alignItems="center">
            <FolderZipTwoTone color="secondary" />
            <Typography variant="body" ml={1}>
              Most Recent Facility Dispatches
            </Typography>
          </Box>
        }
      >
        <MaterialReactTable table={table} />
      </MainCard>
      <Dialog
        open={openDialog}
        fullWidth={true}
        onClose={handleClose}
        maxWidth="lg"
        sx={{
          '.MuiPaper-root': {
            padding: 0,
            overflow: 'auto'
          }
        }}
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
