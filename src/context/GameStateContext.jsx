import { createContext, useContext, useState, useCallback } from 'react';

const GameStateContext = createContext();

export function GameStateProvider({ children }) {
    // Game state
    const [isCheckpointUIActive, setIsCheckpointUIActive] = useState(false);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(true); // Start with instructions open
    const [answeredCheckpoints, setAnsweredCheckpoints] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(600); // Default time limit

    // Memoize functions to prevent unnecessary re-renders
    const handleCorrectAnswer = useCallback((question, answer) => {
        setAnsweredCheckpoints(prev => [...prev, { question, answer }]);
    }, []);

    const resetGameState = useCallback(() => {
        setAnsweredCheckpoints([]);
        setGameOver(false);
        setIsTimerStarted(false);
        setIsCheckpointUIActive(false);
        setIsInstructionsOpen(true);
        setTimeRemaining(600); // Reset to default time
    }, []);

    // Create a stable context value object using useCallback
    const contextValue = {
        isCheckpointUIActive, 
        setIsCheckpointUIActive,
        isTimerStarted,
        setIsTimerStarted,
        isInstructionsOpen,
        setIsInstructionsOpen,
        answeredCheckpoints,
        setAnsweredCheckpoints,
        handleCorrectAnswer,
        gameOver,
        setGameOver,
        timeRemaining,
        setTimeRemaining,
        resetGameState
    };

    return (
        <GameStateContext.Provider value={contextValue}>
            {children}
        </GameStateContext.Provider>
    );
}

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};
