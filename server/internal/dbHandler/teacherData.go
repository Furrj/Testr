package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

const QGetTeacherDataByUserID = `
	SELECT user_id, periods
	FROM teachers.data
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetTeacherDataByUserID(UserID types.UserID) (types.TeacherData, error) {
	var TeacherData types.TeacherData
	err := dbHandler.Conn.QueryRow(context.Background(), QGetTeacherDataByUserID, UserID).Scan(
		&TeacherData.UserID,
		&TeacherData.Periods,
	)
	if err != nil {
		return TeacherData, err
	}
	return TeacherData, nil
}

// Inserts

const EInsertTeacherData = `
	INSERT INTO teachers.data(user_id, periods)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertTeacherData(teacherData types.TeacherData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertTeacherData,
		teacherData.UserID,
		teacherData.Periods,
	)
	if err != nil {
		return err
	}
	return nil
}
