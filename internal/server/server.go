package server

import (
	"context"
	"fmt"

	"github.com/time-jar/server/internal/configs"
	// "github.com/time-jar/server/internal/db_client"
	// "github.com/time-jar/server/internal/internal_state"
	"github.com/time-jar/server/internal/routes"

	"github.com/gin-gonic/gin"
)

const serviceName = "extractor"

func Run(ctx context.Context) {
	// load ENV
	environment := configs.LoadEnvironment()

	// Logging

	// init database
	// db_client.DBClient(ctx)

	// init internalState
	// internal_state.InternalState(ctx)

	// start http server
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	routes.Routes(router)
	port, err := configs.GetEnv("PORT")
	if err != nil {
		panic(err)
	}

	address := fmt.Sprintf("0.0.0.0:%v", *port)
	err = router.Run(address)
	if err != nil {
		panic(err)
	}
}
