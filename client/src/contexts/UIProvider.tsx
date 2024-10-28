import { createContext, useContext, useState } from "react";

export type T_CTX_OVERLAY = {
	is_showing: boolean;
	element: JSX.Element;
};
export type T_CTX_UI = {
	overlay: {
		curr: T_CTX_OVERLAY;
		set: React.Dispatch<React.SetStateAction<T_CTX_OVERLAY>>;
	};
};
const ctxUI = createContext<T_CTX_UI | undefined>(undefined);

interface IProps {
	children: React.ReactNode;
}

export const UIProvider: React.FC<IProps> = (props) => {
	const [ctxOverlay, setCtxOverlay] = useState<T_CTX_OVERLAY>({
		is_showing: false,
		element: <></>,
	});

	return (
		<ctxUI.Provider
			value={{ overlay: { curr: ctxOverlay, set: setCtxOverlay } }}
		>
			{props.children}
		</ctxUI.Provider>
	);
};

export const useCtxUI = (): T_CTX_UI => {
	const ctx = useContext(ctxUI);

	if (ctx === undefined) {
		const msg = "intialization error: ctxUser undefined ";
		console.log(msg);
		throw new Error(msg);
	} else return ctx;
};

export default UIProvider;
