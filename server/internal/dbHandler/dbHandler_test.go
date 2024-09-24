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

	dbHandler, err := InitDBHandler(os.Getenv("DB_URL_TEST"))
	if err != nil {
		t.Errorf("error initializing db conn: %+v\n", err)
	}
	defer dbHandler.Conn.Close()

	testUserDataJackson := testHelpers.TestUserDataJackson
	testUserDataMichele := testHelpers.TestUserDataMichele
	testStudentData := testHelpers.TestStudentData
	testTeacherData := testHelpers.TestTeacherData
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

	t.Run("InsertUserIds", func(t *testing.T) {
		for range 2 {
			_, err := dbHandler.InsertUser()
			if err != nil {
				t.Errorf("Error in InsertUser: %+v\n", err)
			}
		}
	})

	t.Run("InsertUserDataTeacher", func(t *testing.T) {
		if err := dbHandler.InsertUserData(testUserDataMichele); err != nil {
			t.Errorf("Error in InsertUserData: %+v\n", err)
		}
	})
	t.Run("InsertUserDataStudent", func(t *testing.T) {
		if err := dbHandler.InsertUserData(testUserDataJackson); err != nil {
			t.Errorf("Error in InsertUserData: %+v\n", err)
		}
	})
	t.Run("GetUserDataByUserID", func(t *testing.T) {
		userData, err := dbHandler.GetUserDataByUserID(testUserDataJackson.UserID)
		if err != nil {
			t.Errorf("Error in GetUserDataByUserID: %+v\n", err)
		}
		if userData != testUserDataJackson {
			t.Errorf("Mismatch in GetUserDataByUserID: got %+v, want %+v", userData, testUserDataJackson)
		}
	})
	t.Run("GetUserIDByUsernameValid", func(t *testing.T) {
		userID, err := dbHandler.GetUserIDByUsername(testUserDataJackson.Username)
		if err != nil {
			t.Errorf("Error in GetUserIDByUsername: %+v\n", err)
		}
		if userID != testUserDataJackson.UserID {
			t.Errorf("Invalid UserID: got %d, want %d", userID, testUserDataJackson.UserID)
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

		if err := dbHandler.InsertGameSessionData(testGameSessionData); err != nil {
			t.Errorf("Error inserting game session: %+v", err)
		}
	})
	t.Run("GetGameSessionByGameSessionID", func(t *testing.T) {
		gameSession, err := dbHandler.GetGameSessionByGameSessionID(testGameSessionData.GameSessionID)
		fmt.Printf("%+v\n", gameSession)
		if err != nil {
			t.Errorf("Error getting game session: %+v", err)
		}
		if gameSession.GameSessionID != testGameSessionData.GameSessionID {
			t.Errorf("Mismatch in GetGameSessionByGameID: got %+v, want %+v", gameSession.GameSessionID, testGameSessionData.GameSessionID)
		}
	})
	t.Run("GetGameSessionsByUserID", func(t *testing.T) {
		sessions, err := dbHandler.GetGameSessionsByUserID(testGameSessionData.UserID)
		fmt.Printf("%+v\n", sessions)
		if err != nil {
			t.Errorf("Error in GetGameSessionsByUserID: %+v", err)
		}
	})

	t.Run("InsertTeacherData", func(t *testing.T) {
		if err := dbHandler.InsertTeacherData(testTeacherData); err != nil {
			t.Errorf("Error inserting teacher: %+v\n", err)
		}
	})
	t.Run("GetTeacherDataByUserID", func(t *testing.T) {
		data, err := dbHandler.GetTeacherDataByUserID(testTeacherData.UserID)
		if err != nil {
			t.Errorf("error getting teacher: %+v\n", err)
		}
		if data != testTeacherData {
			t.Errorf("mismatch in GetTeacherDataByUserID: got %+v, want %+v", data, testTeacherData)
		}
	})

	t.Run("InsertStudentData", func(t *testing.T) {
		if err := dbHandler.InsertStudentData(testStudentData); err != nil {
			t.Errorf("Error inserting teacher: %+v\n", err)
		}
	})
	t.Run("GetStudentDataByUserID", func(t *testing.T) {
		data, err := dbHandler.GetStudentDataByUserID(testStudentData.UserID)
		if err != nil {
			t.Errorf("error getting teacher: %+v\n", err)
		}
		if data != testStudentData {
			t.Errorf("mismatch in GetTeacherDataByUserID: got %+v, want %+v", data, testTeacherData)
		}
	})

	t.Run("DropTablesEnd", func(t *testing.T) {
		if err := dbHandler.ExecuteSqlScript(os.Getenv("SQL_DROP_TABLES")); err != nil {
			t.Errorf("Error dropping tables: %+v\n", err)
		}
	})
}
