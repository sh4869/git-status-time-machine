package evaluation

import (
	"context"

	"github.com/google/go-github/v32/github"
)

type CommitPoint struct {
	Initial *github.RepositoryCommit `json:"initial,omit_empty"`
	Midterm *github.RepositoryCommit `json:"midterm,omit_empty"`
	Latest  *github.RepositoryCommit `json:"latest,omit_empty"`
}

func GetCommitPoint(client *github.Client, name string, repo string) (*CommitPoint, error) {
	r, resp, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: 1}})
	if err != nil {
		return nil, err
	}
	commitCount := resp.LastPage
	// 20コミットよりも少なかったらLatestだけ
	if commitCount < 20 {
		return &CommitPoint{Latest: r[0]}, nil
		// 30コミットよりも少なかったらLatestとMidTermを返す
	} else if commitCount < 30 {
		d, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: 15}})
		if err != nil {
			return nil, err
		}
		return &CommitPoint{Latest: r[0], Initial: d[0]}, nil
	} else {
		// TODO: ここはもうちょっとアルゴリズムを練る
		ini, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: commitCount - 10}})
		if err != nil {
			return nil, err
		}
		mid, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: (commitCount / 2)}})
		if err != nil {
			return nil, err
		}
		return &CommitPoint{Latest: r[0], Midterm: mid[0], Initial: ini[0]}, nil
	}
}
