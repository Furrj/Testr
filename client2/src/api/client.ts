import type { paths } from "../types/schema";
import createClient from "openapi-fetch";

const baseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

const apiClient = createClient<paths>({ baseUrl });

export default apiClient;
