import * as React from 'react';
import { Commit } from 'src/types/commit';
import { TestScore } from 'src/types/score';
import { PieChart } from 'react-minimal-pie-chart';

export const TestScoreUI = (props: { commit: Commit }) => {
  const [testScore, setTestScore] = React.useState<TestScore | null>(null);
  React.useEffect(() => {
    if (testScore == null) {
      (async () => {
        await fetch(`http://localhost:8080/score/${props.commit.owner}/${props.commit.name}/test`)
          .then((v) => v.json())
          .then((v) => setTestScore(v));
      })();
    }
  });
  const color = testScore ? (testScore.score == 100 ? '#05c107' : testScore.score > 50 ? '#E38627' : 'red') : 'black';
  return testScore != null ? (
    <div style={{ textAlign: 'center' }}>
      <PieChart
        data={[{ value: testScore.score, color: color }]}
        reveal={testScore.score}
        lineWidth={20}
        background="#bfbfbf"
        animate
        label={() => testScore.score}
        labelStyle={() => ({
          fill: color,
          fontSize: '25px',
          fontFamily: 'sans-serif',
        })}
        style={{ height: '150px' }}
        labelPosition={0}
      />
    </div>
  ) : (
    <div>Loading</div>
  );
};
