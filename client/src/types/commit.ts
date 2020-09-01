import { ReposGetCommitResponseData } from '@octokit/types';

export type Commit = {
  owner: string;
  name: string;
  commit?: { count: number; commit: ReposGetCommitResponseData };
};

export type CommitPoint = {
  initial?: { count: number; commit: ReposGetCommitResponseData };
  midterm?: { count: number; commit: ReposGetCommitResponseData };
  latest?: { count: number; commit: ReposGetCommitResponseData };
};
