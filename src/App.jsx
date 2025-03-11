import { useState, useEffect } from 'react'
import GameMenu from './components/GameMenu'
import GameWorld from './components/GameWorld'
import GameOver from './components/GameOver'
import './App.css'

function App() {
  useEffect(() => {
    document.title = 'Mazerfit - OpenSys';
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [timer, setTimer] = useState(600); 

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStartGame = () => {
    if (selectedMap) {
      setIsPlaying(true);
    }
  };

  const handleMapSelect = (mapId) => {
    setSelectedMap(mapId);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!isPlaying ? (
        timer === 0 ? (
          <GameOver />
        ) : (
          <GameMenu 
            onStartGame={handleStartGame} 
            onMapSelect={handleMapSelect}
            selectedMap={selectedMap}
          />
        )
      ) : (
        <GameWorld mapId={selectedMap} timer={timer} />
      )}
    </div>
  )
}

export default App
