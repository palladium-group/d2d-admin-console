import { apiRoutes } from '../apiRoutes';
import axios from 'axios';

export const getDispatches = async ({ queryKey }) => {
  const [, page, pageSize] = queryKey;
  return await axios.get(
    `${apiRoutes.d2dApi}?page=${page}&pageSize=${pageSize}`
  );
};

export const getPreviousExecutionInfo = async () => {
  return await axios.get(
    `https://rundeck.chi-sa.org/api/14/job/f1e18eb3-da3a-4893-8504-1721e29e145d/executions?authtoken=kiu6jc0f7jiV2xiW0jyOjAYnMFNeZ0Fs&max=1`
  );
};

export const getNextExecutionTime = async () => {
  return await axios.get(
    `https://rundeck.chi-sa.org/api/46/job/f1e18eb3-da3a-4893-8504-1721e29e145d/info?authtoken=kiu6jc0f7jiV2xiW0jyOjAYnMFNeZ0Fs`
  );
};

export const getFacilityByOrgUnit = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(`${apiRoutes.facilities}/${orgUnit}/${orgUnitValue}`);
};

export const getFacilityDetails = async ({ queryKey }) => {
  const [, facilityId] = queryKey;
  return await axios.get(
    `${apiRoutes.manifest}/Facility/${facilityId}?historyPageSize=1000`
  );
};

export const getDashboardSummary = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(
    `${apiRoutes.dashboard}/Summary/${orgUnit}/${orgUnitValue}`
  );
};

export const getRecencyAsAtDate = async ({ queryKey }) => {
  const [, date_as_at, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(
    `${apiRoutes.dashboard}/Recency/${date_as_at}/${orgUnit}/${orgUnitValue}`
  );
};

export const getOwnerNotifications = async ({ queryKey }) => {
  const [, ownerId] = queryKey;
  return await axios.get(
    `${apiRoutes.dashboard}/Notifications/Owner/${ownerId}?page=1&pageSize=1000`
  );
};

export const getNotificationById = async ({ queryKey }) => {
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.dashboard}/Notification/${id}`);
};

export const notificationAcknowledged = async (values) => {
  return await axios.post(
    `${apiRoutes.dashboard}/Notification/Acknowledged`,
    values
  );
};

export const getManifestLatest = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue] = queryKey;
  return await axios.get(
    `${apiRoutes.manifest}/Facility/Latest/${orgUnit}/${orgUnitValue}`
  );
};
