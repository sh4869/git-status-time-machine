package evaluation

import (
	"context"

	"github.com/google/go-github/v32/github"
)

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

func GetCIScore(client *github.Client, owner string, repo string, sha string) (result CIResult) {
	const GithubCiPath = ".github/workflows"
	const TravisCiPath = ".travis.yml"
	const CircleCiPath = ".circleci"
	var opts *github.RepositoryContentGetOptions
	if sha == "" {
		opts = nil
	} else {
		opts = &github.RepositoryContentGetOptions{Ref: sha}
	}

	var d CIResult
	d.Score = 0
	_, dir, _, err := client.Repositories.GetContents(context.Background(), owner, repo, GithubCiPath, opts)
	if err != nil {
		d.Github = nil
	} else {
		d.Score = 100
		d.Github = &(GitHubCi{[]GitHubFile{}})
		for _, c := range dir {
			newfiles := append(d.Github.Files, GitHubFile{c.GetPath(), c.GetHTMLURL()})
			d.Github.Files = newfiles
		}
	}
	files, _, _, err := client.Repositories.GetContents(context.Background(), owner, repo, TravisCiPath, opts)
	if err != nil {
		d.Travis = nil
	} else {
		d.Score = 100
		d.Travis = &(TravisCi{GitHubFile{}})
		d.Travis.File = GitHubFile{files.GetPath(), files.GetHTMLURL()}
	}
	_, dir, _, err = client.Repositories.GetContents(context.Background(), owner, repo, CircleCiPath, opts)
	if err != nil {
		d.Circleci = nil
	} else {
		d.Score = 100
		d.Circleci = &(CircleCi{[]GitHubFile{}})
		for _, c := range dir {
			newfiles := append(d.Github.Files, GitHubFile{c.GetPath(), c.GetHTMLURL()})
			d.Circleci.Files = newfiles
		}
	}
	return d
}
