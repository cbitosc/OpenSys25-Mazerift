import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useEffect, useRef, useMemo } from 'react';
import { useAnimations } from "@react-three/drei";

export default function FinalStage() {
    const loadedModel = useLoader(GLTFLoader, '/models/finalstage/final.glb');
    const { animations, scene } = loadedModel;
    const { actions, mixer } = useAnimations(animations, scene);
    scene.scale.set(2, 2, 2);
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => action.play());
        }
    }, [actions]);
    useFrame((state, delta)=>{
        if (mixer) {
            mixer.update(delta);
        }
    })
    scene.position.y = -0.5;

    return <primitive object={scene} />
}