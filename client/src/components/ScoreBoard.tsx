import * as React from 'react';
import { Commit } from 'src/types/commit';
import { Col } from 'react-flexbox-grid';
import { CIScoreUI } from './score/CIScoreUI';
import { TestScoreUI } from './score/TestScoreUI';
import { CodeScoreUI } from './score/CodeScoreUI';
import * as Moment from 'moment';

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
        {props.commit.sha ? (
          <div style={{ textAlign: 'center' }}>
            <p>{props.commit.sha.commit.message}</p>
            <a href={props.commit.sha.html_url}>
              <p style={{ fontSize: '0.9em', color: '#333' }}>{props.commit.sha?.sha.substring(0, 6)}</p>
            </a>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {Moment(props.commit.sha.commit.author.date).format('YYYY/MM/DD')}
            </p>
          </div>
        ) : null}
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
