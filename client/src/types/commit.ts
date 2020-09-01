import { ReposGetCommitResponseData } from '@octokit/types';

export type Commit = { owner: string; name: string; sha?: ReposGetCommitResponseData };

export type CommitPoint = {
  initial?: ReposGetCommitResponseData;
  midterm?: ReposGetCommitResponseData;
  latest?: ReposGetCommitResponseData;
};
