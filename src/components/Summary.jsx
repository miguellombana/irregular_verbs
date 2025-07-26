import React, { useState } from 'react';

const Summary = ({ results, onRestart, isStatsView = false }) => {
  const [showHistory, setShowHistory] = useState(isStatsView);
  const [showDetailedTimes, setShowDetailedTimes] = useState(false);

  // Función para formatear tiempo
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  // Obtener historial de estadísticas
  const getStats = () => {
    return JSON.parse(localStorage.getItem('irregularVerbsStats') || '[]');
  };

  // Obtener mejores estadísticas
  const getBestStats = () => {
    const allStats = getStats();
    if (allStats.length === 0) return null;

    const bestAccuracy = Math.max(...allStats.map(s => s.accuracy));
    const bestTime = Math.min(...allStats.map(s => s.averageTime));
    const bestGame = allStats.find(s => s.accuracy === bestAccuracy);
    const fastestGame = allStats.find(s => s.averageTime === bestTime);

    return {
      bestAccuracy: bestAccuracy,
      bestTime: bestTime,
      bestGame: bestGame,
      fastestGame: fastestGame,
      totalGames: allStats.length
    };
  };

  const bestStats = getBestStats();
  const allStats = getStats().slice(-10).reverse(); // Últimas 10 partidas

  return (
    <div className="summary-container">
      <h2>{isStatsView ? '📊 Tus Estadísticas' : 'Resumen de Resultados'}</h2>
      
      {/* Estadísticas actuales - solo si no es vista de stats */}
      {!isStatsView && (
        <div className="current-stats">
          <p><strong>Aciertos:</strong> {results.correct} / {results.total}</p>
          <p><strong>Precisión:</strong> {results.accuracy ? results.accuracy.toFixed(1) : 0}%</p>
          <p><strong>Tiempo total:</strong> {results.totalTime ? formatTime(results.totalTime) : 'N/A'}</p>
          <p><strong>Tiempo promedio:</strong> {results.averageTime ? formatTime(results.averageTime) : 'N/A'}</p>
          <p><strong>Modo:</strong> {results.mode === 'short' ? '15 Palabras' : 'Modo Completo'}</p>
        </div>
      )}

      {/* Mejores estadísticas */}
      {bestStats && (
        <div className="best-stats">
          <h3>🏆 Tus Mejores Estadísticas</h3>
          <p><strong>Mejor precisión:</strong> {bestStats.bestAccuracy.toFixed(1)}%</p>
          <p><strong>Mejor tiempo promedio:</strong> {formatTime(bestStats.bestTime)}</p>
          <p><strong>Total de partidas:</strong> {bestStats.totalGames}</p>
          {bestStats.bestGame && (
            <p><strong>Última mejor partida:</strong> {new Date(bestStats.bestGame.date).toLocaleDateString()}</p>
          )}
        </div>
      )}

      {/* Botón para mostrar tiempos detallados - solo si no es vista de stats */}
      {!isStatsView && results.questionTimes && results.questionTimes.length > 0 && (
        <div className="detailed-times">
          <button 
            onClick={() => setShowDetailedTimes(!showDetailedTimes)}
            className="toggle-button"
          >
            {showDetailedTimes ? 'Ocultar' : 'Ver'} Tiempos por Pregunta
          </button>
          
          {showDetailedTimes && (
            <div className="times-list">
              <h4>Tiempo por Pregunta:</h4>
              <ul>
                {results.questionTimes.map((qt, idx) => (
                  <li key={idx} className={qt.correct ? 'correct-answer' : 'incorrect-answer'}>
                    <strong>{qt.verb}</strong>: {formatTime(qt.time)} 
                    {qt.correct ? ' ✅' : ' ❌'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Errores - solo si no es vista de stats */}
      {!isStatsView && results.errors.length > 0 && (
        <div className="errors-section">
          <h3>❌ Errores cometidos:</h3>
          <ul>
            {results.errors.map((err, idx) => (
              <li key={idx}>
                <b>{err.es}</b>: {err.user} → <span style={{color:'#8B4513'}}>{err.en.join(' - ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historial */}
      <div className="history-section">
        {!isStatsView && (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="toggle-button"
          >
            {showHistory ? 'Ocultar' : 'Ver'} Historial Reciente
          </button>
        )}
        
        {(showHistory || isStatsView) && allStats.length > 0 && (
          <div className="history-list">
            <h4>📊 {isStatsView ? 'Todas tus Partidas:' : 'Últimas 10 Partidas:'}</h4>
            <div className="stats-grid">
              {(isStatsView ? allStats.slice(0, 20) : allStats).map((stat, idx) => (
                <div key={stat.id} className="stat-card">
                  <p><strong>#{isStatsView ? allStats.length - idx : allStats.length - idx}</strong></p>
                  <p>{stat.accuracy.toFixed(1)}% ({stat.correct}/{stat.total})</p>
                  <p>{formatTime(stat.averageTime)} avg</p>
                  <p>{stat.mode === 'short' ? '15P' : 'Full'}</p>
                  <p className="date">{new Date(stat.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isStatsView && allStats.length === 0 && (
          <div className="no-stats">
            <p>🎯 ¡Aún no has jugado ninguna partida!</p>
            <p>Comienza a jugar para ver tus estadísticas aquí.</p>
          </div>
        )}
      </div>

      <div className="actions">
        <button onClick={onRestart} className="restart-button">
          {isStatsView ? 'Volver al Menú' : 'Volver a jugar'}
        </button>
        {allStats.length > 0 && (
          <button 
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
                localStorage.removeItem('irregularVerbsStats');
                alert('Historial borrado');
                if (isStatsView) onRestart();
              }
            }}
            className="clear-button"
          >
            Borrar Historial
          </button>
        )}
      </div>
    </div>
  );
};

export default Summary;
