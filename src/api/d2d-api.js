import { apiRoutes } from '../apiRoutes';
import axios from 'axios';

export const getDispatches = async ({ queryKey }) => {
  const [, page, pageSize] = queryKey;
  return await axios.get(
    `${apiRoutes.d2dApi}?page=${page}&pageSize=${pageSize}`
  );
};

export const getRunDeckInfo = async () => {
  return await axios.get(
    `https://rundeck.chi-sa.org/api/18/job/4094e4e6-1784-469e-bdaa-397096a49679/info?authtoken=XUFXoFhpjRZbsqxWpuaCWv7i16RXKuCY`
  );
};

export const getNextExecutionTime = async () => {
  return await axios.get(
    `https://rundeck.chi-sa.org/api/46/job/4094e4e6-1784-469e-bdaa-397096a49679/info?authtoken=4TU6fBXNWL6i2y9m3TIkTWoiIJOAaQQC`
  );
};

export const getFacilityByOrgUnit = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(`${apiRoutes.facilities}/${orgUnit}/${orgUnitValue}`);
};

export const getFacilityDetails = async ({ queryKey }) => {
  const [, facilityId] = queryKey;
  return await axios.get(
    `${apiRoutes.manifest}/Facility/${facilityId}?historyPageSize=1`
  );
};

export const getDashboardSummary = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(
    `${apiRoutes.dashboard}/Summary/${orgUnit}/${orgUnitValue}`
  );
};

export const getManifestLatest = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(
    `${apiRoutes.manifest}/Facility/Latest/${orgUnit}/${orgUnitValue}`
  );
};
