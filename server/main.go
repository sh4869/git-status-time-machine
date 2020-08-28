package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/go-github/v32/github"
)

func main() {
	client := github.NewClient(nil)
	result := getCIFiles(client, "sh4869", "diary")
	json, err := json.Marshal(result)
	if err != nil {
		fmt.Printf("%v", err)
	}
	fmt.Printf("%v\n", string(json))
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3030"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/score/ci/:name/:repo", func(c *gin.Context) {
		name := c.Param("name")
		repo := c.Param("repo")
		result := getCIFiles(client, name, repo)
		c.JSON(200, result)
	})
	r.Run()
}

type CIResult struct {
	Score    int       `json:"score"`
	Github   *GitHubCi `json:"github_ci,omitempty"`
	Travis   *TravisCi `json:"travis_ci,omitempty"`
	Circleci *CircleCi `json:"circle_ci,omitempty"`
}

type GitHubCi struct {
	Files []GitHubFile `json:"files,omitempty"`
}

type TravisCi struct {
	File GitHubFile `json:"file,omitempty"`
}

type CircleCi struct {
	Files []GitHubFile `json:"files,omitempty"`
}

type GitHubFile struct {
	Path string `json:"path"`
	URL  string `json:"url"`
}

func getCIFiles(client *github.Client, owner string, repo string) (result CIResult) {
	const GithubCiPath = ".github/workflows"
	const TravisCiPath = ".travis.yml"
	const CircleCiPath = ".circleci"
	var d CIResult
	d.Score = 0
	_, dir, _, err := client.Repositories.GetContents(context.Background(), owner, repo, GithubCiPath, nil)
	if err != nil {
		d.Github = nil
	} else {
		d.Score = 100
		d.Github = &(GitHubCi{[]GitHubFile{}})
		for _, c := range dir {
			newfiles := append(d.Github.Files, GitHubFile{c.GetPath(), c.GetURL()})
			d.Github.Files = newfiles
		}
	}
	files, _, _, err := client.Repositories.GetContents(context.Background(), owner, repo, TravisCiPath, nil)
	if err != nil {
		d.Travis = nil
	} else {
		d.Score = 100
		d.Travis = &(TravisCi{GitHubFile{}})
		d.Travis.File = GitHubFile{files.GetPath(), files.GetURL()}
	}
	_, dir, _, err = client.Repositories.GetContents(context.Background(), owner, repo, CircleCiPath, nil)
	if err != nil {
		d.Circleci = nil
	} else {
		d.Score = 100
		d.Circleci = &(CircleCi{[]GitHubFile{}})
		for _, c := range dir {
			newfiles := append(d.Github.Files, GitHubFile{c.GetPath(), c.GetURL()})
			d.Circleci.Files = newfiles
		}
	}
	return d
}
