import { createContext, useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "../utils/consts";

function getThemeFromLocalStorage(): E_DISPLAY_THEMES {
	const theme = localStorage.getItem(LOCAL_STORAGE_KEYS.display_theme);
	if (!theme || theme === "0") {
		return E_DISPLAY_THEMES.LIGHT;
	} else return E_DISPLAY_THEMES.DARK;
}

function setThemeInLocalStorage(v: E_DISPLAY_THEMES): void {
	localStorage.setItem(LOCAL_STORAGE_KEYS.display_theme, v.toString());
}

export enum E_DISPLAY_THEMES {
	LIGHT = 0,
	DARK,
}
export type T_CTX_OVERLAY = {
	is_showing: boolean;
	element: JSX.Element;
};
export type T_CTX_UI = {
	overlay: {
		curr: T_CTX_OVERLAY;
		set: React.Dispatch<React.SetStateAction<T_CTX_OVERLAY>>;
	};
	theme: {
		curr: E_DISPLAY_THEMES;
		set: React.Dispatch<React.SetStateAction<E_DISPLAY_THEMES>>;
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
	const [theme, setTheme] = useState<E_DISPLAY_THEMES>(
		getThemeFromLocalStorage(),
	);

	useEffect(() => {
		document.documentElement.classList.toggle(
			"theme-dark",
			theme === E_DISPLAY_THEMES.DARK,
		);

		setThemeInLocalStorage(theme);
	}, [theme]);

	return (
		<ctxUI.Provider
			value={{
				overlay: { curr: ctxOverlay, set: setCtxOverlay },
				theme: { curr: theme, set: setTheme },
			}}
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
