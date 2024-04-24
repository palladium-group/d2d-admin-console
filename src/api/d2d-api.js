import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const getDispatches = async ({ queryKey }) => {
    const [_key, page, pageSize] = queryKey;
    return await axios.get(`${apiRoutes.d2dApi}?page=${page}&pageSize=${pageSize}`);
};
