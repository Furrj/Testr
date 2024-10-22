import route_prefix from "../../route_prefix";

const url = route_prefix("/payment_intents");

export type T_PARAMS = {
	id: number;
};

async function DELETE_PAYMENT_INTENT(params: T_PARAMS): Promise<Response> {
	const res = await fetch(`${url}/${params.id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res;
}

export default DELETE_PAYMENT_INTENT;
