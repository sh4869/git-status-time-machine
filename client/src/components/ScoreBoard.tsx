import * as React from 'react';
import { Commit } from 'src/types/commit';
import { Col, Row, Grid } from 'react-flexbox-grid';
import { CIScoreUI } from './score/CIScoreUI';
import { CodeScoreUI } from './score/CodeScoreUI';
import * as Moment from 'moment';
import { CommitStatusComponent } from './status/Status';
import { ReposGetCommitResponseData } from '@octokit/types';

export const ScoreBoard = (props: { commit: Commit; title: string }): React.ReactElement => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const CommitDesc = (commit: ReposGetCommitResponseData) => {
    return (
      <div style={{ textAlign: 'center', display: 'block' }}>
        <a href={commit.html_url}>
          <p style={{ fontSize: '1.1em', marginBottom: '0.5em' }}>{commit.commit.message.split('\n')[0]}</p>
        </a>
        <p style={{ fontSize: '0.8em', color: '#333', marginTop: '0.3em' }}>
          {Moment(commit.commit.author.date).format('YYYY/MM/DD')}
        </p>
      </div>
    );
  };
  const comapre_url = `https://github.com/${props.commit.owner}/${props.commit.name}/compare/${props.commit.commit?.start_commit.sha}...${props.commit.commit?.end_commit.sha}`;
  return (
    <>
      <Row>
        <Col md={2} mdOffset={5}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.2em' }}>{props.title}</h2>
        </Col>
      </Row>
      <Row style={{ marginBottom: '1em' }}>
        <Col md={8} mdOffset={2}>
          <Grid>
            <Row>
              <Col md={5}>
                {props.commit.commit?.end_commit ? <CommitDesc {...props.commit.commit?.end_commit} /> : null}
              </Col>
              <Col md={2}>
                <p style={{ ...style, fontSize: '1.1em', marginBottom: '0.5em' }}>〜</p>
                <a href={comapre_url}>
                  <p style={{ ...style, fontSize: '0.9em', marginTop: '0.5em' }}>(compare)</p>
                </a>
              </Col>
              <Col md={5}>
                {props.commit.commit?.start_commit ? <CommitDesc {...props.commit.commit?.start_commit} /> : null}
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
      <Row>
        <Col md={2} mdOffset={2}>
          <h3 style={{ textAlign: 'center' }}>Commit Status</h3>
        </Col>
        <Col md={2}>
          <h3 style={{ textAlign: 'center' }}>Committer Ranking</h3>
        </Col>
        <Col md={2}>
          <h3 style={{ textAlign: 'center' }}>CI Status</h3>
        </Col>
        <Col md={2}>
          <h3 style={{ textAlign: 'center' }}>Code Status</h3>
        </Col>
      </Row>
      <Row style={{ marginBottom: '4em' }}>
        <Col xs={12} md={4} mdOffset={2}>
          <CommitStatusComponent commit={props.commit} />
        </Col>
        <Col xs={12} md={2}>
          <CIScoreUI commit={props.commit} />
        </Col>
        <Col xs={12} md={2}>
          <CodeScoreUI commit={props.commit} />
        </Col>
      </Row>
    </>
  );
};
