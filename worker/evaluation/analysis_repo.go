package evaluation

import (
	"context"
	"sort"

	"github.com/google/go-github/v32/github"
)

func getCommitCount(client *github.Client, name string, repo string) (int, error) {
	_, resp, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: 1, Page: 1}})
	if err != nil {
		return 0, err
	}
	return resp.LastPage, err
}

type CommitStatus struct {
	CommitInterval float64        `json:"commit_interval"`
	AdditionPerDay int            `json:"addition_per_day"`
	DeletionPerDay int            `json:"deletion_per_day"`
	CommitRanker   []CommitRanker `json:"commit_ranker"`
}

type CommitRanker struct {
	Author *github.User `json:"author"`
	Count  int          `json:"count"`
}

func GetCommitStatus(client *github.Client, name string, repo string, count int) (*CommitStatus, error) {
	const length = 10
	list, err := getNearCommitList(client, name, repo, count, length)
	if err != nil {
		return nil, err
	}
	durHour := 0.0
	type d struct {
		user  *github.User
		count int
	}
	m := map[string]d{}
	for v := range list {
		login := *list[v].Committer.Login
		if _, ok := m[login]; ok {
			m[login] = d{list[v].Committer, m[login].count + 1}
		} else {
			m[login] = d{list[v].Committer, 1}
		}

		if v != 0 {
			before := list[v-1].Commit.Committer.Date
			after := list[v].Commit.Committer.Date
			// TODO: コミット期間があまりにも離れている場合は修正する
			durHour += before.Sub(*after).Hours()
		}
	}
	durAve := durHour / float64(len(list)-1)
	ranker := []CommitRanker{}
	for _, v := range m {
		ranker = append(ranker, CommitRanker{v.user, v.count})
	}
	sort.SliceStable(ranker, func(i, j int) bool { return ranker[i].Count > ranker[j].Count })
	compare, _, err := client.Repositories.CompareCommits(context.Background(), name, repo, *(list[len(list)-1].SHA), *(list[0].SHA))
	if err != nil {
		return nil, err
	}
	add := 0
	del := 0
	for i := range compare.Files {
		f := compare.Files[i]
		add += *f.Additions
		del += *f.Deletions
	}
	return &CommitStatus{durAve, add / int(durHour) * 24, del / int(durHour) * 24, ranker}, nil
}

func getNearCommitList(client *github.Client, name string, repo string, count int, length int) ([]*github.RepositoryCommit, error) {
	// 直近10ミットを取るだけなのに100取るのは結構大変だが、リクエスト回数は少ないほうがいいのでこうした
	// countの公約数で計算すればいいが、countが100を超える素数の場合は結局いかの方法を取らないといけないので
	const perPage = 100
	page := count / perPage
	if page == 0 {
		page = 1
	}
	list := make([]*github.RepositoryCommit, length)
	l, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: perPage, Page: page}})
	if err != nil {
		return list, err
	}
	rest := count%perPage - 1
	if rest < 90 {
		list = l[rest : rest+10]
	}
	// 90以上の場合は次のページを取得してリストに結合する
	if rest > 90 {
		nl, _, err := client.Repositories.ListCommits(context.Background(), name, repo, &github.CommitsListOptions{ListOptions: github.ListOptions{PerPage: perPage, Page: page + 1}})
		if err != nil {
			return list, err
		}
		list = append(l[rest:100], nl[0:rest-90]...)
	}
	return list, nil
}
