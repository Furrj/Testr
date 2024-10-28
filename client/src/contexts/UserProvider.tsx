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
import { T_TOKENS } from "../types/auth";

export type T_CTX_USER = {
	user: {
		curr: T_USER;
		set: React.Dispatch<React.SetStateAction<T_USER>>;
	};
	status: {
		curr: T_USER_STATUS;
		set: React.Dispatch<React.SetStateAction<T_USER_STATUS>>;
		logout: () => void;
	};
	tokens: {
		curr: T_TOKENS | undefined;
		set: React.Dispatch<React.SetStateAction<T_TOKENS | undefined>>;
	};
};
const ctxUser = createContext<T_CTX_USER | undefined>(undefined);

interface IProps {
	children: React.ReactNode;
}

function logoutUser(
	setTokens: React.Dispatch<React.SetStateAction<T_TOKENS | undefined>>,
	setUserData: React.Dispatch<React.SetStateAction<T_USER>>,
	setStatus: React.Dispatch<React.SetStateAction<T_USER_STATUS>>,
) {
	console.log("running logout user");
	clearTokensFromLocalStorage();
	setTokens(undefined);
	setStatus((c) => {
		return {
			...c,
			is_logged_in: false,
		};
	});
	setUserData(deepCopyObject(INIT_USER));
}

export const UserProvider: React.FC<IProps> = (props) => {
	const [userData, setUserData] = useState<T_USER>(deepCopyObject(INIT_USER));
	const [status, setStatus] = useState<T_USER_STATUS>({ ...INIT_USER_STATUS });
	const [tokens, setTokens] = useState<T_TOKENS | undefined>(
		getUserSessionDataFromStorage(),
	);

	const { data, isFetched, isSuccess, isFetching } = useUserDataQuery(tokens);

	// if successful validation, set user and logged in
	useEffect(() => {
		if (isSuccess && data !== undefined && data.valid) {
			console.log(data);
			setStatus((c) => {
				return { ...c, is_logged_in: true };
			});
			setUserData(data.user_data);
		}
	}, [isFetched, isSuccess]);

	// set to default User data and clear tokens when logged out
	useEffect(() => {
		if (status.is_logged_in && tokens === undefined) {
			clearTokensFromLocalStorage();
			setTokens(undefined);
		}
	}, [tokens]);

	return (
		<ctxUser.Provider
			value={{
				user: { curr: userData, set: setUserData },
				status: {
					curr: {
						is_logged_in: status.is_logged_in,
						is_fetching: isFetching,
					},
					set: setStatus,
					logout: () => logoutUser(setTokens, setUserData, setStatus),
				},
				tokens: { curr: tokens, set: setTokens },
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
