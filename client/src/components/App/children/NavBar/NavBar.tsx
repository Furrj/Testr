import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { USER_ROLES } from "../../../../utils/consts";
import { IoMdSettings } from "react-icons/io";
import { useCtxUser } from "../../../../contexts/UserProvider";
import { ProtectedLink } from "./children/ProtectedLink/ProtectedLink";
import { E_MEMBERSHIP_TYPES } from "../../../../types/users";

const NavBar: React.FC = () => {
	const user = useCtxUser();
	const userData = user.user.curr;

	return (
		<nav className={styles.root}>
			<div className={styles.top}>
				<ProtectedLink
					text="Home"
					url="/"
					allowedMemberShipTypes={[
						E_MEMBERSHIP_TYPES.BASIC,
						E_MEMBERSHIP_TYPES.PREMIUM,
					]}
					allowedRoles={[
						USER_ROLES.BASE,
						USER_ROLES.ADMIN,
						USER_ROLES.TEACHER,
						USER_ROLES.STUDENT,
					]}
					requiredLogin={true}
					requiredActive={true}
				/>

				<ProtectedLink
					text="Play"
					url="/game"
					allowedMemberShipTypes={[
						E_MEMBERSHIP_TYPES.UNVALIDATED,
						E_MEMBERSHIP_TYPES.VALIDATED,
						E_MEMBERSHIP_TYPES.BASIC,
						E_MEMBERSHIP_TYPES.PREMIUM,
					]}
					allowedRoles={[
						USER_ROLES.BASE,
						USER_ROLES.ADMIN,
						USER_ROLES.TEACHER,
						USER_ROLES.STUDENT,
					]}
					requiredLogin={false}
					requiredActive={false}
				/>

				<ProtectedLink
					text="Assignments"
					url="/assignments"
					allowedMemberShipTypes={[
						E_MEMBERSHIP_TYPES.VALIDATED,
						E_MEMBERSHIP_TYPES.BASIC,
						E_MEMBERSHIP_TYPES.PREMIUM,
					]}
					allowedRoles={[
						USER_ROLES.ADMIN,
						USER_ROLES.TEACHER,
						USER_ROLES.STUDENT,
					]}
					requiredLogin={true}
					requiredActive={true}
				/>

				<ProtectedLink
					text="Stats"
					url="/stats"
					allowedMemberShipTypes={[
						E_MEMBERSHIP_TYPES.BASIC,
						E_MEMBERSHIP_TYPES.PREMIUM,
					]}
					allowedRoles={[
						USER_ROLES.BASE,
						USER_ROLES.ADMIN,
						USER_ROLES.TEACHER,
						USER_ROLES.STUDENT,
					]}
					requiredLogin={true}
					requiredActive={true}
				/>

				<ProtectedLink
					text="Classes"
					url="/teacher/clases"
					allowedMemberShipTypes={[E_MEMBERSHIP_TYPES.PREMIUM]}
					allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}
					requiredLogin={true}
					requiredActive={true}
				/>
			</div>

			<div className={styles.bottom}>
				<div className={styles.link}>
					<div id={styles.username}>
						{user.status.curr.is_logged_in ? (
							<span>{userData.username}</span>
						) : (
							<span>Guest</span>
						)}
						<Link to={"/settings"}>
							<IoMdSettings />
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
