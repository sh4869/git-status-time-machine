import { UsersGetByUsernameResponseData } from '@octokit/types';
export type CommitStatus = {
  commit_interval: number;
  addition_per_day: number;
  deletion_per_day: number;
  commit_ranker: { count: number; author: Partial<UsersGetByUsernameResponseData> }[];
};
