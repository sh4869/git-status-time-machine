import * as React from 'react';
import { Repo } from '../types/repo';
import { CIScore } from 'src/types/ciscore';
import { PieChart } from 'react-minimal-pie-chart';

export const CIScoreUI = (props: Props) => {
  const [ciScore, setCiScore] = React.useState<CIScore | null>(null);
  React.useEffect(() => {
    if (ciScore == null) {
      const f = async () => {
        fetch(
          `http://localhost:8080/score/ci/${props.repo.owner}/${props.repo.name}`,
        )
          .then((v) => v.json())
          .then((v) => setCiScore(v));
      };
      f();
    }
  }, [ciScore]);
  return ciScore != null ? (
    <div style={{ width: '500px' }}>
      <PieChart
        data={[{ value: ciScore.score, color: '#E38627' }]}
        reveal={ciScore.score}
        lineWidth={20}
        background="#bfbfbf"
        animate
        label={({ dataEntry }) => ciScore.score}
      />
    </div>
  ) : (
    <div>loading</div>
  );
};

type Props = {
  repo: Repo;
};
