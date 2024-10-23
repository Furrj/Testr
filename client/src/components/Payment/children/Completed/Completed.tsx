import { useQuery } from "@tanstack/react-query";
import GET_CHECKOUT_SESSION_STATUS from "../../../../api/routes/stripe/getCheckoutSessionStatus";
import { Navigate } from "react-router-dom";
import { QUERY_KEYS } from "../../../../utils/consts";
import Loading from "../../../Loading/Loading";

const Completed: React.FC = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const sessionId = urlParams.get("session_id");
	if (!sessionId) {
		return <div>Error, please refresh</div>;
	}
	console.log(sessionId);

	const sessionStatusQuery = useQuery({
		queryKey: [QUERY_KEYS.CHECKOUT_SESSION_STATUS],
		queryFn: () => GET_CHECKOUT_SESSION_STATUS(sessionId),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});
	console.log(sessionStatusQuery.data);

	if (sessionStatusQuery.isLoading) {
		return <Loading />;
	} else if (
		sessionStatusQuery.isSuccess &&
		sessionStatusQuery.data !== undefined
	) {
		if (sessionStatusQuery.data.status === "open") {
			return <Navigate to={"/checkout"} />;
		} else if (sessionStatusQuery.data.status === "completed") {
			return <div>Congrats! Thank you for subscribing.</div>;
		}
	} else {
		alert("Error, please refresh");
		return;
	}
};

export default Completed;
