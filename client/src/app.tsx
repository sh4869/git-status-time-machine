import * as React from 'react';
import { RepositoryBoard } from './components/RepositoryBoard';
import { Grid, Row, Col } from 'react-flexbox-grid';

export const App = (): React.ReactElement => {
  const [append, setAppend] = React.useState<number>(0);
  const add = () => {
    console.log(new Array(append).fill(0));
    setAppend(append + 1);
  };
  const del = () => {
    setAppend(append - 1);
  };
  return (
    <>
      <Grid>
        <Row center={'xs'}>
          <Col>
            <h1 style={{ textAlign: 'center' }}>Git Status Time Machine</h1>
          </Col>
        </Row>
      </Grid>
      <RepositoryBoard owner={'sh4869'} name={'prototype'} />
      {new Array(append).fill(0).map((v, i) => {
        return (
          <>
            {i == append - 1 ? (
              <Grid key={i}>
                <Row end="xs">
                  <Col>
                    <button onClick={() => del()}>☓</button>
                  </Col>
                </Row>
              </Grid>
            ) : null}
            <RepositoryBoard owner={'sh4869'} name={'prototype'} />
          </>
        );
      })}
      <Grid>
        <Row center="xs">
          <Col style={{ margin: '2em 0' }}>
            <button onClick={() => add()}>+</button>
          </Col>
        </Row>
      </Grid>
    </>
  );
};
