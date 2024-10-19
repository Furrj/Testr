import styles from "./ChangeClass.module.scss";
import { useState } from "react";
import { E_MODES } from "../../Locals";
import { T_CLASS } from "../../../../../../../../types/teacherData";

interface IProps {
	cl: T_CLASS;
	classes: T_CLASS[];
	mode: E_MODES;
}

const ChangeClass: React.FC<IProps> = (props) => {
	switch (props.mode) {
		case E_MODES.DISPLAY:
			return <div className={styles.root}>{props.cl.name} </div>;
		case E_MODES.EDITING:
			return (
				<div className={styles.root}>
					<select name="class_select" id="class_select">
						{props.classes.map((cl) => {
							return (
								<option value={cl.class_id} key={cl.class_id}>
									{cl.name}
								</option>
							);
						})}
					</select>
				</div>
			);
	}
};

export default ChangeClass;
