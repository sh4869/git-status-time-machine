package evaluation

import "github.com/google/go-github/v32/github"

type CodeScore struct {
	Score int `json:"score"`
}

func GetCodeScore(client *github.Client, owner string, repo string, sha string) (CodeScore, error) {
	return CodeScore{Score: 100}, nil
}
