package dbHandler

import (
	"context"

	"github.com/jackc/pgx/v5/pgconn"
	"mathtestr.com/server/internal/types"
)

// GETS

const QGetGameSessionByGameSessionID = `
  SELECT game_session_id, user_id, timestamp
  FROM game_sessions.data
  WHERE game_session_id=$1
`

func (dbHandler *DBHandler) GetGameSessionByGameSessionID(gameSessionID types.GameSessionID) (types.GameSession, error) {
	var gameSession types.GameSession
	err := dbHandler.Conn.QueryRow(context.Background(), QGetGameSessionByGameSessionID, gameSessionID).Scan(
		&gameSession.GameSessionID,
		&gameSession.UserID,
		&gameSession.Timestamp,
	)
	if err != nil {
		return gameSession, err
	}

	return gameSession, nil
}

// INSERTS

const EInsertGameSessionID = `
	INSERT INTO game_sessions.ids (game_session_id)
  VALUES ($1)
  ON CONFLICT (game_session_id) DO NOTHING;
`

func (dbHandler *DBHandler) InsertGameSessionID(gameSessionID types.GameSessionID) (pgconn.CommandTag, error) {
	result, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertGameSessionID,
		gameSessionID,
	)

	return result, err
}

const EInsertGameSessionData = `
  INSERT INTO game_sessions.data(game_session_id, user_id)
  VALUES($1, $2)
`

func (dbHandler *DBHandler) InsertGameSession(session types.GameSession) error {
	_, err := dbHandler.Conn.Exec(context.Background(), EInsertGameSessionData,
		session.GameSessionID,
		session.UserID,
	)
	if err != nil {
		return err
	}

	return nil
}
