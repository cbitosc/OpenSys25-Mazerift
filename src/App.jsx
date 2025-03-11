import { useState, useEffect } from 'react'
import GameMenu from './components/GameMenu'
import GameWorld from './components/GameWorld'
import GameOver from './components/GameOver'
import { GameStateProvider } from './context/GameStateContext'
import './App.css'

function App() {
  useEffect(() => {
    document.title = 'Mazerfit - OpenSys';
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);

  const handleStartGame = () => {
    if (selectedMap) {
      setIsPlaying(true);
    }
  };

  const handleMapSelect = (mapId) => {
    setSelectedMap(mapId);
  };

  return (
    <GameStateProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        {!isPlaying ? (
          <GameMenu 
            onStartGame={handleStartGame} 
            onMapSelect={handleMapSelect}
            selectedMap={selectedMap}
          />
        ) : (
          <GameWorld mapId={selectedMap} />
        )}
      </div>
    </GameStateProvider>
  )
}

export default App
