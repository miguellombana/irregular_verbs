import React, { useState } from 'react';
import Game from './components/Game';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [results, setResults] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Función para obtener estadísticas guardadas
  const getSavedStats = () => {
    return JSON.parse(localStorage.getItem('irregularVerbsStats') || '[]');
  };

  // Si estamos mostrando estadísticas
  if (showStats) {
    const savedStats = getSavedStats();
    const dummyResults = {
      total: 0,
      correct: 0,
      errors: [],
      totalTime: 0,
      questionTimes: [],
      averageTime: 0,
      accuracy: 0,
      mode: 'stats'
    };
    
    return (
      <Summary 
        results={dummyResults} 
        onRestart={() => setShowStats(false)}
        isStatsView={true}
      />
    );
  }

  if (results) {
    return <Summary results={results} onRestart={() => { setResults(null); setMode(null); }} />;
  }

  if (!mode) {
    const hasStats = getSavedStats().length > 0;
    
    return (
      <div className="app-container">
        <h1>Irregular Verbs</h1>
        <p className="subtitle">Master English Irregular Verbs</p>
        <div className="game-buttons">
          <button onClick={() => setMode('short')}>15 Palabras</button>
          <button onClick={() => setMode('full')}>Modo Completo</button>
        </div>
        {hasStats && (
          <div className="stats-section">
            <button 
              onClick={() => setShowStats(true)}
              className="stats-button"
            >
              📊 Ver Estadísticas
            </button>
          </div>
        )}
      </div>
    );
  }

  return <Game mode={mode} onFinish={setResults} />;
}

export default App;
