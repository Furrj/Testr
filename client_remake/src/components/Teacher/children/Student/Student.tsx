import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import {
	apiRequestDeleteStudent,
	apiRequestGetClasses,
	apiRequestGetStudentInfo,
	apiRequestUpdateStudentClass,
	I_PARAMS_APIREQUEST_DELETE_STUDENT,
	I_PARAMS_APIREQUEST_UPDATE_STUDENT_CLASS,
} from "../../../../../requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Student.module.scss";
import { useEffect, useState } from "react";
import Loading from "../../../Loading/Loading";
import PastTest from "../../../PastTest/PastTest";
import { FaEdit, FaCheckCircle } from "react-icons/fa";
import { AxiosResponse } from "axios";
import { MdDeleteForever, MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface IProps {
	user_id: number;
}

const Student: React.FC<IProps> = (props) => {
	const [editingClass, setEditingClass] = useState<boolean>(false);
	const [classSelection, setClassSelection] = useState<number>(0);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const { isSuccess, isFetching, data } = useQuery({
		queryKey: [QUERY_KEYS.STUDENT_INFO],
		queryFn: () =>
			apiRequestGetStudentInfo({
				tokens: getUserSessionDataFromStorage(),
				user_id: props.user_id,
			}),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	const classData = useQuery({
		queryKey: [QUERY_KEYS.CLASSES],
		queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	const updateStudentClassMutation = useMutation({
		mutationFn: (
			params: I_PARAMS_APIREQUEST_UPDATE_STUDENT_CLASS,
		): Promise<AxiosResponse> => {
			return apiRequestUpdateStudentClass(params);
		},
		onError(err) {
			console.log(err);
			alert("Error, please refresh and try again");
		},
		onSuccess() {
			setEditingClass(false);
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_INFO] });
		},
	});

	const navigate = useNavigate();
	const deleteStudentMutation = useMutation({
		mutationFn: (
			params: I_PARAMS_APIREQUEST_DELETE_STUDENT,
		): Promise<AxiosResponse> => {
			return apiRequestDeleteStudent(params);
		},
		onError(err) {
			console.log(err);
			alert("Error, please refresh and try again");
		},
		onSuccess() {
			setShowDeleteConfirm(false);
			navigate("/teacher/class");
		},
	});

	// re-fetch data on props.user_id change
	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_INFO] });
	}, [props.user_id]);

	// set first in class list as selection on page load
	useEffect(() => {
		classData.data && setClassSelection(classData.data.data[0].class_id);
	}, [classData.data, classData.isSuccess]);

	if (isFetching) {
		return <Loading />;
	} else if (isSuccess && data.data && classData.data && classData.data.data) {
		return (
			<div className={styles.root}>
				<div className={styles.info}>
					<h2>
						{data.data.user_data.first_name} {data.data.user_data.last_name}
					</h2>
					<h3 className={styles.username}>{data.data.user_data.username}</h3>
					{editingClass ? (
						<div className={styles.classes}>
							<select
								className={styles.classes}
								name={"class_select"}
								id={"class_select"}
								value={classSelection}
								onChange={(e) =>
									setClassSelection(Number.parseInt(e.target.value))
								}
							>
								{classData.data.data.map((c) => {
									return (
										<option value={c.class_id} key={`$class-${c.class_id}`}>
											{c.name}
										</option>
									);
								})}
							</select>
							<button
								onClick={() =>
									updateStudentClassMutation.mutate({
										user_id: props.user_id,
										class_id: classSelection,
										tokens: getUserSessionDataFromStorage(),
									})
								}
							>
								Submit
							</button>
						</div>
					) : (
						<div className={styles.class}>
							<h3>{data.data.class.name}</h3>
							<div
								className={styles.edit}
								onClick={() => !editingClass && setEditingClass(true)}
							>
								<FaEdit />
							</div>
							<div
								className={styles.delete}
								onClick={() => setShowDeleteConfirm((c) => !c)}
							>
								<MdDeleteForever />
							</div>
						</div>
					)}

					{showDeleteConfirm && (
						<div className={styles.delete_confirm}>
							<h4>Are you sure?</h4>
							<div className={styles.icons}>
								<FaCheckCircle
									className={styles.check}
									onClick={() =>
										deleteStudentMutation.mutate({
											tokens: getUserSessionDataFromStorage(),
											user_id: props.user_id,
										})
									}
								/>
								<MdCancel
									className={styles.cancel}
									onClick={() =>
										showDeleteConfirm && setShowDeleteConfirm(false)
									}
								/>
							</div>
						</div>
					)}
				</div>

				<div className={styles.past_tests}>
					{data.data.sessions.length > 0 &&
						data.data.sessions.map((session, i) => {
							return <PastTest key={`test-${i}`} session={session} />;
						})}
				</div>
				<div className={styles.nav}></div>
			</div>
		);
	} else {
		return <div>Error, please refresh</div>;
	}
};

export default Student;
