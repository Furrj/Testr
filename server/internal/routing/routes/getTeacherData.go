package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type class struct {
	types.TeacherClass
	Population uint `json:"population"`
}

type getTeacherDataRes struct {
	Classes     []class             `json:"classes"`
	Students    []types.StudentData `json:"students"`
	TeacherData types.TeacherData   `json:"teacher_data"`
}

func GetTeacherData(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get userData
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			return
		}

		// validate role
		if userData.Role != "T" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get teacher data
		teacherData, err := db.GetTeacherDataByUserID(userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetTeacherDataByUserID: %+v\n", err)
			return
		}

		// get classes
		teacherClasses, err := db.GetTeacherClassesByUserID(userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassesByUserID: %+v\n", err)
			return
		}

		classesMap := make(map[uint]class)
		for _, v := range teacherClasses {
			c := class{
				TeacherClass: v,
				Population:   0,
			}

			classesMap[c.ClassID] = c
		}

		// get students
		students, err := db.GetAllStudentsDataByTeacherID(userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetAllStudentsDataByTeacherID: %+v\n", err)
			return
		}

		for _, v := range students {
			c := classesMap[v.ClassID]
			c.Population++
			classesMap[v.ClassID] = c
		}

		classes := []class{}

		for _, v := range classesMap {
			classes = append(classes, v)
		}

		res := getTeacherDataRes{
			Classes:     classes,
			Students:    students,
			TeacherData: teacherData,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
