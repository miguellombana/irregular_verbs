import React, { useState } from 'react';
import Game from './components/Game';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [results, setResults] = useState(null);

  if (results) {
    return <Summary results={results} onRestart={() => { setResults(null); setMode(null); }} />;
  }

  if (!mode) {
    return (
      <div className="app-container">
        <h1>Juego de Verbos Irregulares en Inglés</h1>
        <button onClick={() => setMode('short')}>15 Palabras</button>
        <button onClick={() => setMode('full')}>Modo Completo</button>
      </div>
    );
  }

  return <Game mode={mode} onFinish={setResults} />;
}

export default App;
