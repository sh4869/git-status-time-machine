package evaluation

import (
	"context"
	"fmt"

	"github.com/google/go-github/v32/github"
)

type CommitPointResponse struct {
	Initial *CommitPoint `json:"initial,omit_empty"`
	Midterm *CommitPoint `json:"midterm,omit_empty"`
	Latest  *CommitPoint `json:"latest,omit_empty"`
}

type CommitPoint struct {
	Count       int                      `json:"count"`
	EndCommit   *github.RepositoryCommit `json:"end_commit"`
	StartCommit *github.RepositoryCommit `json:"start_commit"`
}

func GetCommitPoint(client *github.Client, name string, repo string) (*CommitPointResponse, error) {
	count, err := getCommitCount(client, name, repo)
	if err != nil {
		return nil, err
	}
	if count < 10 {
		return nil, fmt.Errorf("select more than 10 commit repository")
	}
	r, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 10, Page: 1}})
	// 20コミットよりも少なかったらLatestだけ
	if count < 20 {
		return &CommitPointResponse{
			Latest: &CommitPoint{1, r[0], r[9]},
		}, nil
	}
	// 30コミットよりも少なかったらLatestとInitialを返す
	if count < 30 {
		d, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 15, Page: 2}})
		if err != nil {
			return nil, err
		}
		return &CommitPointResponse{
			Latest:  &CommitPoint{1, r[0], r[9]},
			Initial: &CommitPoint{15, d[0], d[9]},
		}, nil
	}
	// それ以上なら3つ返す
	ini := count - 10
	mid := count / 2
	// TODO: ここ本来は2回のリクエストで済むはず
	iniE, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: ini}})
	if err != nil {
		return nil, err
	}
	iniS, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: ini + 10}})
	if err != nil {
		return nil, err
	}
	midE, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: mid}})
	if err != nil {
		return nil, err
	}
	midS, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: mid + 10}})
	if err != nil {
		return nil, err
	}
	return &CommitPointResponse{
		Latest:  &CommitPoint{1, r[0], r[9]},
		Midterm: &CommitPoint{mid, midE[0], midS[0]},
		Initial: &CommitPoint{ini, iniE[0], iniS[0]},
	}, nil
}
