import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameState } from '../context/GameStateContext';
import './Timer.css';

function Timer({ initialTime, timeBonus = 0, onTimeUp, onTimeUpdate, stop, isLoading }) {
    const [timeLeft, setTimeLeft] = useState(initialTime + timeBonus);
    const startTimeRef = useRef(null);
    const { isTimerStarted } = useGameState();

    useEffect(() => {
        if (stop || isLoading || !isTimerStarted) {
            onTimeUpdate?.(timeLeft);
            return;
        }

        if (!startTimeRef.current && isTimerStarted) {
            startTimeRef.current = Date.now();
        }

        const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, Math.ceil((initialTime * 1000 - elapsedTime) / 1000));
            
            setTimeLeft(remaining);
            onTimeUpdate?.(remaining);
            
            if (remaining <= 0) {
                onTimeUp();
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [initialTime, onTimeUp, onTimeUpdate, stop, isLoading, isTimerStarted]);

    useEffect(() => {
        setTimeLeft(prevTime => prevTime + timeBonus);
    }, [timeBonus]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
        </div>
    );
}

export default Timer;
