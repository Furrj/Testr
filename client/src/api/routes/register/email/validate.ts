import route_prefix from "../../../route_prefix";

const url = route_prefix("/register/teacher/validate");

export type T_PARAMS = {
  code: string;
  email: string;
};

export type T_RES = {
  data: {
    email: string;
  };
  is_valid: boolean;
};

async function VALIDATE_EMAIL(params: T_PARAMS): Promise<T_RES> {
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

export default VALIDATE_EMAIL;
