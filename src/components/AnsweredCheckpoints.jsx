import { useState } from 'react';
import './AnsweredCheckpoints.css';

function AnsweredCheckpoints({ checkpoints }) {
    const [isVisible, setIsVisible] = useState(false);

    if (checkpoints.length === 0) return null;

    return (
        <div className="answered-checkpoints-container">
            {!isVisible ? (
                <button 
                    onClick={() => setIsVisible(true)}
                    className="sci-fi-toggle-button"
                >
                    <span className="button-text">Progress</span>
                    <div className="button-glow"></div>
                </button>
            ) : (
                <div className="logs-panel">
                    <div className="panel-header">
                        <div className="header-decoration"></div>
                        <h3>Checkpoints Cleared: {checkpoints.length} / 5</h3>
                        <div className="header-decoration"></div>
                    </div>
                    <div className="logs-content">
                        {checkpoints.map((cp, index) => (
                            <div key={index} className="log-entry">
                                <span className="log-question">{cp.question}</span>
                                <span className="log-answer">{cp.answer}</span>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="sci-fi-button close"
                    >
                        Close Terminal
                    </button>
                </div>
            )}
        </div>
    );
}

export default AnsweredCheckpoints;