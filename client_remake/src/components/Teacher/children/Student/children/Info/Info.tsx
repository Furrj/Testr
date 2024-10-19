import { useState } from "react";
import styles from "./Info.module.scss";
import { E_MODES, T_EDITED_STUDENT_INFO } from "./Locals";
import { type T_STUDENT_DATA } from "../../../../../../types/users";
import { type T_CLASS } from "../../../../../../types/teacherData";
import ChangeClass from "./children/ChangeClass/ChangeClass";
import Confirm from "./children/Confirm/Confirm";
import EditNames from "./children/EditNames/EditNames";
import Buttons from "./children/Buttons/Buttons";

interface IProps {
	student: T_STUDENT_DATA;
	cl: T_CLASS;
	classes: T_CLASS[];
}

const Info: React.FC<IProps> = (props) => {
	const [mode, setMode] = useState<E_MODES>(E_MODES.DISPLAY);
	const [editedStudentInfo, setEditedStudentInfo] =
		useState<T_EDITED_STUDENT_INFO>({
			first_name: props.student.first_name,
			last_name: props.student.last_name,
			username: props.student.username,
		});

	return (
		<>
			<section className={styles.root}>
				<EditNames
					mode={mode}
					student={props.student}
					editedStudentInfo={{
						curr: editedStudentInfo,
						set: setEditedStudentInfo,
					}}
				/>

				<ChangeClass cl={props.cl} classes={props.classes} mode={mode} />

				<Buttons mode={{ curr: mode, set: setMode }} />
			</section>

			{mode === E_MODES.CONFIRM_DELETE && (
				<Confirm
					cl={props.cl}
					student={props.student}
					mode={{ curr: mode, set: setMode }}
				/>
			)}
		</>
	);
};

export default Info;
