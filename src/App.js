import React from 'react';
import YesOrNo from './components/YesOrNo';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Yes or no?</h1>
      </header>
      <YesOrNo />
    </div>
  );
}