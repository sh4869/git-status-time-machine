import * as React from 'react';
import { Commit } from 'src/types/commit';
import { CodeScore } from 'src/types/score';
import { PieChart } from 'react-minimal-pie-chart';

export const CodeScoreUI = (props: { commit: Commit }) => {
  const [codeScore, setcodeScore] = React.useState<CodeScore | null>(null);
  React.useEffect(() => {
    if (codeScore == null) {
      (async () => {
        await fetch(`http://localhost:8080/score/${props.commit.owner}/${props.commit.name}/code`)
          .then((v) => v.json())
          .then((v) => setcodeScore(v));
      })();
    }
  });
  const color = codeScore ? (codeScore.score == 100 ? '#05c107' : codeScore.score > 50 ? '#E38627' : 'red') : 'black';
  return codeScore != null ? (
    <div style={{ textAlign: 'center' }}>
      <PieChart
        data={[{ value: codeScore.score, color: color }]}
        reveal={codeScore.score}
        lineWidth={20}
        background="#bfbfbf"
        animate
        label={() => codeScore.score}
        labelStyle={() => ({
          fill: color,
          fontSize: '25px',
          fontFamily: 'sans-serif',
        })}
        style={{ height: '200px' }}
        labelPosition={0}
      />
    </div>
  ) : (
    <div>Loading</div>
  );
};
