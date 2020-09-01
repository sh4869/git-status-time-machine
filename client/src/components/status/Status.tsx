import * as React from 'react';
import { CommitStatus } from 'src/types/status';
import { Commit } from 'src/types/commit';
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
    <div style={{ textAlign: 'center' }}>
      <p>Commit / h: {status.commit_per_hour.toFixed(2)}</p>
      <p>Addition / h: {status.addition_per_hour}</p>
      <p>Deletion / h: {status.deletion_per_hour}</p>
    </div>
  ) : (
    <div>Loading</div>
  );
};
