import * as React from 'react';
import { CIScoreUI } from './components/CIScore';

export const App = () => {
  const [repo, setRepo] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [start, setStart] = React.useState(false);
  return (
    <div>
      <h1>Hello World</h1>
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
      {start ? (
        <CIScoreUI repo={{ name: repo, owner: owner }}></CIScoreUI>
      ) : (
        <div></div>
      )}
    </div>
  );
};
