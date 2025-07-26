import React from 'react';

const Summary = ({ results, onRestart }) => (
  <div className="summary-container">
    <h2>Resumen de Resultados</h2>
    <p>Aciertos: {results.correct} / {results.total}</p>
    <p>Errores: {results.errors.length}</p>
    {results.errors.length > 0 && (
      <div>
        <h3>Errores cometidos:</h3>
        <ul>
          {results.errors.map((err, idx) => (
            <li key={idx}>
              <b>{err.es}</b>: {err.user} → <span style={{color:'red'}}>{err.en.join(' - ')}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    <button onClick={onRestart}>Volver a jugar</button>
  </div>
);

export default Summary;
