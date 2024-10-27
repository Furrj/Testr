import route_prefix from "../../../route_prefix";

const url = route_prefix("/register/teacher/email");

export type T_PARAMS = {
	email: string;
};

export type T_RES = {
	is_sent: boolean;
	already_exists: boolean;
};

async function SUBMIT_TEACHER_EMAIL(params: T_PARAMS): Promise<T_RES> {
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

	const data: T_RES = await res.json();
	return data;
}

export default SUBMIT_TEACHER_EMAIL;
