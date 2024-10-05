package dbHandler

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/types"
)

// GETS

const QGetGameSessionByGameSessionID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
	NATURAL JOIN game_sessions.settings
  WHERE game_session_id=$1
`

func (dbHandler *DBHandler) GetGameSessionByGameSessionID(gameSessionID uuid.UUID) (types.GameSession, error) {
	var gameSession types.GameSession

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetGameSessionByGameSessionID,
		gameSessionID,
	).Scan(
		&gameSession.GameSessionID,
		&gameSession.UserID,
		&gameSession.Timestamp,
		&gameSession.LimitType,
		&gameSession.QuestionsCount,
		&gameSession.CorrectCount,
		&gameSession.Score,
		&gameSession.Time,
		&gameSession.Min,
		&gameSession.Max,
		&gameSession.Add,
		&gameSession.Sub,
		&gameSession.Mult,
		&gameSession.Div,
	)
	if err != nil {
		return gameSession, err
	}

	return gameSession, nil
}

const QGetAllGameSessionByUserID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
	NATURAL JOIN game_sessions.settings
  WHERE user_id=$1
	ORDER BY timestamp DESC
`

func (dbHandler *DBHandler) GetAllGameSessionsByUserID(id types.UserID) ([]types.GameSession, error) {
	sessions := []types.GameSession{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllGameSessionByUserID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var session types.GameSession

		err = rows.Scan(
			&session.GameSessionID,
			&session.UserID,
			&session.Timestamp,
			&session.LimitType,
			&session.QuestionsCount,
			&session.CorrectCount,
			&session.Score,
			&session.Time,
			&session.Min,
			&session.Max,
			&session.Add,
			&session.Sub,
			&session.Mult,
			&session.Div,
		)
		if err != nil {
			return nil, err
		}

		sessions = append(sessions, session)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sessions, nil
}

const QGetMatchingSettings = `
	SELECT settings_id
	FROM game_sessions.settings
	WHERE limit_type=$1
	AND limit_amount=$2
	AND min=$3
	AND max=$4
	AND add=$5
	AND sub = $6
  AND mult = $7
  AND div = $8
`

func (dbHandler *DBHandler) CheckForExistingSettings(session types.GameSession) (bool, uuid.UUID, error) {
	var id uuid.UUID

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetMatchingSettings,
		session.LimitType,
		session.LimitAmount,
		session.Min,
		session.Max,
		session.Add,
		session.Sub,
		session.Mult,
		session.Div,
	).Scan(&id)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, id, nil
		}
		return false, id, err
	}

	return true, id, nil
}

// INSERTS
const EInsertGameSessionData = `
  INSERT INTO game_sessions.data(game_session_id, user_id, settings_id, time, score, questions_count, correct_count)
  VALUES($1, $2, $3, $4, $5, $6, $7)
`

func (dbHandler *DBHandler) InsertGameSessionData(session types.GameSession) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertGameSessionData,
		session.GameSessionID,
		session.UserID,
		session.SettingsID,
		session.Time,
		session.Score,
		session.QuestionsCount,
		session.CorrectCount,
	)
	if err != nil {
		return err
	}

	return nil
}

const EInsertGameSessionSettings = `
	INSERT INTO game_sessions.settings(settings_id, limit_type, limit_amount, min, max, add, sub, mult, div)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
`

func (dbHandler *DBHandler) InsertGameSessionSettings(session types.GameSession) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertGameSessionSettings,
		session.SettingsID,
		session.LimitType,
		session.LimitAmount,
		session.Min,
		session.Max,
		session.Add,
		session.Sub,
		session.Mult,
		session.Div,
	)
	if err != nil {
		return err
	}

	return nil
}

func (dbHandler *DBHandler) InsertGameSession(session types.GameSession) error {
	exists, id, err := dbHandler.CheckForExistingSettings(session)
	if err != nil {
		return err
	}
	if exists {
		session.SettingsID = id
	} else {
		id, err := uuid.NewRandom()
		if err != nil {
			return err
		}
		session.SettingsID = id

		if err := dbHandler.InsertGameSessionSettings(session); err != nil {
			return err
		}
	}

	if err := dbHandler.InsertGameSessionData(session); err != nil {
		return err
	}

	return nil
}
