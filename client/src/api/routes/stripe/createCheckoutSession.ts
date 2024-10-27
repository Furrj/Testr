import { E_MEMBERSHIP_TYPES } from "../../../types/payment";
import route_prefix from "../../route_prefix";

const url = route_prefix("/checkout");

export type T_PARAMS = {
	membership_type: E_MEMBERSHIP_TYPES;
};

export type T_RES = {
	client_secret: string;
};

async function CREATE_CHECKOUT_SESSION(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default CREATE_CHECKOUT_SESSION;
