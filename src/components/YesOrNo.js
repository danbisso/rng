import React, { useState } from 'react';
import { getRandom } from '../lib/utils';

export default function YesOrNo() {

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function generateResult() {
    
    setIsLoading(true);
    
    setTimeout(() => {

      setResult( getRandom() );
      setIsLoading(false);

    }, 1000);
  }

  return (
    <React.Fragment>
      <p className="result">{ isLoading ? '...' : displayResult( result ) }</p>
      <div className="App-buttons">
        <button onClick={ () => generateResult() } className="App-button">Generate</button>
      </div>
    </React.Fragment>
  );
}

function displayResult( result ) {

  if( result === null ) {
    
    return '?';

  } else {

    return result > 0.5 ? 'Yes' : 'No';
  }
}

