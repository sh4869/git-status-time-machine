import * as React from 'react';
import { CIScoreUI } from './components/CIScore';
import { Grid, Col, Row } from 'react-flexbox-grid';

export const App = () => {
  const [repo, setRepo] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [start, setStart] = React.useState(false);
  return (
    <div>
      <p>Owner</p>
      <input onChange={(e) => setOwner(e.target.value)} value={owner}></input>
      <p>Repo</p>
      <input onChange={(e) => setRepo(e.target.value)} value={repo}></input>
      <br></br>
      <button
        onClick={(e) => {
          console.log(e);
          setStart(!start);
        }}
      >
        Start
      </button>
      <Grid>
        <Row>
          <Col xs={12} md={4}>
            {start ? (
              <CIScoreUI repo={{ name: repo, owner: owner }}></CIScoreUI>
            ) : null}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
