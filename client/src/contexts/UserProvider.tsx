import { createContext, useContext, useEffect, useState } from "react";
import {
	clearTokensFromLocalStorage,
	deepCopyObject,
	getUserSessionDataFromStorage,
} from "../utils/methods";
import {
	INIT_USER,
	INIT_USER_STATUS,
	T_USER,
	T_USER_STATUS,
} from "../types/users";
import useUserDataQuery from "../queries/userDataQuery";
import { useQueryClient } from "@tanstack/react-query";

export type T_CTX_USER = {
	user: {
		curr: T_USER;
		set: React.Dispatch<React.SetStateAction<T_USER>>;
	};
	status: {
		curr: T_USER_STATUS;
		set: React.Dispatch<React.SetStateAction<T_USER_STATUS>>;
	};
};
const ctxUser = createContext<T_CTX_USER | undefined>(undefined);

interface IProps {
	children: React.ReactNode;
}

export const UserProvider: React.FC<IProps> = (props) => {
	const [userData, setUserData] = useState<T_USER>(deepCopyObject(INIT_USER));
	const [status, setStatus] = useState<T_USER_STATUS>({ ...INIT_USER_STATUS });

	const { data, isFetched, isSuccess, isFetching } = useUserDataQuery(
		getUserSessionDataFromStorage(),
	);

	// sync isFetching with status
	useEffect(() => {
		if (isFetching !== status.is_fetching)
			setStatus((c) => {
				return { ...c, is_fetching: isFetching };
			});
	}, [isFetching]);

	// if successful validation, set user and logged in
	useEffect(() => {
		if (isFetched && isSuccess && data !== undefined) {
			setStatus((c) => {
				return { ...c, is_logged_in: true };
			});
			setUserData(data.user);
		}
	}, [isFetched, isSuccess]);

	// set to default User data and clear tokens when logged out
	const queryClient = useQueryClient();
	useEffect(() => {
		if (isSuccess && !status.is_logged_in) {
			clearTokensFromLocalStorage();
			setUserData(deepCopyObject(INIT_USER));
			queryClient.resetQueries();
		}
	}, [status.is_logged_in, isSuccess]);

	return (
		<ctxUser.Provider
			value={{
				user: { curr: userData, set: setUserData },
				status: { curr: status, set: setStatus },
			}}
		>
			{props.children}
		</ctxUser.Provider>
	);
};

export const useCtxUser = (): T_CTX_USER => {
	const ctx = useContext(ctxUser);

	if (ctx === undefined) {
		const msg = "intialization error: ctxUser undefined ";
		console.log(msg);
		throw new Error(msg);
	} else return ctx;
};

export default UserProvider;
