import { useState } from "react";
import styles from "./Info.module.scss";
import { E_MODES } from "./Locals";
import { T_STUDENT_DATA } from "../../../../../../types/users";
import { T_CLASS } from "../../../../../../types/teacherData";
import ChangeClass from "./children/ChangeClass/ChangeClass";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface IProps {
	student: T_STUDENT_DATA;
	cl: T_CLASS;
	classes: T_CLASS[];
}

const Info: React.FC<IProps> = (props) => {
	const [mode, setMode] = useState<E_MODES>(E_MODES.DISPLAY);

	return (
		<section className={styles.root}>
			<div className={styles.box}>
				<div style={{ fontSize: "1.5rem" }}>
					{props.student.last_name}, {props.student.first_name}
				</div>
				<div>{props.student.username}</div>
			</div>
			<ChangeClass cl={props.cl} classes={props.classes} mode={mode} />
			<div className={styles.buttons}>
				<span>
					<MdDeleteForever className={styles.icon} id={styles.delete} />
				</span>
				<span>
					<FaEdit className={styles.icon} id={styles.edit} />
				</span>
			</div>
		</section>
	);
};

export default Info;
