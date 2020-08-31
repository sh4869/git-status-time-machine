import * as React from 'react';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { ScoreBoard } from './ScoreBoard';

export const RepositoryBoard = (props: { owner: string; name: string }) => {
  const Gap = () => (
    <Row style={{ margin: '1em' }}>
      <Col md={6}></Col>
      <Col md={1} style={{ textAlign: 'center' }}>
        <p>⇑</p>
      </Col>
    </Row>
  );
  return (
    <Grid>
      <Row style={{ textAlign: 'center' }}>
        <Col xs={12} md={2}></Col>
        <Col md={3}>
          <h2>CI</h2>
        </Col>
        <Col md={3}>
          <h2>TEST</h2>
        </Col>
        <Col md={3}>
          <h2>CODE</h2>
        </Col>
        <Col md={1}></Col>
      </Row>
      <Row>
        <ScoreBoard commit={{ ...props }}></ScoreBoard>
      </Row>
      <Gap />
      <Row>
        <ScoreBoard commit={{ ...props }}></ScoreBoard>
      </Row>
      <Gap />
      <Row>
        <ScoreBoard commit={{ ...props }}></ScoreBoard>
      </Row>
    </Grid>
  );
};
