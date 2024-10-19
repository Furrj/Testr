import { FaEdit } from "react-icons/fa";
import { MdLockReset, MdDeleteForever } from "react-icons/md";
import { E_MODES } from "../../Locals";
import styles from "./Buttons.module.scss";

interface IProps {
	mode: {
		curr: E_MODES;
		set: React.Dispatch<React.SetStateAction<E_MODES>>;
	};
}

const Buttons: React.FC<IProps> = (props) => {
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

					<span>
						<MdDeleteForever
							className={styles.icon}
							id={styles.delete}
							onClick={() => props.mode.set(E_MODES.CONFIRM_DELETE)}
						/>
						<div className={styles.context} id={styles.last}>
							Delete
						</div>
					</span>
				</div>
			);
		case E_MODES.EDITING:
			return <div className={styles.root}></div>;
	}
};

export default Buttons;
