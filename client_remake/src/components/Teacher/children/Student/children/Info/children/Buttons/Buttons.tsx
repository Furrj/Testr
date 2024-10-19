import { FaEdit } from "react-icons/fa";
import {
	MdLockReset,
	MdDeleteForever,
	MdCancel,
	MdCheckCircle,
} from "react-icons/md";
import { E_MODES } from "../../Locals";
import styles from "./Buttons.module.scss";
import { useEditedStudentInfoCtx } from "../../EditedStudentInfoProvider";

interface IProps {
	mode: {
		curr: E_MODES;
		set: React.Dispatch<React.SetStateAction<E_MODES>>;
	};
}

const Buttons: React.FC<IProps> = (props) => {
	const editedStudentInfoCtx = useEditedStudentInfoCtx();

	switch (props.mode.curr) {
		case E_MODES.DISPLAY:
			return (
				<div className={styles.root}>
					<span onClick={() => props.mode.set(E_MODES.EDITING)}>
						<FaEdit className={styles.icon} id={styles.edit} />
						<div className={styles.context}>Edit</div>
					</span>

					<span>
						<MdLockReset className={styles.icon} id={styles.reset} />
						<div className={styles.context}>Reset Password</div>
					</span>

					<span onClick={() => props.mode.set(E_MODES.CONFIRM_DELETE)}>
						<MdDeleteForever className={styles.icon} id={styles.delete} />
						<div className={styles.context} id={styles.last}>
							Delete
						</div>
					</span>
				</div>
			);
		case E_MODES.EDITING:
			return (
				<div className={styles.root}>
					<span onClick={() => console.log(editedStudentInfoCtx.curr)}>
						<MdCheckCircle className={styles.icon} id={styles.confirm} />
						<div className={styles.context}>Confirm</div>
					</span>

					<span onClick={() => props.mode.set(E_MODES.DISPLAY)}>
						<MdCancel className={styles.icon} id={styles.cancel} />
						<div className={styles.context} id={styles.last}>
							Cancel
						</div>
					</span>
				</div>
			);
	}
};

export default Buttons;
