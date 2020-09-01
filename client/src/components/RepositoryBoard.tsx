import * as React from 'react';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { ScoreBoard } from './ScoreBoard';
import { CommitPoint } from 'src/types/commit';

export const RepositoryBoard = (props: { owner: string; name: string }) => {
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
  const Gap = () => (
    <Row style={{ margin: '1em' }}>
      <Col md={6}></Col>
      <Col md={1} style={{ textAlign: 'center' }}>
        <p>⇑</p>
      </Col>
    </Row>
  );
  return (
    <Grid>
      <Row style={{ textAlign: 'center' }}>
        <Col xs={12} md={2}></Col>
        <Col md={3}>
          <h2>CI</h2>
        </Col>
        <Col md={3}>
          <h2>TEST</h2>
        </Col>
        <Col md={3}>
          <h2>CODE</h2>
        </Col>
        <Col md={1}></Col>
      </Row>
      {commits?.latest ? (
        <Row>
          <ScoreBoard commit={{ ...props, commit: commits.latest }}></ScoreBoard>
        </Row>
      ) : null}
      {commits?.midterm ? (
        <>
          <Gap></Gap>
          <Row>
            <ScoreBoard commit={{ ...props, commit: commits.midterm }}></ScoreBoard>
          </Row>
        </>
      ) : null}
      {commits?.initial ? (
        <>
          <Gap></Gap>
          <Row>
            <ScoreBoard commit={{ ...props, commit: commits.initial }}></ScoreBoard>
          </Row>
        </>
      ) : null}
    </Grid>
  );
};
