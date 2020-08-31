type GitHubFile = {
  path: string;
  url: string;
};

type GithubActions = {
  files: GitHubFile[];
};

type CircleCi = {
  files: GitHubFile[];
};
type TravisCi = {
  file: GitHubFile;
};

export type CIScore = {
  score: number;
  github_ci?: GithubActions;
  travis_ci?: TravisCi;
  circle_ci?: CircleCi;
};

export type CodeScore = {
  score: number;
};

export type TestScore = {
  score: number;
};
