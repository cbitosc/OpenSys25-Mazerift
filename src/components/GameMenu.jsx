import { availableMaps } from '../config/maps';
import './GameMenu.css';
import MenuBackground from './MenuBackground';
import { useState, useEffect } from 'react';

function GameMenu({ onStartGame, onMapSelect, selectedMap }) {
    const [animateIn, setAnimateIn] = useState(false);
    
    useEffect(() => {
        setAnimateIn(true);
    }, []);

    return (
        <div className="game-menu-container">
            <MenuBackground />
            <div className="game-menu">
                <div className={`menu-content ${animateIn ? 'animate-in' : ''}`}>
                    <div className="logos-container">
                        <img 
                            src="/COSC Logo.svg" 
                            alt="COSC Logo" 
                            className="logo-img"
                        />
                        <img 
                            src="/OpenSys Logo.svg" 
                            alt="OpenSys Logo" 
                            className="logo-img"
                        />
                    </div>
                    <div className="presents-text">presents</div>
                    <div className="logo-container">
                        <h1 className="game-title">MAZERIFT</h1>
                        <div className="title-underline"></div>
                    </div>
                    
                    <div className="menu-card">
                        <div className="card-header">
                            <div className="tech-line"></div>
                            <h2>Open Paths, Open Minds, Open Source!</h2>
                            <div className="tech-line"></div>
                        </div>
                        
                        <div className="map-selection">
                            <div className="selection-label">
                                <h3>Select Maze</h3>
                            </div>
                            
                            <div className="custom-select">
                                <select 
                                    value={selectedMap || ''} 
                                    onChange={(e) => onMapSelect(e.target.value)}
                                    className="dimension-select"
                                >
                                    <option value="">Choose your path</option>
                                    {availableMaps.map(map => (
                                        <option key={map.id} value={map.id}>
                                            {map.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="select-arrow"></div>
                            </div>
                        </div>
                        
                        <button 
                            className={`play-button ${!selectedMap ? 'disabled' : ''}`}
                            disabled={!selectedMap}
                            onClick={onStartGame}
                        >
                            <div className="button-border"></div>
                            <span className="button-text">PLAY</span>
                            <div className="button-glow"></div>
                        </button>
                        
                        <div className="tech-corners">
                            <span className="corner top-left"></span>
                            <span className="corner top-right"></span>
                            <span className="corner bottom-left"></span>
                            <span className="corner bottom-right"></span>
                        </div>
                    </div>
                    
                    <div className="menu-footer">
                        <div className="tech-line"></div>
                        <p>CBIT Open Source Community</p>
                        <div className="tech-line"></div>
                    </div>
                </div>
            </div>
            
            <div className="ambient-particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`
                    }}></div>
                ))}
            </div>
        </div>
    );
}

export default GameMenu;
