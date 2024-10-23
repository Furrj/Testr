import route_prefix from "../../route_prefix";

const url = route_prefix("/checkout");

export type T_RES = {
	status: string;
	customer_email: string;
};

async function GET_CHECKOUT_SESSION_STATUS(id: string): Promise<T_RES> {
	const res = await fetch(`${url}/${id}`, {
		method: "GET",
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_CHECKOUT_SESSION_STATUS;
