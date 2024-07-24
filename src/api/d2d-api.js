import { apiRoutes } from '../apiRoutes';
import axios from 'axios';

export const getDispatches = async ({ queryKey }) => {
  const [, page, pageSize, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.d2dApi}?page=${page}&pageSize=${pageSize}`
  );
};

export const getSubDistricts = async ({ queryKey }) => {
  const [, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(`${apiRoutes.subDistricts}?page=1&pageSize=300`);
};

export const getPreviousExecutionInfo = async () => {
  return await axios.get(
    //`https://automate.provshare.health.gov.za/api/46/job/8231b4ce-cf84-4765-91fe-b8df4e5cbda8/executions?authtoken=s8AoeAn1w5UQxtrpQ6CwZvgYWJUcbrUF&max=1`
    `https://rundeck.chi-sa.org/api/14/job/f1e18eb3-da3a-4893-8504-1721e29e145d/executions?authtoken=kiu6jc0f7jiV2xiW0jyOjAYnMFNeZ0Fs&max=1`
  );
};

export const getNextExecutionTime = async () => {
  return await axios.get(
    //`https://automate.provshare.health.gov.za/api/46/job/8231b4ce-cf84-4765-91fe-b8df4e5cbda8/info?authtoken=s8AoeAn1w5UQxtrpQ6CwZvgYWJUcbrUF`
    `https://rundeck.chi-sa.org/api/46/job/f1e18eb3-da3a-4893-8504-1721e29e145d/info?authtoken=kiu6jc0f7jiV2xiW0jyOjAYnMFNeZ0Fs`
  );
};

export const getFacilityByOrgUnit = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.facilities}/${orgUnit}/${orgUnitValue}`
  );
};

export const getFacilityDetails = async ({ queryKey }) => {
  const [, facilityId, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        //console.log(token);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.manifest}/Facility/${facilityId}?historyPageSize=1000`
  );
};

export const getDashboardSummary = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.dashboard}/Summary/${orgUnit}/${orgUnitValue}`
  );
};

export const getRecencyAsAtDate = async ({ queryKey }) => {
  const [, date_as_at, orgUnit, orgUnitValue, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.dashboard}/Recency/${date_as_at}/${orgUnit}/${orgUnitValue}`
  );
};

export const getOwnerNotifications = async ({ queryKey }) => {
  const [, ownerId, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.dashboard}/Notifications/Owner/${ownerId}?page=1&pageSize=1000`
  );
};

export const getNotificationById = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(`${apiRoutes.dashboard}/Notification/${id}`);
};

export const notificationAcknowledged = async (values) => {
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (values.token) {
        config.headers.Authorization = `Bearer ${values.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.post(
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

export const getMostRecentFacilityDispatchTable = async ({ queryKey }) => {
  const [, orgUnit, orgUnitValue, token] = queryKey;
  const apiClient = axios.create();
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return await apiClient.get(
    `${apiRoutes.manifest}/Facility/Latest/${orgUnit}/${orgUnitValue}?page=1&pageSize=5000`
  );
};
