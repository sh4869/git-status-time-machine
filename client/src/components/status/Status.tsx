import * as React from 'react';
import { CommitStatus } from 'src/types/status';
import { Commit } from 'src/types/commit';
import { Col, Row, Grid } from 'react-flexbox-grid';
export const CommitStatusComponent = (props: { commit: Commit }) => {
  const [status, setStatus] = React.useState<CommitStatus | null>(null);
  React.useEffect(() => {
    if (status == null) {
      (async () => {
        fetch(
          `http://localhost:8080/commit/${props.commit.owner}/${props.commit.name}/commit_status/${props.commit.commit?.count}`,
        )
          .then((v) => v.json())
          .then((v) => setStatus(v));
      })();
    }
  });
  return status != null ? (
    <Grid>
      <Row>
        <Col xs>
          <div>
            <ul>
              <li>Commit Interval: {status.commit_interval.toFixed(2)} h </li>
              <li>Addition / day: {status.addition_per_day}</li>
              <li>Deletion / day: {status.deletion_per_day}</li>
            </ul>
          </div>
        </Col>
        <Col xs>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {status.commit_ranker.slice(0, 3).map((v, i) => (
              <p key={i}>
                {i == 0 ? '1st' : i == 1 ? '2nd' : '3rd'}:
                <img
                  src={v.author.avatar_url}
                  style={{ height: '1em', display: 'inline-block', verticalAlign: 'center' }}
                ></img>
                <a href={v.author.html_url}>{v.author.login}</a>
              </p>
            ))}
          </div>
        </Col>
      </Row>
    </Grid>
  ) : (
    <div>Loading</div>
  );
};
