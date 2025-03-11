import { Canvas } from '@react-three/fiber'
import { CannonWorldProvider } from '../context/CannonWorldContext'
import Floor from '../world/Floor'
import Character from '../world/Character'
import Checkpoint from '../world/Checkpoint'
import CheckpointUI from './CheckpointUI'
import { availableMaps } from '../config/maps'
import LoadingScreen from './LoadingScreen'
import { Suspense, useState, useRef, useEffect, useCallback, useMemo } from 'react'
import AnsweredCheckpoints from './AnsweredCheckpoints';
import Maze from '../world/Maze'
import Skybox from '../world/Skybox';
import StatsPanel from './StatsPanel';
import FloatingText from '../world/FloatingText';
import Timer from './Timer';
import GameOver from './GameOver';
import { useProgress } from '@react-three/drei'
import GameInstructions from './GameInstructions';
import { useGameState } from '../context/GameStateContext';
import COSCCube from '../world/COSCCube'

function GameWorld({ mapId }) {
  const { active: isLoading } = useProgress();
  const { 
    answeredCheckpoints, 
    setAnsweredCheckpoints, 
    handleCorrectAnswer,
    gameOver,
    setGameOver,
    timeRemaining,
    setTimeRemaining,
    resetGameState,
    setIsTimerStarted
  } = useGameState();
  
  // Constants
  const timeLimit = 600;
  
  // Local state
  const [isNearCheckpoint, setIsNearCheckpoint] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
  const characterRef = useRef();

  // Memoized map config to prevent unnecessary recalculations
  const mapConfig = useMemo(() => {
    const config = availableMaps.find(map => map.id === mapId);
    if (!config) {
      console.error(`Map with id ${mapId} not found`);
      return availableMaps[0]; 
    }
    return config;
  }, [mapId]);

  // Refs to track values without causing re-renders
  const mapConfigRef = useRef(mapConfig);
  const answeredCheckpointsRef = useRef(answeredCheckpoints);
  const timeRemainingRef = useRef(timeRemaining);
  const gameOverRef = useRef(gameOver);

  // Update refs when values change
  useEffect(() => {
    mapConfigRef.current = mapConfig;
  }, [mapConfig]);

  useEffect(() => {
    answeredCheckpointsRef.current = answeredCheckpoints;
  }, [answeredCheckpoints]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  // Reset game state when map changes
  useEffect(() => {
    resetGameState();
    setTimeRemaining(timeLimit);
    
    // Start the timer after a short delay to allow everything to initialize
    const timerStartTimeout = setTimeout(() => {
      setIsTimerStarted(true);
    }, 500);
    
    return () => clearTimeout(timerStartTimeout);
  }, [mapId, resetGameState, setTimeRemaining, setIsTimerStarted]);

  // Check if all checkpoints are answered
  useEffect(() => {
    if (!gameOverRef.current && 
        answeredCheckpointsRef.current.length > 0 && 
        answeredCheckpointsRef.current.length === mapConfigRef.current.checkpoints.length) {
      setGameOver(true);
    }
  }, [answeredCheckpoints.length, setGameOver]);

  // Helper functions
  const isCheckpointAnswered = useCallback((checkpoint) => {
    return answeredCheckpointsRef.current.some(ac => ac.question === checkpoint.question);
  }, []);

  const handleCheckpointNear = useCallback((checkpoint) => {
    setIsNearCheckpoint(true);
    setCurrentCheckpoint(checkpoint);
  }, []);

  const handleCheckpointLeave = useCallback((checkpoint) => {
    if (currentCheckpoint?.id === checkpoint.id) {
      setIsNearCheckpoint(false);
      setCurrentCheckpoint(null);
    }
  }, [currentCheckpoint]);

  // Memoized handlers for Timer component
  const handleTimeUpdate = useCallback((currentTime) => {
    if (currentTime !== timeRemainingRef.current) {
      setTimeRemaining(currentTime);
    }
  }, [setTimeRemaining]);

  const handleTimeUp = useCallback(() => {
    if (!gameOverRef.current && 
        answeredCheckpointsRef.current.length < mapConfigRef.current.checkpoints.length) {
      setGameOver(true);
    }
  }, [setGameOver]);

  // Check if time is up
  useEffect(() => {
    if (timeRemaining <= 0 && !gameOver) {
      handleTimeUp();
    }
  }, [timeRemaining, gameOver, handleTimeUp]);

  if (!mapConfig) {
    return null;
  }

  return (
    <>
      <GameInstructions />
      <LoadingScreen />
      <AnsweredCheckpoints checkpoints={answeredCheckpoints} />
      <CheckpointUI 
        isNearCheckpoint={isNearCheckpoint && currentCheckpoint && !isCheckpointAnswered(currentCheckpoint)}
        question={currentCheckpoint?.question}
        answer={currentCheckpoint?.answer}
        onCorrectAnswer={handleCorrectAnswer}
        checkpointTitle={currentCheckpoint?.title}
        checkpointSubtitle={currentCheckpoint?.subtitle}
      />
      <Timer 
        initialTime={timeLimit} 
        onTimeUp={handleTimeUp} 
        onTimeUpdate={handleTimeUpdate}
        stop={gameOver}
        isLoading={isLoading}  
      />
      <CannonWorldProvider>
        <Canvas camera={{ fov: 75, near: 0.1, far: 2000 }}>
          <Suspense fallback={null}>
            <FloatingText target={characterRef.current} />
            <Skybox target={characterRef.current} />
            <Floor />
            <Maze layout={mapConfig.mazeLayout} />
            <Character ref={characterRef} startPosition={mapConfig.playerStart} />
            {mapConfig.checkpoints.map((checkpoint) => (
              <Checkpoint
                key={checkpoint.id}
                position={checkpoint.position}
                onPlayerNear={() => handleCheckpointNear(checkpoint)}
                onPlayerLeave={() => handleCheckpointLeave(checkpoint)}
                title={checkpoint.title}
                subtitle={checkpoint.subtitle}
                isAnswered={isCheckpointAnswered(checkpoint)}
              />
            ))}
            <COSCCube position={[-6, 2, -6]} />
            <COSCCube position={[6, 2, 6]} />
            <COSCCube position={[-6, 2, 6]} />
            <COSCCube position={[6, 2, -6]} />
            <ambientLight intensity={mapConfig.ambientLight || 0.3} color="pink"/>
            <directionalLight position={[0, 5, 5]} color="white" intensity={0.8} />
          </Suspense>
        </Canvas>
      </CannonWorldProvider>
      {gameOver && (
        <GameOver 
          checkpoints={answeredCheckpoints}
          currentMapData={mapConfigRef.current}
          timeLeft={timeRemaining}
        />
      )}
    </>
  );
}

export default GameWorld
