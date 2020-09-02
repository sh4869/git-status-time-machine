package main

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	"github.com/RichardKnop/machinery/v1/tasks"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	cnf, err := config.NewFromYaml("worker.yaml", true)
	if err != nil {
		log.Fatalf("%v", err)
	}
	server, err := machinery.NewServer(cnf)
	if err != nil {
		return
	}
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3030"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/score/:name/:repo/ci", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		sha := c.Query("sha")

		result, err := server.SendTask(&tasks.Signature{
			Name: "ci",
			Args: []tasks.Arg{
				{Type: "string", Value: name},
				{Type: "string", Value: repo},
				{Type: "string", Value: sha},
			},
		})
		if err != nil {
			c.Error(err)
		}
		v, err := result.GetWithTimeout(time.Duration(time.Second*10), time.Duration(time.Millisecond*100))
		if err != nil {
			c.Error(err)
		}
		c.String(200, v[0].String())
	})

	r.GET("/score/:name/:repo/test", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		sha := c.Query("sha")
		result, err := server.SendTask(&tasks.Signature{
			Name: "test",
			Args: []tasks.Arg{
				{Type: "string", Value: name},
				{Type: "string", Value: repo},
				{Type: "string", Value: sha},
			},
		})
		if err != nil {
			c.Error(err)
		}
		v, err := result.GetWithTimeout(time.Duration(time.Second*10), time.Duration(time.Millisecond*100))
		if err != nil {
			c.Error(err)
		}
		c.String(200, v[0].String())
	})

	r.GET("/score/:name/:repo/code", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		sha := c.Query("sha")
		result, err := server.SendTask(&tasks.Signature{
			Name: "code",
			Args: []tasks.Arg{
				{Type: "string", Value: name},
				{Type: "string", Value: repo},
				{Type: "string", Value: sha},
			},
		})
		if err != nil {
			c.Error(err)
		}
		v, err := result.GetWithTimeout(time.Duration(time.Second*10), time.Duration(time.Millisecond*100))
		if err != nil {
			c.Error(err)
		}
		c.String(200, v[0].String())
	})

	r.GET("/commit/:name/:repo/commit_point", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		result, err := server.SendTask(&tasks.Signature{
			Name: "commit_point",
			Args: []tasks.Arg{
				{Type: "string", Value: name},
				{Type: "string", Value: repo},
			},
		})
		if err != nil {
			c.Error(err)
		}
		v, err := result.GetWithTimeout(time.Duration(time.Second*10), time.Duration(time.Millisecond*100))
		if err != nil {
			c.Error(err)
		}
		c.String(200, v[0].String())
	})
	r.GET("/commit/:name/:repo/commit_status/:count", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		count, _ := strconv.Atoi(c.Param("count"))
		log.Printf("%v", count)
		result, err := server.SendTask(&tasks.Signature{
			Name: "commit_status",
			Args: []tasks.Arg{
				{Type: "string", Value: name},
				{Type: "string", Value: repo},
				{Type: "int", Value: count},
			},
		})

		if err != nil {
			c.Error(err)
		}
		v, err := result.GetWithTimeout(time.Duration(time.Second*10), time.Duration(time.Millisecond*100))
		if err != nil {
			c.Error(err)
		}
		if len(v) < 1 {
			c.Error(fmt.Errorf("failed"))
		}
		c.String(200, v[0].String())
	})

	r.Run()
}
