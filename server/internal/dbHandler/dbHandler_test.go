package dbHandler

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/testHelpers"

	"github.com/joho/godotenv"
)

func TestDBHandler(t *testing.T) {
	if err := godotenv.Load("../../../config/config.env"); err != nil {
		fmt.Printf("Error loading env vars: %+v\n", err)
		os.Exit(1)
	}

	dbHandler := InitDBHandler(os.Getenv("DB_URL_TEST"))
	defer dbHandler.Conn.Close()

	testUserData := testHelpers.TestUserData
	testGameSessionData := testHelpers.TestGameSession

	t.Run("Ping connection", func(t *testing.T) {
		if err := dbHandler.Conn.Ping(context.Background()); err != nil {
			t.Errorf("Error initializing database: %+v\n", err)
		}
	})
	t.Run("DropTablesStart", func(t *testing.T) {
		if err := dbHandler.ExecuteSqlScript(os.Getenv("SQL_DROP_TABLES")); err != nil {
			t.Errorf("Error dropping tables: %+v\n", err)
		}
	})
	t.Run("CreateTables", func(t *testing.T) {
		if err := dbHandler.ExecuteSqlScript(os.Getenv("SQL_CREATE_TABLES")); err != nil {
			t.Errorf("Error initializing tables: %+v\n", err)
		}
	})

	t.Run("InsertUser", func(t *testing.T) {
		userId, err := dbHandler.InsertUser()
		if err != nil {
			t.Errorf("Error in InsertUser: %+v\n", err)
		}
		if userId != 1 {
			t.Errorf("Inserted user id should be %d, but got %d\n", testUserData.UserID, userId)
		}
	})

	t.Run("InsertUserData", func(t *testing.T) {
		if err := dbHandler.InsertUserData(testUserData); err != nil {
			t.Errorf("Error in InsertUserData: %+v\n", err)
		}
	})
	t.Run("GetUserDataByUserID", func(t *testing.T) {
		userData, err := dbHandler.GetUserDataByUserID(testUserData.UserID)
		if err != nil {
			t.Errorf("Error in GetUserDataByUserID: %+v\n", err)
		}
		if userData != testUserData {
			t.Errorf("Mismatch in GetUserDataByUserID: got %+v, want %+v", userData, testUserData)
		}
	})
	t.Run("GetUserIDByUsernameValid", func(t *testing.T) {
		userID, err := dbHandler.GetUserIDByUsername(testUserData.Username)
		if err != nil {
			t.Errorf("Error in GetUserIDByUsername: %+v\n", err)
		}
		if userID != testUserData.UserID {
			t.Errorf("Invalid UserID: got %d, want %d", userID, testUserData.UserID)
		}
	})
	t.Run("GetUserIDByUsernameInvalid", func(t *testing.T) {
		_, err := dbHandler.GetUserIDByUsername("test")
		if !errors.Is(err, pgx.ErrNoRows) {
			t.Errorf("Expected pgx.ErrNoRows: %+v\n", err)
		}
	})

	t.Run("InsertGameSession", func(t *testing.T) {
		if _, err := dbHandler.InsertGameSessionID(testGameSessionData.GameSessionID); err != nil {
			t.Errorf("error inserting game session: %+v", err)
		}

		result, err := dbHandler.InsertGameSessionID(testGameSessionData.GameSessionID)
		if err != nil {
			t.Errorf("error inserting game session: %+v", err)
		}
		if result.RowsAffected() != 0 {
			t.Errorf("mismatch inserting duplicate gameSessionID: got %d, want 0", result.RowsAffected())
		}

		if err := dbHandler.InsertGameSession(testGameSessionData); err != nil {
			t.Errorf("Error inserting game session: %+v", err)
		}
	})
	t.Run("UpdateGameSessionIDByUserID", func(t *testing.T) {
		if err := dbHandler.UpdateUserGameSessionIDByUserID(testGameSessionData.GameSessionID, testUserData.UserID); err != nil {
			t.Errorf("error in InsertGameSessionIDByUserID: %+v", err)
		}
	})
	t.Run("GetGameSessionIDByUserID", func(t *testing.T) {
		gameSessionID, err := dbHandler.GetGameSessionIDByUserID(testUserData.UserID)
		if err != nil {
			t.Errorf("%+v\n", err)
		}
		if gameSessionID != testGameSessionData.GameSessionID {
			t.Errorf("gameSessionID mismatch: got %+v, want %+v", gameSessionID, testGameSessionData.GameSessionID)
		}
	})
	t.Run("GetGameSessionByUserID", func(t *testing.T) {
		gameSession, err := dbHandler.GetGameSessionByUserID(testUserData.UserID)
		if err != nil {
			t.Errorf("Error getting game session: %+v", err)
		}
		if gameSession != testGameSessionData {
			t.Errorf("mismatch in GetGameSessionByUserID: got %+v, want %+v", gameSession, testGameSessionData)
		}
	})
	t.Run("GetGameSessionByGameSessionID", func(t *testing.T) {
		gameSession, err := dbHandler.GetGameSessionByGameSessionID(testGameSessionData.GameSessionID)
		if err != nil {
			t.Errorf("Error getting game session: %+v", err)
		}
		if gameSession.GameSessionID != testGameSessionData.GameSessionID {
			t.Errorf("Mismatch in GetGameSessionByGameID: got %+v, want %+v", gameSession.GameSessionID, testGameSessionData.GameSessionID)
		}
	})

	t.Run("DropTablesEnd", func(t *testing.T) {
		if err := dbHandler.ExecuteSqlScript(os.Getenv("SQL_DROP_TABLES")); err != nil {
			t.Errorf("Error dropping tables: %+v\n", err)
		}
	})
}
