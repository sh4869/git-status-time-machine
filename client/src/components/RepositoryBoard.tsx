import * as React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ScoreBoard } from './ScoreBoard';
import { CommitPoint } from 'src/types/commit';

export const RepositoryBoard = (props: { owner: string; name: string }): React.ReactElement => {
  const [commits, setCommits] = React.useState<CommitPoint | null>(null);
  const [chiProps, setChiProps] = React.useState<{ owner: string; name: string }>({
    owner: props.owner,
    name: props.name,
  });
  const [repoI, setRepoI] = React.useState(props.name);
  const [ownerI, setOwnerI] = React.useState(props.owner);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (commits == null) {
      (async () => {
        setLoading(true);
        await fetch(`http://localhost:8080/commit/${props.owner}/${props.name}/commit_point`)
          .then((v) => v.json())
          .then((v) => setCommits(v));
        setLoading(false);
      })();
    }
  });
  const fetchData = async () => {
    setLoading(true);
    await fetch(`http://localhost:8080/commit/${ownerI}/${repoI}/commit_point`)
      .then((v) => v.json())
      .then((v) => setCommits(v));
    setChiProps({ name: repoI, owner: ownerI });
    setLoading(false);
  };
  return (
    <Grid fluid={true}>
      <Row bottom="xs">
        <Col md={2} mdOffset={4}>
          <p style={{ textAlign: 'center' }}>owner</p>
          <input style={{ width: '100%' }} onChange={(e) => setOwnerI(e.target.value)} value={ownerI}></input>
        </Col>
        <Col md={2}>
          <p style={{ textAlign: 'center' }}>repository name</p>
          <input style={{ width: '100%' }} onChange={(e) => setRepoI(e.target.value)} value={repoI}></input>
        </Col>
        <Col md={1}>
          <button onClick={async () => await fetchData()}>Start</button>
        </Col>
      </Row>
      {loading ? null : (
        <>
          {commits?.latest ? <ScoreBoard commit={{ ...chiProps, commit: commits.latest }} title={'latest'} /> : null}
          {commits?.midterm ? (
            <ScoreBoard commit={{ ...chiProps, commit: commits.midterm }} title={'mid term'} />
          ) : null}
          {commits?.initial ? <ScoreBoard commit={{ ...chiProps, commit: commits.initial }} title={'initial'} /> : null}
        </>
      )}
    </Grid>
  );
};
