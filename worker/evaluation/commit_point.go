package evaluation

import (
	"context"

	"github.com/google/go-github/v32/github"
)

type CommitPointResponse struct {
	Initial *CommitPoint `json:"initial,omit_empty"`
	Midterm *CommitPoint `json:"midterm,omit_empty"`
	Latest  *CommitPoint `json:"latest,omit_empty"`
}

type CommitPoint struct {
	Count  int                      `json:"count"`
	Commit *github.RepositoryCommit `json:"commit"`
}

func GetCommitPoint(client *github.Client, name string, repo string) (*CommitPointResponse, error) {
	r, resp, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: 1}})
	if err != nil {
		return nil, err
	}
	latest := &CommitPoint{1, r[0]}
	commitCount := resp.LastPage
	// 20コミットよりも少なかったらLatestだけ
	if commitCount < 20 {
		return &CommitPointResponse{Latest: latest}, nil
		// 30コミットよりも少なかったらLatestとMidTermを返す
	} else if commitCount < 30 {
		d, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: 15}})
		if err != nil {
			return nil, err
		}
		return &CommitPointResponse{Latest: latest, Initial: &CommitPoint{15, d[0]}}, nil
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
		return &CommitPointResponse{Latest: latest, Midterm: &CommitPoint{commitCount / 2, mid[0]}, Initial: &CommitPoint{commitCount - 10, ini[0]}}, nil
	}
}
