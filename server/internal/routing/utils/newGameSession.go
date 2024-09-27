package utils

import (
	"fmt"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// generate new game session with different spellID than current
func SpawnNewGameSession(db *dbHandler.DBHandler) (types.GameSessionID, error) {
	gameSessionID, err := createAndInsertNewGameSessionID(db)
	if err != nil {
		return gameSessionID, err
	}

	return gameSessionID, nil
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
