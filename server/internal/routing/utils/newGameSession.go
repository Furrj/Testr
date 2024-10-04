package utils

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
)

func CreateNewGameSessionID(db *dbHandler.DBHandler) (uuid.UUID, error) {
	var id uuid.UUID

	for {
		// Generate a new UUID
		id = uuid.New()

		// Execute the query
		if _, err := db.GetGameSessionByGameSessionID(id); err != nil {
			if err == pgx.ErrNoRows {
				break
			}
			return id, err
		}
	}

	return id, nil
}
