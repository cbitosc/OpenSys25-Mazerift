import { Canvas } from '@react-three/fiber'
import { CannonWorldProvider } from '../context/CannonWorldContext'
import Floor from '../world/Floor'
import Character from '../world/Character'
import Checkpoint from '../world/Checkpoint'
import CheckpointUI from './CheckpointUI'
import { availableMaps } from '../config/maps'
import LoadingScreen from './LoadingScreen'
import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import AnsweredCheckpoints from './AnsweredCheckpoints';
import Maze from '../world/Maze'
import Skybox from '../world/Skybox';
import StatsPanel from './StatsPanel';
import FloatingText from '../world/FloatingText';
import Timer from './Timer';
import GameOver from './GameOver';
import { useProgress } from '@react-three/drei'
import GameInstructions from './GameInstructions';
import { GameStateProvider } from '../context/GameStateContext';
import COSCCube from '../world/COSCCube'

function GameWorld({ mapId }) {
  const { active: isLoading } = useProgress();
  const mapConfig = availableMaps.find(map => map.id === mapId);
  const [isNearCheckpoint, setIsNearCheckpoint] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const characterRef = useRef();
  const timeLimit = 600; // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  const handleCorrectAnswer = (question, answer) => {
    setAnsweredCheckpoints(prev => [...prev, { question, answer }]);
  };

  const isCheckpointAnswered = (checkpoint) => {
    return answeredCheckpoints.some(ac => ac.question === checkpoint.question);
  };

  const handleCheckpointNear = (checkpoint) => {
    setIsNearCheckpoint(true);
    setCurrentCheckpoint(checkpoint);
  };

  const handleCheckpointLeave = (checkpoint) => {
    if (currentCheckpoint?.id === checkpoint.id) {
      setIsNearCheckpoint(false);
      setCurrentCheckpoint(null);
    }
  };

  useEffect(() => {
    if (answeredCheckpoints.length === mapConfig.checkpoints.length) {
      setGameOver(true);
    }
  }, [answeredCheckpoints, mapConfig.checkpoints]);

  const handleTimeUpdate = (currentTime) => {
    setTimeRemaining(currentTime);
  };

  const handleTimeUp = useCallback(() => {
    if (answeredCheckpoints.length < mapConfig.checkpoints.length) {
      setGameOver(true);
    }
  }, [answeredCheckpoints.length, mapConfig.checkpoints.length]);

  useEffect(() => {
    if (timeRemaining <= 0 && !gameOver) {
      handleTimeUp();
    }
  }, [timeRemaining, gameOver, handleTimeUp]);

  useEffect(() => {
    setAnsweredCheckpoints([]);
    setTimeRemaining(timeLimit);
    setGameOver(false);
  }, [mapId, timeLimit]);

  return (
    <GameStateProvider>
      <GameInstructions />
      {/* <StatsPanel /> */}
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
                isAnswered={answeredCheckpoints.some(ac => ac.question === checkpoint.question)}
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
          currentMapData={mapConfig}
          timeLeft={timeRemaining}
        />
      )}
    </GameStateProvider>
  )
}

export default GameWorld
