import useLoginMutation from "../../api/requests/user/login";
import styles from "./Login.module.scss";

const Login: React.FC = () => {
	const { mutate } = useLoginMutation();
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();

				const formData = new FormData(e.target as HTMLFormElement);

				mutate({
					username: formData.get("username") as string,
					password: formData.get("password") as string,
				});
			}}
		>
			<label htmlFor="username">Username</label>
			<input type="text" id="username" name="username" minLength={1} required />

			<label htmlFor="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				minLength={1}
				required
			/>

			<button type="submit">submit</button>
		</form>
	);
};

export default Login;
