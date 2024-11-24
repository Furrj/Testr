import { createContext, useContext, useEffect, useState } from "react";
import type { components } from "../../types/schema";
import useGetUserInfoForClientQuery from "../../api/requests/user/getInfoForClient";

type T_USER = components["schemas"]["UserInfoForClient"] & {
	is_logged_in: boolean;
};

export type T_CTX_USER = {
	curr: T_USER;
	set: React.Dispatch<React.SetStateAction<T_USER>>;
};
const INIT_USER_INFO: T_USER = {
	user_id: -1,
	username: "",
	first_name: "",
	last_name: "",
	user_role: "S",
	is_logged_in: false,
};

interface IProps {
	children: React.ReactNode;
}

const userCtx = createContext<T_CTX_USER | undefined>(undefined);
export const UserProvider: React.FC<IProps> = (props) => {
	const [state, setState] = useState<T_USER>({ ...INIT_USER_INFO });
	const { data } = useGetUserInfoForClientQuery();

	useEffect(() => {
		if (data && data.data !== undefined) {
			setState(() => ({ ...data.data, is_logged_in: true }));
		}
	}, [data]);

	return (
		<userCtx.Provider value={{ curr: state, set: setState }}>
			{props.children}
		</userCtx.Provider>
	);
};

export const useCtxUser = (): T_CTX_USER => {
	const ctx = useContext(userCtx);

	if (ctx === undefined) {
		const msg = "intialization error: userCtx undefined ";
		console.log(msg);
		throw Error(msg);
	} else return ctx;
};
