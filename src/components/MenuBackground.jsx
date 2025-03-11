import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Skybox from '../world/Skybox';
import { Suspense } from 'react';

function MenuBackground() {
    return (
        <div className="menu-background">
            <Canvas camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 10] }}>
                <Suspense fallback={null}>
                    <Skybox target={{ position: new THREE.Vector3(0, 0, 0) }} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                    <ambientLight intensity={0.3} color="pink"/>
                    <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff1b6b" />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default MenuBackground;
