import styles from "./Selection.module.scss";
import { useQuery } from "@tanstack/react-query";
import { apiRequestGetStudents } from "../../../../../requests";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import Loading from "../../../Loading/Loading";
import { useState } from "react";
import { Link } from "react-router-dom";

interface IProps {
	activeStudentID: {
		curr: number;
		set: React.Dispatch<React.SetStateAction<number>>;
	};
}

const Selection: React.FC<IProps> = (props) => {
	const [currentPeriod, setCurrentPeriod] = useState<number>(1);

	// fetch students
	const { isPending, isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.STUDENTS],
		queryFn: () => apiRequestGetStudents(getUserSessionDataFromStorage()),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	if (isPending) {
		return <Loading />;
	} else if (isSuccess && data && data.data.length > 0) {
		return (
			<div className={styles.root}>
				<div className={styles.period_select}>
					<label htmlFor="periods">Period: </label>
					<select
						name="periods"
						id="periods"
						onChange={(e) => setCurrentPeriod(Number.parseInt(e.target.value))}
					>
						{data?.data.map((_, i) => {
							return (
								<option key={`period_${i + 1}`} value={i + 1}>
									{i + 1}
								</option>
							);
						})}
					</select>
				</div>
				<div className={styles.students}>
					<div className={styles.scroll}>
						{data.data[currentPeriod - 1].map((student, i) => {
							return (
								<Link
									className={styles.link}
									to={"/teacher/student"}
									key={`period-${currentPeriod}-student-${i}`}
									onClick={() =>
										props.activeStudentID.set((_) => student.user_id)
									}
								>
									<div className={styles.student}>
										{student.last_name}, {student.first_name}
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		);
	} else {
		return <div className={styles.root}>Error, please refresh</div>;
	}
};

export default Selection;
