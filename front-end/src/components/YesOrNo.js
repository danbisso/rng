import React, { useState, useEffect } from 'react';
import axios from 'axios';
import timeout from '../utils/timeout';

export default function YesOrNo() {

  const [functionUrl, setFunctionUrl] = useState(false);
  const [result, setResult] = useState('?');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the Lambda function URL from the config file
  const fetchFunctionUrl = async () => {
    const response = await axios('config.json');
    const url = response.data.functionUrl;
    setFunctionUrl(url);
  };

  // Fetch a Yes or No result from the back end
  const fetchResult = async () => {
    setIsLoading(true);
    await timeout(1000);
    const response = (await axios(functionUrl)).data;
    setResult(response);
    setIsLoading(false);
  };

  // Fetch the function URL only on first render
  useEffect(() => {
    try{
      fetchFunctionUrl();
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  return (
    <>
      <p className="result">{isLoading ? '...' : result}</p>
      <div className="App-buttons">
        <button 
          disabled={ !functionUrl || isLoading } 
          onClick={ fetchResult } 
          className="App-button">
            Tell me
        </button>
      </div>
    </>
  );
}
