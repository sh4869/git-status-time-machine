import * as React from 'react';
import { Repo } from '../types/repo';
import { CIScore } from 'src/types/ciscore';
import { PieChart } from 'react-minimal-pie-chart';

export const CIScoreUI = (props: Props) => {
  const [ciScore, setCiScore] = React.useState<CIScore | null>(null);
  React.useEffect(() => {
    if (ciScore == null) {
      (async () => {
        fetch(
          `http://localhost:8080/score/ci/${props.repo.owner}/${props.repo.name}`,
        )
          .then((v) => v.json())
          .then((v) => setCiScore(v));
      })();
    }
  }, [ciScore]);
  const color = ciScore
    ? ciScore.score == 100
      ? '#05c107'
      : ciScore.score > 50
      ? '#E38627'
      : 'red'
    : 'black';
  return ciScore != null ? (
    <div style={{ textAlign: 'center' }}>
      <h1>CI</h1>
      <PieChart
        data={[{ value: ciScore.score, color: color }]}
        reveal={ciScore.score}
        lineWidth={20}
        background="#bfbfbf"
        animate
        label={() => ciScore.score}
        labelStyle={() => ({
          fill: color,
          fontSize: '25px',
          fontFamily: 'sans-serif',
        })}
        style={{ height: '300px' }}
        labelPosition={0}
      />
      {ciScore.github_ci ? <p>Using GitHub CI</p> : null}
    </div>
  ) : (
    <div>loading</div>
  );
};

type Props = {
  repo: Repo;
};
