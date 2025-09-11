import axios from "axios";
import { getBackendURL } from "../services/config";

const api = axios.create({
	baseURL: getBackendURL(),
	withCredentials: true,
	timeout: 30000, // 30 segundos
});

export const openApi = axios.create({
	baseURL: getBackendURL(),
	timeout: 30000, // 30 segundos
});

export default api;
