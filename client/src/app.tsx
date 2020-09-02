import * as React from 'react';
import { RepositoryBoard } from './components/RepositoryBoard';

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
      <RepositoryBoard owner={owner || 'sh4869'} name={name || 'prototype'} />
    </div>
  );
};
