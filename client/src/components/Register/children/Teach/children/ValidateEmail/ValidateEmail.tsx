import { useSearchParams } from "react-router-dom";
import styles from "./ValidateEmail.module.scss";
import Locals from "./Locals";
import Loading from "../../../../../Loading/Loading";

const ValidateEmail: React.FC = () => {
	const [params] = useSearchParams();
	const code = params.get("code");
	const email = params.get("email");

	if (!code || code === "" || !email || email === "") {
		alert("error, please refresh");
		return;
	}

	const validateEmailQuery = Locals.useValidateEmailQuery({
		code,
		email,
	});

	if (validateEmailQuery.isFetching) {
		return <Loading />;
	} else if (
		validateEmailQuery.isSuccess &&
		validateEmailQuery.data !== undefined
	) {
		console.log(validateEmailQuery.data);
		if (validateEmailQuery.data.is_valid) {
			return <div>Valid!</div>;
		} else {
			return <div>This link is expired, please request a new one</div>;
		}
	} else return <div>Error, please reload</div>;
};

export default ValidateEmail;
