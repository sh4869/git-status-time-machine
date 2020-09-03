package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"worker/evaluation"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"

	"github.com/google/go-github/v32/github"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
)

func loadConfig() (*config.Config, error) {
	return config.NewFromYaml("worker.yaml", true)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file!")
	}
	cnf, err := loadConfig()
	if err != nil {
		log.Fatalf("%v", err)
	}
	server, err := machinery.NewServer(cnf)
	if err != nil {
		return
	}
	tasks := map[string]interface{}{
		"ci":            getCIScore,
		"code":          getCodeScore,
		"test":          getTestScore,
		"commit_point":  getCommitPoint,
		"commit_status": getCommitStatus,
	}
	if err := server.RegisterTasks(tasks); err != nil {
		return
	}
	worker := server.NewWorker("machinery_worker", 8)
	if err := worker.Launch(); err != nil {
		log.Fatalf("%v", err)
	}
}

func getClient() *github.Client {
	token := os.Getenv("GITHUB_TOKEN")
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)
	return client
}

func getCIScore(owner, repo, sha string) (string, error) {
	client := getClient()
	result, err := evaluation.GetCIScore(client, owner, repo, sha)
	if err != nil {
		return "", err
	}
	b, _ := json.Marshal(result)
	return string(b), nil
}

func getCodeScore(owner, repo, sha string) (string, error) {
	client := getClient()
	result, err := evaluation.GetCodeScore(client, owner, repo, sha)
	if err != nil {
		return "", err
	}
	b, _ := json.Marshal(result)
	return string(b), nil
}

func getTestScore(owner, repo, sha string) (string, error) {
	client := getClient()
	result, err := evaluation.GetTestScore(client, owner, repo, sha)
	if err != nil {
		return "", err
	}
	b, _ := json.Marshal(result)
	return string(b), nil
}

func getCommitPoint(owner, repo string) (string, error) {
	client := getClient()
	result, err := evaluation.GetCommitPoint(client, owner, repo)
	if err != nil {
		return "", err
	}
	b, _ := json.Marshal(result)
	return string(b), nil
}

func getCommitStatus(owner string, repo string, count int) (string, error) {
	client := getClient()
	result, err := evaluation.GetCommitStatus(client, owner, repo, count)
	if err != nil {
		return "", err
	}
	b, _ := json.Marshal(result)
	return string(b), nil
}
