import { createContext, useContext, useEffect, useState } from "react";
import { T_TOKENS } from "../types";
import { getUserSessionDataFromStorage } from "../utils/methods";

export type T_AUTH = {
	tokens: {
		curr: T_TOKENS;
		set: React.Dispatch<React.SetStateAction<T_TOKENS | undefined>>;
	};
	valid: boolean;
};

const AuthCtx = createContext<T_AUTH | undefined>(undefined);

interface IProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<IProps> = (props) => {
	const [tokens, setTokens] = useState<T_TOKENS | undefined>(
		getUserSessionDataFromStorage(),
	);
	const [valid, setValid] = useState<boolean>(false);

	useEffect(() => {
		if (valid && tokens === undefined) {
			setValid(false);
		} else if (!valid && tokens !== undefined) {
			setValid(true);
		}
	}, [tokens]);

	return (
		<AuthCtx.Provider
			value={{ tokens: { curr: tokens as T_TOKENS, set: setTokens }, valid }}
		>
			{props.children}
		</AuthCtx.Provider>
	);
};

export const useAuthCtx = (): T_AUTH => {
	const ctx = useContext(AuthCtx);

	if (ctx === undefined) {
		console.log("AuthCtx is undefined");
		throw new Error("AuthCtx is undefined");
	} else return ctx;
};

export default AuthProvider;
