import route_prefix from "../../../route_prefix";

const url = route_prefix("/register/teacher/email");

export type T_PARAMS = {
	email: string;
};

async function SEND_VALIDATION_EMAIL(params: T_PARAMS): Promise<Response> {
	console.log(params);
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

	return res;
}

export default SEND_VALIDATION_EMAIL;
