import * as React from 'react';
import { Commit } from 'src/types/commit';
import { Col } from 'react-flexbox-grid';
import { CIScoreUI } from './score/CIScoreUI';
import { TestScoreUI } from './score/TestScoreUI';
import { CodeScoreUI } from './score/CodeScoreUI';

export const ScoreBoard = (props: { commit: Commit }) => {
  return (
    <>
      <Col
        xs={12}
        md={2}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {props.commit.sha || 'HEAD'}
      </Col>
      <Col xs={12} md={3}>
        <CIScoreUI commit={props.commit} />
      </Col>
      <Col xs={12} md={3}>
        <TestScoreUI commit={props.commit} />
      </Col>
      <Col xs={12} md={3}>
        <CodeScoreUI commit={props.commit} />
      </Col>
    </>
  );
};
