import * as React from 'react';
import { RepositoryBoard } from './components/RepositoryBoard';

export const App = () => {
  const [repoI, setRepo] = React.useState('');
  const [ownerI, setOwner] = React.useState('');
  const [start, setStart] = React.useState(true);
  return (
    <div>
      <p>Owner</p>
      <input onChange={(e) => setOwner(e.target.value)} value={ownerI}></input>
      <p>Repo</p>
      <input onChange={(e) => setRepo(e.target.value)} value={repoI}></input>
      <br></br>
      <button
        onClick={(e) => {
          console.log(repoI, ownerI);
          setStart(!start);
        }}
      >
        Start
      </button>
      {start ? <RepositoryBoard owner={ownerI ? ownerI : 'sh4869'} name={repoI ? repoI : 'prototype'} /> : null}
    </div>
  );
};
