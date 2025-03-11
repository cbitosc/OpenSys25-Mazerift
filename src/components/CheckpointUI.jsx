import { useState, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';
import './CheckpointUI.css';

function CheckpointUI({ isNearCheckpoint, question, answer, onCorrectAnswer, checkpointTitle, checkpointSubtitle }) {
    const { setIsCheckpointUIActive } = useGameState();
    const [showQuestion, setShowQuestion] = useState(false);
    const [userAnswer, setUserAnswer] = useState([]);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isNearCheckpoint) {
            setShowQuestion(false);
            setUserAnswer(Array(answer?.length || 0).fill(''));
            setError('');
            setCurrentIndex(0);
        }
    }, [isNearCheckpoint, question, answer]);

    useEffect(() => {
        if (answer) {
            setUserAnswer(Array(answer.length).fill(''));
        }
    }, [answer]);

    useEffect(() => {
        setIsCheckpointUIActive(showQuestion);
    }, [showQuestion, setIsCheckpointUIActive]);

    const handleLetterInput = (value, index) => {
        const newAnswer = [...userAnswer];
        newAnswer[index] = value.toLowerCase();
        setUserAnswer(newAnswer);

        // Auto-advance to next input if there's a value
        if (value && index < answer.length - 1) {
            setCurrentIndex(index + 1);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !userAnswer[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            setCurrentIndex(index - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedAnswer = userAnswer.join('').toLowerCase();
        if (submittedAnswer === answer.toLowerCase()) {
            onCorrectAnswer(question, answer);
            setShowQuestion(false);
            setUserAnswer(Array(answer?.length || 0).fill(''));
            setError('');
        } else {
            setError('Incorrect answer, try again!');
        }
    };

    if (!isNearCheckpoint && !showQuestion) return null;

    return (
        <>
            {showQuestion && <div className="backdrop" />}
            <div className={`checkpoint-container ${showQuestion ? 'show-panel' : ''}`}>
                {!showQuestion ? (
                    <button 
                        onClick={() => setShowQuestion(true)}
                        className="checkpoint-button"
                    >
                        <span className="button-text">Access Checkpoint</span>
                        <div className="button-glow"></div>
                    </button>
                ) : (
                    <div className="checkpoint-panel">
                        <div className="panel-header">
                            <div className="header-decoration"></div>
                            <h2 className="checkpoint-title">{checkpointTitle || 'Terminal Access'}</h2>
                            {checkpointSubtitle && <h3 className="checkpoint-subtitle">{checkpointSubtitle}</h3>}
                            <div className="header-decoration"></div>
                        </div>
                        <div className="question-container">
                            <h3 className="question-text">{question}</h3>
                        </div>
                        {answer && (
                            <form onSubmit={handleSubmit} className="panel-form">
                                <div className="letter-input-container">
                                    {userAnswer.map((letter, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            className="letter-input"
                                            value={letter}
                                            onChange={(e) => handleLetterInput(e.target.value, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={index === currentIndex ? (input) => input?.focus() : null}
                                        />
                                    ))}
                                </div>
                                <div className="button-container">
                                    <button type="submit" className="sci-fi-button submit">
                                        Validate
                                    </button>
                                    <button 
                                        onClick={() => setShowQuestion(false)}
                                        className="sci-fi-button cancel"
                                        type="button"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </form>
                        )}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}
            </div>
        </>
    );
}

export default CheckpointUI;
