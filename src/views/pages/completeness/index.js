import React, { useMemo } from 'react';
import { Container, Box, Typography, Button, Chip } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DownloadForOfflineTwoToneIcon from '@mui/icons-material/DownloadForOfflineTwoTone';
import MainCard from 'ui-component/cards/MainCard';

import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';

import { useQuery } from '@tanstack/react-query';
import { getMostRecentFacilityDispatchTable } from 'api/d2d-api';
import useKeyCloakAuth from '../../../hooks/useKeyCloakAuth';
import format from 'date-fns/format';
import { download, generateCsv, mkConfig } from 'export-to-csv';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true
});

const Completeness = () => {
  const user = useKeyCloakAuth();
  const getCompleteness = (lastVisitDate, facilityType) => {
    const currentDate = new Date(2024, 8, 30);
    const diffTime = currentDate - lastVisitDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const slowFacilityTypes = [
      'Mobile',
      'Correctional Centre',
      'Hospital',
      'Health Post',
      'Non-Medical Site'
    ];
    if (slowFacilityTypes.includes(facilityType)) {
      return diffDays <= 27 ? 'Up To Date' : 'Chase Latest Dispatch';
    } else return diffDays <= 7 ? 'Up To Date' : 'Chase Latest Dispatch';
  };
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => ({
      Province: row.original.orgHierarchy.provinceName,
      District: row.original.orgHierarchy.districtName,
      'Sub District': row.original.orgHierarchy.subDistrictName,
      Facility: row.original.facilityName,
      UID: row.original.dhisUid,
      'MHFL Code': row.original.mflCode,
      'Facility Type': row.original.facilityType,
      'Last ART Visit Captured': row.original.lastVisitDate
        ? format(new Date(row.original.lastVisitDate), 'd MMM yyyy')
        : '',
      Completeness: getCompleteness(
        new Date(row.original.lastVisitDate),
        row.original.facilityType
      ),
      'App Version At Dispatch': row.original.dispatch.version,
      'KP Site': row.original.kpSite ? 'Yes' : 'No',
      Patients: row.original.dispatchPatients,
      'PEPFAR Flag': row.original.pepfarSupported ? 'Yes' : 'No',
      'Site Status': row.original.isActive ? 'Active' : 'Inactive'
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
      return data.data
        .filter((row) => row.expectedToReport === true)
        .sort((a, b) => {
          const dateA = new Date(a.dateProcessed);
          const dateB = new Date(b.dateProcessed);
          return dateA - dateB;
        });
    },
    enabled: !!user.OrgUnit && !!user.OrgUnitValue
  });

  const columns = useMemo(
    () => [
      {
        header: 'Province',
        accessorKey: 'province',
        accessorFn: (row) => row?.orgHierarchy?.provinceName
      },
      {
        header: 'District',
        accessorKey: 'district',
        accessorFn: (row) => row?.orgHierarchy?.districtName
      },
      {
        header: 'Sub District',
        accessorKey: 'subDistrict',
        accessorFn: (row) => row?.orgHierarchy?.subDistrictName
      },
      {
        header: 'Facility',
        accessorKey: 'facilityName'
      },
      {
        header: 'UID',
        accessorKey: 'dhisUid'
      },
      {
        header: 'MHFL Code',
        accessorKey: 'mflCode'
      },
      {
        header: 'Facility Type',
        accessorKey: 'facilityType'
      },
      {
        header: 'Last ART Visit Captured',
        accessorKey: 'lastVisitDate',
        accessorFn: (row) =>
          row?.lastVisitDate
            ? format(new Date(row?.lastVisitDate), 'dd/MMM/yyyy')
            : ''
      },
      {
        header: 'Completeness',
        accessorKey: 'Completeness',
        accessorFn: (row) => {
          return getCompleteness(
            new Date(row?.lastVisitDate),
            row?.facilityType
          );
        },
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Chip
              label={value}
              color={value === 'Up To Date' ? 'success' : 'warning'}
            />
          );
        }
      },
      /*{
        header: 'In Report',
        accessorKey: 'isRecentQuarter'
      },*/
      {
        header: 'App Version At Dispatch',
        accessorKey: 'appVersionAtDispatch',
        accessorFn: (row) => row?.dispatch?.version
      },
      {
        header: 'KP Site',
        accessorKey: 'KPSite',
        accessorFn: (row) => (row?.kpSite ? 'Yes' : 'No')
      },
      {
        header: 'Patients',
        accessorKey: 'dispatchPatients'
      },
      {
        header: 'PEPFAR Flag',
        accessorKey: 'pepfarFlag',
        accessorFn: (row) => (row?.pepfarSupported ? 'Yes' : 'No')
      },
      {
        header: 'Site Status',
        accessorKey: 'siteStatus',
        accessorFn: (row) => (row?.isActive ? 'Active' : 'Inactive')
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
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

  return (
    <Container maxWidth="lg">
      <MainCard
        title={
          <Box display="flex" alignItems="center">
            <ChecklistIcon color="secondary" />
            <Typography variant="body" ml={1}>
              Completeness Report
            </Typography>
          </Box>
        }
      >
        <MaterialReactTable table={table} />
      </MainCard>
    </Container>
  );
};

export default Completeness;
