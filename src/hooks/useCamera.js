import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useCamera = (target) => {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3());
    const characterDirection = useRef(new THREE.Vector3(0, 0, -1));

    useEffect(() => {
        camera.position.set(0, 4, 6);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    const updateCamera = (isTopView) => {
        if (!target) return;

        if (isTopView) {
            targetPosition.current.copy(target.position);
            targetPosition.current.y += 20; 
            camera.position.lerp(targetPosition.current, 0.05);
            camera.lookAt(target.position);
        } else {
            target.getWorldDirection(characterDirection.current);
            targetPosition.current.copy(target.position);
            characterDirection.current.multiplyScalar(-3.5);
            targetPosition.current.add(characterDirection.current);
            targetPosition.current.y += 2.5;
            camera.position.lerp(targetPosition.current, 0.1);
            camera.lookAt(target.position);
        }
    };

    return updateCamera;
};
