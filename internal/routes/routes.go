package routes

import (
	"net/http"

	"github.com/time-jar/server/internal/controllers"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	// _ "github.com/time-jar/server/docs"

	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	extractor := router.Group("/server")
	extractor.GET("/self", controllers.Self())

	extractor.GET("/openapi", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/server/openapi/index.html")
	})
	extractor.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/server/openapi/index.html")
	})
	extractor.GET("/openapi/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1 := extractor.Group("/v1")
	v1.GET("/info", controllers.Info())
	v1.POST("/extract", controllers.Extract())
}
