import { useEffect, useState } from 'react'
import { useGameState } from '../context/GameStateContext'

export const useCharacterControls = () => {
    const { isCheckpointUIActive, isInstructionsOpen } = useGameState();
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        sprint: false
    });

    useEffect(() => {
        // Reset movement when either UI is active
        if (isCheckpointUIActive || isInstructionsOpen) {
            setMovement({
                forward: false,
                backward: false,
                left: false,
                right: false,
                jump: false,
                sprint: false
            });
            return;
        }

        const handleKeyDown = (event) => {
            if (isCheckpointUIActive || isInstructionsOpen) return;
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((m) => ({ ...m, forward: true }));
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((m) => ({ ...m, left: true }));
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((m) => ({ ...m, right: true }));
                    break;
                case 'ShiftLeft':
                    setMovement((m) => ({ ...m, sprint: true }));
                    break;
            }
        };

        const handleKeyUp = (event) => {
            if (isCheckpointUIActive || isInstructionsOpen) return;
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((m) => ({ ...m, forward: false }));
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    setMovement((m) => ({ ...m, backward: false }));
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((m) => ({ ...m, left: false }));
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((m) => ({ ...m, right: false }));
                    break;
                case 'ShiftLeft':
                    setMovement((m) => ({ ...m, sprint: false }));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isCheckpointUIActive, isInstructionsOpen]);

    return movement;
};
