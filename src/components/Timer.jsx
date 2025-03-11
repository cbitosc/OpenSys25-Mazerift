import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../context/GameStateContext';
import './Timer.css';

function Timer({ initialTime, timeBonus = 0, onTimeUp, onTimeUpdate, stop, isLoading }) {
    const [timeLeft, setTimeLeft] = useState(initialTime + timeBonus);
    const { isTimerStarted } = useGameState();
    
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const timeBonusRef = useRef(timeBonus);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onTimeUpRef = useRef(onTimeUp);
    const stopRef = useRef(stop);
    const isLoadingRef = useRef(isLoading);
    const isTimerStartedRef = useRef(isTimerStarted);
    
    useEffect(() => {
        timeBonusRef.current = timeBonus;
    }, [timeBonus]);
    
    useEffect(() => {
        onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);
    
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);
    
    useEffect(() => {
        stopRef.current = stop;
    }, [stop]);
    
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);
    
    useEffect(() => {
        isTimerStartedRef.current = isTimerStarted;
    }, [isTimerStarted]);
    
    useEffect(() => {
        if (timeBonus > 0) {
            setTimeLeft(prevTime => prevTime + timeBonus);
        }
    }, [timeBonus]);
    
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (stop || isLoading || !isTimerStarted) {
            return;
        }
        
        if (!startTimeRef.current && isTimerStarted) {
            startTimeRef.current = Date.now();
        }
        
        intervalRef.current = setInterval(() => {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, Math.ceil((initialTime * 1000 - elapsedTime) / 1000));
            
            setTimeLeft(remaining);
            
            onTimeUpdateRef.current?.(remaining);
            
            if (remaining <= 0) {
                onTimeUpRef.current?.();
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 100);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [initialTime, isTimerStarted, stop, isLoading]);
    
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
