import type { AxiosResponse } from "axios";

export type T_API_ROUTE = {
	url: string;
	method: (params: any) => Promise<AxiosResponse<any>>;
};
