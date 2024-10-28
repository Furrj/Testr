import styles from "./Login.module.scss";
import React, { useState } from "react";
import { FaPerson, FaLock } from "react-icons/fa6";
import { type T_USERINPUT_LOGIN, INIT_USERINPUT_LOGIN } from "../../types.ts";
import Locals from "./Locals.ts";
import { Link } from "react-router-dom";
import { useCtxUser } from "../../contexts/UserProvider.tsx";
import { useQueryClient } from "@tanstack/react-query";

const Login: React.FC = () => {
	const [userInput, setUserInuput] =
		useState<T_USERINPUT_LOGIN>(INIT_USERINPUT_LOGIN);
	const [error, setError] = useState<boolean>(false);
	const [incorrectInfo, setIncorrectInfo] = useState<boolean>(false);

	const userCtx = useCtxUser();
	const queryClient = useQueryClient();
	const loginMutation = Locals.useLoginMutation(
		userCtx.tokens.set,
		setIncorrectInfo,
		queryClient,
	);

	// INPUT HANDLER
	const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (incorrectInfo) setIncorrectInfo(false);

		setUserInuput({
			...userInput,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<form
			id={styles.login_root}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();

				loginMutation.mutate(userInput);
			}}
		>
			<div className={styles.inputs}>
				<div className={styles.input}>
					<div>
						<FaPerson />
					</div>
					<input
						type="text"
						name="username"
						value={userInput.username}
						onChange={inputHandler}
						placeholder="Username"
						autoComplete="on"
						required={true}
					/>
				</div>
				<br />

				<div className={styles.input}>
					<div>
						<FaLock />
					</div>
					<input
						type="password"
						name="password"
						id="passwordBox"
						value={userInput.password}
						onChange={inputHandler}
						placeholder="Password"
						autoComplete="on"
						required={true}
					/>
				</div>
			</div>

			<div className={styles.forgot_password}>Forgot Password?</div>

			{incorrectInfo && (
				<div style={{ color: "red", marginTop: "10px" }}>
					Information was incorrect
				</div>
			)}

			{error && (
				<div>
					<div>Error, Please Try Again</div>
					<br />
				</div>
			)}

			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
