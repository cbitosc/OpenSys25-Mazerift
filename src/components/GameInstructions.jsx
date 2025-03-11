import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import './GameInstructions.css';
import { useGameState } from '../context/GameStateContext';

function CheckpointModel() {
    const model = useLoader(GLTFLoader, '/models/checkpoint-7.glb');
    return (
        <primitive 
            object={model.scene} 
            scale={[5, 5, 5]}
            position={[0, -1, 0]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
        />
    );
}

function GameInstructions() {
    const [isVisible, setIsVisible] = useState(true);
    const { setIsTimerStarted, setIsInstructionsOpen } = useGameState();

    // Set instructions open state on mount
    useEffect(() => {
        if (isVisible) {
            setIsInstructionsOpen(true);
        }
    }, [isVisible, setIsInstructionsOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setIsTimerStarted(true);
        setIsInstructionsOpen(false);
    };

    const handleOpen = () => {
        setIsVisible(true);
        setIsInstructionsOpen(true);
    };

    return (
        <>
            {isVisible && (
                <div className="instructions-overlay">
                    <div className="instructions-panel">
                        <div className="card-header">
                            <div className="tech-line"></div>
                            <h2>How to Play</h2>
                            <div className="tech-line"></div>
                        </div>

                        <div className="instructions-sections">
                            <div className="movement-section">
                                <h3>Movement Controls</h3>
                                <div className="key-controls">
                                    <div className="key-row">
                                        <div className="key">W</div>
                                    </div>
                                    <div className="key-row">
                                        <div className="key">A</div>
                                        <div className="key">D</div>
                                    </div>
                                    <div className="key-row">
                                        <div className="sprint-key">SHIFT</div>
                                        <span className="key-label">Sprint</span>
                                    </div>
                                </div>

                                <div className="arrow-controls">
                                    <div className="key-row">
                                        <div className="key">↑</div>
                                    </div>
                                    <div className="key-row">
                                        <div className="key">←</div>
                                        <div className="key">→</div>
                                    </div>
                                </div>
                            </div>

                            <div className="checkpoint-preview">
                                <h3>Find Checkpoints</h3>
                                <div className="model-viewer">
                                    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                                        <ambientLight intensity={0.5} />
                                        <directionalLight position={[5, 5, 5]} intensity={1} />
                                        <Suspense fallback={null}>
                                            <CheckpointModel />
                                        </Suspense>
                                    </Canvas>
                                </div>
                                <p>Look for these terminals throughout the maze</p>
                            </div>

                            <div className="game-objectives">
                                <h3>Objectives</h3>
                                <ul>
                                    <li>🎯 Find and solve all checkpoint questions</li>
                                    <li>⏰ Complete before time runs out</li>
                                    <li>🔄 Press C to toggle camera view</li>
                                    <li>📊 Track progress with Progress button</li>
                                </ul>
                            </div>
                        </div>

                        <button onClick={handleClose} className="close-button">
                            <span className="button-text">Got it!</span>
                            <div className="button-glow"></div>
                        </button>
                    </div>
                </div>
            )}
            <div className="bottom-right-buttons">
                <button 
                    className="help-button"
                    onClick={handleOpen}
                    style={{ display: isVisible ? 'none' : 'block' }}
                >
                    <span className="button-text">?</span>
                    <div className="button-glow"></div>
                </button>
            </div>
        </>
    );
}

export default GameInstructions;
