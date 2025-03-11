import { useProgress } from '@react-three/drei';
import './LoadingScreen.css';

function LoadingScreen() {
    const { progress, active } = useProgress();
    
    const loadingTexts = [
        "Initializing Systems...",
        "Calibrating Neural Networks...",
        "Establishing Connection...",
        "Synchronizing Data Streams..."
    ];

    const getCurrentText = () => {
        if (progress < 30) return loadingTexts[0];
        if (progress < 60) return loadingTexts[1];
        if (progress < 90) return loadingTexts[2];
        return loadingTexts[3];
    };

    if (!active) return null;

    return (
        <div className="loading-screen">
            <h2>INITIALIZING MAZERIFT</h2>
            <div className="loading-status">{getCurrentText()}</div>
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="progress-text">
                {Math.round(progress)}% COMPLETE
            </div>
        </div>
    );
}

export default LoadingScreen;
