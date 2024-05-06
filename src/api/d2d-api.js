import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getDispatches = async ({ queryKey }) => {
    const [_key, page, pageSize] = queryKey;
    return await axios.get(`${apiRoutes.d2dApi}?page=${page}&pageSize=${pageSize}`);
};

export const getRunDeckInfo = async () => {
    return await axios.get(`https://rundeck.chi-sa.org/api/18/job/4094e4e6-1784-469e-bdaa-397096a49679/info?authtoken=XUFXoFhpjRZbsqxWpuaCWv7i16RXKuCY`)
};
