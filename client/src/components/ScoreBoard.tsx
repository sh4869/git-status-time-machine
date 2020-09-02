import * as React from 'react';
import { Commit } from 'src/types/commit';
import { Col } from 'react-flexbox-grid';
import { CIScoreUI } from './score/CIScoreUI';
import { TestScoreUI } from './score/TestScoreUI';
import { CodeScoreUI } from './score/CodeScoreUI';
import * as Moment from 'moment';
import { CommitStatusComponent } from './status/Status';

export const ScoreBoard = (props: { commit: Commit }) => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const commit = props.commit.commit?.commit;
  return (
    <>
      <Col xs={12} md={2} style={style}>
        {commit ? (
          <div style={{ textAlign: 'center' }}>
            <p>{commit.commit.message}</p>
            <a href={commit.html_url}>
              <p style={{ fontSize: '0.9em', color: '#333' }}>{commit.sha.substring(0, 6)}</p>
            </a>
            <p style={{ fontSize: '0.9em', color: '#333' }}>{Moment(commit.commit.author.date).format('YYYY/MM/DD')}</p>
          </div>
        ) : null}
      </Col>
      <Col xs={12} md={2}>
        <CIScoreUI commit={props.commit} />
      </Col>
      <Col xs={12} md={2}>
        <TestScoreUI commit={props.commit} />
      </Col>
      <Col xs={12} md={2}>
        <CodeScoreUI commit={props.commit} />
      </Col>
      <Col xs={12} md={3} style={style}>
        <CommitStatusComponent commit={props.commit} />
      </Col>
    </>
  );
};
