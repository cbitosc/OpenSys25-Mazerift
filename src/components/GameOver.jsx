import React, { useState } from 'react';
import './GameOver.css';

function GameOver({ checkpoints = [], currentMapData = { checkpoints: [] }, timeLeft }) {
  const [copied, setCopied] = useState(false);
  const totalCheckpoints = currentMapData?.checkpoints?.length || 0;
  const isWin = checkpoints?.length === totalCheckpoints && timeLeft > 0;

  const formatTime = (seconds) => {
    if (typeof seconds !== 'number') return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateMarkdown = () => {
    const completionStatus = isWin 
      ? `Completed with ${formatTime(timeLeft)} remaining` 
      : `Incomplete - ${timeLeft <= 0 ? "Time's up" : "Not all checkpoints found"}`;
    
    const markdown = `## Maze Solutions - ${completionStatus}
${checkpoints.map((cp, i) => (
  `### Checkpoint ${i + 1}
- Question: ${cp?.question || 'N/A'}
- Answer: ${cp?.answer || 'N/A'}
`)).join('\n')}`;
    return markdown;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-card">
        <h1 className={`game-over-title ${isWin ? 'win' : 'lose'}`}>
          {timeLeft <= 0 ? 'Time\'s Up!' : isWin ? 'Congratulations!' : 'Game Over'}
        </h1>
        
        {isWin ? (
          <div className="completion-message">
            <p>You've completed all checkpoints!</p>
            <span className="time-remaining">
              Time remaining: {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <div className="completion-message">
            <p>{timeLeft <= 0 ? 'You ran out of time!' : 'You haven\'t found all checkpoints yet!'}</p>
            <p>Checkpoints found: {checkpoints.length} / {totalCheckpoints}</p>
          </div>
        )}

        <div className="game-over-stats">
          <h2 className="section-heading">Challenge Results</h2>
          <p className="checkpoint-progress">
            {checkpoints.length} / {totalCheckpoints} checkpoints
          </p>
          <div className="checkpoints-list">
            {checkpoints.length > 0 ? (
              checkpoints.map((checkpoint, index) => (
                <div key={index} className="checkpoint-item">
                  <div className="checkpoint-header">
                    <span className="checkpoint-dot"></span>
                    <h3>Checkpoint {index + 1}</h3>
                  </div>
                  <p className="checkpoint-question">Q: {checkpoint.question}</p>
                  <p className="checkpoint-answer">A: {checkpoint.answer}</p>
                </div>
              ))
            ) : (
              <p className="no-checkpoints">No checkpoints completed</p>
            )}
          </div>
        </div>

        <div className="markdown-section">
          <h2 className="section-heading">Solution Format</h2>
          <div className="markdown-preview">
            <pre>{generateMarkdown()}</pre>
            <button 
              className={`markdown-copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              <span className="button-text">
                {copied ? 'Copied!' : 'Copy Markdown'}
              </span>
              <span className="button-icon">
                {copied ? '' : ''}
              </span>
            </button>
          </div>
        </div>

        {currentMapData?.githubRepo && (
          <div className="contribution-section">
            <h2 className="section-heading">Submit Your Solution</h2>
            <p>Submit the answers by creating a pull request to the repository attached to the link below!</p>
            <a 
              href={currentMapData.githubRepo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="github-link"
            >
              Submit Solution
            </a>
          </div>
        )}

        <div className="instagram-section">
          <h2 className="section-heading">Follow Us!</h2>
          <p className="instagram-text">Follow COSC on Instagram for more updates and events!</p>
          <div className="qr-container">
            <img 
              src="/cosc-instagram.png" 
              alt="COSC Instagram QR Code" 
              className="instagram-qr"
            />
          </div>
          <a 
            href="https://www.instagram.com/cbitosc" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link"
          >
            @cbitosc
          </a>
        </div>

        {/* <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Try Again
        </button> */}
      </div>
    </div>
  );
}

export default GameOver;