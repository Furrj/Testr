import { E_MEMBERSHIP_TYPES } from "../../types/users";
import { USER_ROLES } from "../../utils/consts";
import { ProtectedLink } from "../App/children/SideNavBar/children/ProtectedLink/ProtectedLink";

const NavLinks = () => {
	return (
		<>
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
		</>
	);
};

export default NavLinks;
