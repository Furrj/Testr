import { T_FORM_REGISTER_TEACHER } from "../../../../../../types/register";
import Locals from "./Locals";
import styles from "./TeacherForm.module.scss";

interface IProps {
	setTeacherData: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_TEACHER>>;
}

const TeacherForm: React.FC<IProps> = (props) => {
	const teacherForm = Locals.useTeacherForm(props.setTeacherData);

	return (
		<form
			className={styles.root}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				teacherForm.handleSubmit();
			}}
		>
			<teacherForm.Field
				name="school"
				children={(field) => (
					<>
						<h2>School</h2>
						<input
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className={field.state.meta.errors.length > 0 ? styles.err : ""}
							type="text"
							inputMode="text"
						/>
						{field.state.meta.errors ? (
							<div className={styles.err}>
								{field.state.meta.errors.join(", ")}
							</div>
						) : null}
					</>
				)}
				validators={{
					// onChange: ({ value }) => {
					//
					//   return undefined;
					// },
					onSubmit: ({ value }) => {
						return value === "" ? "Cannot be empty" : undefined;
					},
				}}
			/>

			<button type="submit">Next</button>
		</form>
	);
};

export default TeacherForm;
