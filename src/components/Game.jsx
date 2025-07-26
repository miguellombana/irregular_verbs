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
  const verbList = useMemo(() => (mode === 'short' ? getRandomVerbs(15) : verbs), [mode]);

  useEffect(() => {
    setCurrent(0);
    setAnswers([]);
    setInputs({infinitive: '', past: '', participle: ''});
    setFeedback(null);
    setErrorList([]);
    setWaitingNext(false);
  }, [mode]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    // No cambiar pregunta aquí
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (waitingNext) return;
    const userForms = [inputs.infinitive, inputs.past, inputs.participle];
    const correct = validateAnswer(userForms, verbList[current].en);
    setAnswers([...answers, correct]);
    if (correct) {
      setFeedback('✅ Correcto');
      setTimeout(() => {
        setFeedback(null);
        setInputs({infinitive: '', past: '', participle: ''});
        if (current + 1 < verbList.length) {
          setCurrent(current + 1);
        } else {
          onFinish({
            total: verbList.length,
            correct: answers.filter(Boolean).length + 1,
            errors: errorList,
          });
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
    } else {
      onFinish({
        total: verbList.length,
        correct: answers.filter(Boolean).length,
        errors: errorList,
      });
    }
  };

  return (
    <div className="game-container">
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
