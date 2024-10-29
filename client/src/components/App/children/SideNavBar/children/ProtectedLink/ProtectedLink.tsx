import { NavLink } from "react-router-dom";
import { useCtxUser } from "../../../../../../contexts/UserProvider";
import styles from "./ProtectedLink.module.scss";
import { FaLock } from "react-icons/fa";

interface IProps {
	text: string;
	url: string;
	allowedMemberShipTypes: number[];
	allowedRoles: string[];
	requiredLogin: boolean;
	requiredActive: boolean;
}
export const ProtectedLink: React.FC<IProps> = (props) => {
	const userCtx = useCtxUser();

	const allowed =
		props.allowedRoles.includes(userCtx.user.curr.role) &&
		props.allowedMemberShipTypes.includes(
			userCtx.user.curr.account.membership_type,
		) &&
		(!props.requiredLogin || userCtx.status.curr.is_logged_in) &&
		(!props.requiredActive || userCtx.user.curr.account.is_active);

	return (
		<NavLink to={props.url} className={styles.root}>
			{({ isActive }) => (
				<div className={isActive ? styles.active : ""}>
					{props.text}

					<div className={allowed ? styles.allowed : styles.locked}>
						<FaLock className={styles.lock} />
					</div>
				</div>
			)}
		</NavLink>
	);
};
