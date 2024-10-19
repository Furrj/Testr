import { T_STUDENT_DATA } from "../../../../../../../../types/users";
import { E_MODES, T_EDITED_STUDENT_INFO } from "../../Locals";
import styles from "./EditNames.module.scss";

interface IProps {
	mode: E_MODES;
	student: T_STUDENT_DATA;
	editedStudentInfo: {
		curr: T_EDITED_STUDENT_INFO;
		set: React.Dispatch<React.SetStateAction<T_EDITED_STUDENT_INFO>>;
	};
}

const EditNames: React.FC<IProps> = (props) => {
	return (
		<div className={styles.root}>
			{props.mode === E_MODES.DISPLAY ? (
				<>
					<div style={{ fontSize: "1.5rem" }}>
						{props.student.last_name}, {props.student.first_name}
					</div>
					<div>{props.student.username}</div>
				</>
			) : (
				<form className={styles.edit}>
					<label htmlFor="first_name">First Name</label>
					<input
						id="first_name"
						name="first_name"
						type="text"
						placeholder="first name"
						autoComplete="off"
						value={props.editedStudentInfo.curr.first_name}
					/>

					<label htmlFor="last_name">Last Name</label>
					<input
						type="text"
						placeholder="last name"
						id="last_name"
						name="last_name"
						autoComplete="off"
						value={props.editedStudentInfo.curr.last_name}
					/>

					<label htmlFor="username">Username</label>
					<input
						type="text"
						placeholder="username"
						autoComplete="off"
						id="username"
						name="username"
						value={props.editedStudentInfo.curr.username}
					/>
				</form>
			)}
		</div>
	);
};

export default EditNames;
