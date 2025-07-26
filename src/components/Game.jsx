import React, { useState, useEffect, useMemo } from 'react';
import verbs from '../data/verbs.json';
import { validateAnswer } from '../utils/validation';

function getRandomVerbs(count) {
  const shuffled = [...verbs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const Game = ({ mode, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputs, setInputs] = useState({infinitive: '', past: '', participle: ''});
  const [errorList, setErrorList] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [waitingNext, setWaitingNext] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [currentQuestionTime, setCurrentQuestionTime] = useState(Date.now());
  const [questionTimes, setQuestionTimes] = useState([]);
  const [timer, setTimer] = useState(0);
  const verbList = useMemo(() => (mode === 'short' ? getRandomVerbs(15) : verbs), [mode]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Date.now() - currentQuestionTime);
    }, 100);
    return () => clearInterval(interval);
  }, [currentQuestionTime]);

  useEffect(() => {
    setCurrent(0);
    setAnswers([]);
    setInputs({infinitive: '', past: '', participle: ''});
    setFeedback(null);
    setErrorList([]);
    setWaitingNext(false);
    setStartTime(Date.now());
    setCurrentQuestionTime(Date.now());
    setQuestionTimes([]);
    setTimer(0);
  }, [mode]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    // No cambiar pregunta aquí
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (waitingNext) return;
    
    const responseTime = Date.now() - currentQuestionTime;
    const userForms = [inputs.infinitive, inputs.past, inputs.participle];
    const correct = validateAnswer(userForms, verbList[current].en);
    
    // Guardar tiempo de respuesta
    const newQuestionTimes = [...questionTimes, {
      verb: verbList[current].es,
      time: responseTime,
      correct: correct
    }];
    setQuestionTimes(newQuestionTimes);
    
    setAnswers([...answers, correct]);
    
    if (correct) {
      setFeedback('✅ Correcto');
      setTimeout(() => {
        setFeedback(null);
        setInputs({infinitive: '', past: '', participle: ''});
        if (current + 1 < verbList.length) {
          setCurrent(current + 1);
          setCurrentQuestionTime(Date.now());
          setTimer(0);
        } else {
          const totalTime = Date.now() - startTime;
          const correctAnswers = answers.filter(Boolean).length + 1;
          const finalStats = {
            total: verbList.length,
            correct: correctAnswers,
            errors: errorList,
            totalTime: totalTime,
            questionTimes: newQuestionTimes,
            averageTime: totalTime / verbList.length,
            accuracy: (correctAnswers / verbList.length) * 100,
            mode: mode
          };
          
          // Guardar estadísticas en localStorage
          saveStats(finalStats);
          onFinish(finalStats);
        }
      }, 1200);
    } else {
      setFeedback(`❌ Incorrecto. Respuesta: ${verbList[current].en.join(' - ')}`);
      setErrorList([...errorList, { ...verbList[current], user: userForms.join(' - ') }]);
      setWaitingNext(true);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setInputs({infinitive: '', past: '', participle: ''});
    setWaitingNext(false);
    if (current + 1 < verbList.length) {
      setCurrent(current + 1);
      setCurrentQuestionTime(Date.now());
      setTimer(0);
    } else {
      const totalTime = Date.now() - startTime;
      const correctAnswers = answers.filter(Boolean).length;
      const finalStats = {
        total: verbList.length,
        correct: correctAnswers,
        errors: errorList,
        totalTime: totalTime,
        questionTimes: questionTimes,
        averageTime: totalTime / verbList.length,
        accuracy: (correctAnswers / verbList.length) * 100,
        mode: mode
      };
      
      // Guardar estadísticas en localStorage
      saveStats(finalStats);
      onFinish(finalStats);
    }
  };

  // Función para guardar estadísticas
  const saveStats = (stats) => {
    const existingStats = JSON.parse(localStorage.getItem('irregularVerbsStats') || '[]');
    const newStats = {
      ...stats,
      date: new Date().toISOString(),
      id: Date.now()
    };
    existingStats.push(newStats);
    
    // Mantener solo las últimas 50 partidas
    if (existingStats.length > 50) {
      existingStats.splice(0, existingStats.length - 50);
    }
    
    localStorage.setItem('irregularVerbsStats', JSON.stringify(existingStats));
  };

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

  return (
    <div className="game-container">
      <div className="timer-container">
        <span className="timer">⏱️ {formatTime(timer)}</span>
      </div>
      <h2>Verbo en español: <b>{verbList[current].es}</b></h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="infinitive"
          value={inputs.infinitive}
          onChange={handleChange}
          placeholder="Infinitivo"
          autoFocus
          disabled={waitingNext}
        />
        <input
          type="text"
          name="past"
          value={inputs.past}
          onChange={handleChange}
          placeholder="Pasado simple"
          disabled={waitingNext}
        />
        <input
          type="text"
          name="participle"
          value={inputs.participle}
          onChange={handleChange}
          placeholder="Participio pasado"
          disabled={waitingNext}
        />
        <button type="submit" disabled={waitingNext}>Enviar</button>
      </form>
      <div className="progress">{current + 1} de {verbList.length}</div>
      {feedback && <div className="feedback">{feedback}</div>}
      {waitingNext && (
        <button onClick={handleNext} style={{marginTop: '16px'}}>Siguiente</button>
      )}
    </div>
  );
};

export default Game;
