import { ReposGetCommitResponseData } from '@octokit/types';

export type Commit = {
  owner: string;
  name: string;
  commit?: CommitPointRaw;
};

export type CommitPointRaw = {
  count: number;
  end_commit: ReposGetCommitResponseData;
  start_commit: ReposGetCommitResponseData;
};

export type CommitPoint = {
  initial?: CommitPointRaw;
  midterm?: CommitPointRaw;
  latest?: CommitPointRaw;
};
