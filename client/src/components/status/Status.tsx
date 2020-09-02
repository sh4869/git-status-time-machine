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
            <p>Commit : {status.commit_interval.toFixed(2)} h </p>
            <p>Addition / day: {status.addition_per_day}</p>
            <p>Deletion / day: {status.deletion_per_day}</p>
          </div>
        </Col>
        <Col xs>
          <div>
            {status.commit_ranker.slice(0, 3).map((v, i) => (
              <p key={i}>
                {i == 0 ? '1st' : i == 1 ? '2nd' : '3rd'}: {v.author.login}
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
