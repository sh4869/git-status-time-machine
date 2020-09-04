import * as React from 'react';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { ScoreBoard } from './ScoreBoard';
import { CommitPoint } from 'src/types/commit';

export const RepositoryBoard = (props: { owner: string; name: string }): React.ReactElement => {
  const [commits, setCommits] = React.useState<CommitPoint | null>(null);
  React.useEffect(() => {
    if (commits == null) {
      (async () => {
        fetch(`http://localhost:8080/commit/${props.owner}/${props.name}/commit_point`)
          .then((v) => v.json())
          .then((v) => setCommits(v));
      })();
    }
  });
  return (
    <Grid fluid={true}>
      {commits?.latest ? <ScoreBoard commit={{ ...props, commit: commits.latest }} title={'latest'} /> : null}
      {commits?.midterm ? <ScoreBoard commit={{ ...props, commit: commits.midterm }} title={'mid term'} /> : null}
      {commits?.initial ? <ScoreBoard commit={{ ...props, commit: commits.initial }} title={'initial'} /> : null}
    </Grid>
  );
};
