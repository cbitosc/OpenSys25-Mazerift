import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useRef } from 'react';
import * as CANNON from 'cannon-es';
import { useCannonWorld } from '../hooks/useCannonWorld';

function SciFiComputer() {
    const model = useLoader(GLTFLoader, '/models/scifibasecomputer.glb');
    const world = useCannonWorld();
    const bodyRef = useRef(null);

    useEffect(() => {
        if (!world) return;

        const shape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
        const body = new CANNON.Body({
            mass: 0, 
            position: new CANNON.Vec3(6, 3, 0),
            shape: shape,
        });

        world.addBody(body);
        bodyRef.current = body;

        return () => {
            world.removeBody(body);
        };
    }, [world]);

    useEffect(() => {
        if (model) {
            model.scene.scale.set(1,1,1);
            model.scene.position.set(6, 0, 0);
        }
    }, [model]);

    return <primitive object={model.scene} />;
}

export default SciFiComputer;
