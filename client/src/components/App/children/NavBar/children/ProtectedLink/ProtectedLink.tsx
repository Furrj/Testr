import { Link, useLocation } from "react-router-dom";
import { useCtxUser } from "../../../../../../contexts/UserProvider";
import styles from "./ProtectedLink.module.scss";
import { FaLock } from "react-icons/fa";
import { E_MEMBERSHIP_TYPES } from "../../../../../../types/users";

interface IProps {
	text: string;
	url: string;
	allowedMemberShipTypes: number[];
	allowedRoles: string[];
	requiredLogin: boolean;
	requiredActive: boolean;
}
export const ProtectedLink: React.FC<IProps> = (props) => {
	const location = useLocation();
	const userCtx = useCtxUser();

	const allowed =
		props.allowedRoles.includes(userCtx.user.curr.role) &&
		props.allowedMemberShipTypes.includes(
			userCtx.user.curr.account.membership_type,
		) &&
		(!props.requiredLogin || userCtx.status.curr.is_logged_in) &&
		(!props.requiredActive || userCtx.user.curr.account.is_active);

	return (
		<Link to={props.url} className={styles.root}>
			<div
				className={`${location.pathname === props.url ? styles.current : ""} ${allowed ? "" : styles.locked}`}
			>
				{props.text}
			</div>
		</Link>
	);
};
