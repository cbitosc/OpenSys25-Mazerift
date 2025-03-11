import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Skybox({ target }) {
    const skyboxRef = useRef();
    const model = useLoader(GLTFLoader, '/models/skybox2.glb');
    
    useEffect(() => {
        if (model) {
            model.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide;
                }
            });
        }
    }, [model]);

    useFrame(() => {
        if (skyboxRef.current && target?.position) {
            skyboxRef.current.position.copy(target.position);
        } else if (skyboxRef.current) {
            skyboxRef.current.position.set(0, 0, 0);
        }
    });

    return (
        <primitive 
            ref={skyboxRef}
            object={model.scene}
            position={[0, 0, 0]} 
        />
    );
}

export default Skybox;
