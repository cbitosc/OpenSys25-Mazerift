import { createContext, useContext, useState } from 'react';

const GameStateContext = createContext();

export function GameStateProvider({ children }) {
    const [isCheckpointUIActive, setIsCheckpointUIActive] = useState(false);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

    return (
        <GameStateContext.Provider value={{ 
            isCheckpointUIActive, 
            setIsCheckpointUIActive,
            isTimerStarted,
            setIsTimerStarted,
            isInstructionsOpen,
            setIsInstructionsOpen
        }}>
            {children}
        </GameStateContext.Provider>
    );
}

export const useGameState = () => useContext(GameStateContext);
