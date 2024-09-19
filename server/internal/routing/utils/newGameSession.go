package utils

import (
	"fmt"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// generate new game session with different spellID than current
func SpawnNewGameSession(userID types.UserID, db *dbHandler.DBHandler) (types.GameSession, error) {
	var session types.GameSession

	gameSessionID, err := createAndInsertNewGameSessionID(db)
	if err != nil {
		return session, err
	}

	session.GameSessionID = gameSessionID
	session.UserID = userID

	return session, nil
}

func createAndInsertNewGameSessionID(db *dbHandler.DBHandler) (types.GameSessionID, error) {
	var id types.GameSessionID

	for {
		// Generate a new UUID
		id = uuid.New().String()

		// Execute the query
		result, err := db.InsertGameSessionID(id)
		if err != nil {
			return id, err
		}

		// Check if the insert was successful
		if result.RowsAffected() > 0 {
			// Successfully inserted
			fmt.Println("Successfully inserted record with UUID:", id)
			break
		}

		// If no rows were affected, it means there was a conflict, so we retry
		fmt.Println("UUID conflict detected, generating a new UUID and retrying...")
	}

	return id, nil
}
