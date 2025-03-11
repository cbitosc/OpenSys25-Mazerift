import { useEffect, useRef, useState, useMemo } from 'react';
import * as CANNON from 'cannon-es';
import { useCannonWorld } from '../hooks/useCannonWorld';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAnimations } from "@react-three/drei";
import * as THREE from 'three';

function Checkpoint({ position, onPlayerNear, onPlayerLeave, title, subtitle, isAnswered }) {
    const mesh = useRef();
    const world = useCannonWorld();
    const bodyRef = useRef(null);
    const [playerBody, setPlayerBody] = useState(null);

    const loadedModel = useLoader(GLTFLoader, '/models/checkpoint-7.glb');
    const scene = useMemo(() => {
        const clone = loadedModel.scene.clone(true);
        clone.scale.set(1,1,1);
        clone.position.set(...position);
        clone.rotation.set(0, Math.PI/2, Math.PI/2); 
        return clone;
    }, [loadedModel, position]);

    const { actions, mixer } = useAnimations(loadedModel.animations, scene);

    useEffect(() => {
        if (isAnswered && bodyRef.current && world) {
            world.removeBody(bodyRef.current);
        }
    }, [isAnswered, world]);

    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const firstAnimation = Object.values(actions)[0];
            firstAnimation.reset().play();
        }
    }, [actions]);

    useFrame((state, delta) => {
        if (mixer) {
            mixer.update(delta);
        }
    });

    useEffect(() => {
        if (scene) {
            scene.scale.set(10,10,10); 
            scene.position.set(...position);
        }
    }, [scene, position]);

    useEffect(() => {
        if (!world || isAnswered) return;

        const checkpointMaterial = new CANNON.Material('checkpoint');
        const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        const body = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(...position),
            shape: shape,
            material: checkpointMaterial,
        });

        world.addBody(body);
        bodyRef.current = body;

        if (scene) {
            const bbox = new THREE.Box3().setFromObject(scene);
            const size = bbox.getSize(new THREE.Vector3());

            const triggerShape = new CANNON.Box(new CANNON.Vec3(2,2,2));
            const triggerBody = new CANNON.Body({
                mass: 0,
                position: new CANNON.Vec3(...position),
                shape: triggerShape,
                isTrigger: true
            });

            const solidShape = new CANNON.Box(new CANNON.Vec3(
                size.x * 0.6 , 
                size.z, 
                size.y * 0.6
            ));
            const solidBody = new CANNON.Body({
                mass: 0, 
                position: new CANNON.Vec3(...position),
                shape: solidShape,
                type: CANNON.Body.STATIC
            });

            if (world) {
                world.addBody(triggerBody);
                world.addBody(solidBody);
                bodyRef.current = triggerBody;

                world.bodies.forEach(b => {
                    if (b.mass === 5) { 
                        setPlayerBody(b);
                    }
                });

                return () => {
                    world.removeBody(triggerBody);
                    world.removeBody(solidBody);
                };
            }
        }
    }, [world, position, scene, isAnswered]);

    useFrame(() => {
        if (!isAnswered && bodyRef.current && playerBody) {
            const distance = bodyRef.current.position.distanceTo(playerBody.position);
            if (distance < 7) { 
                onPlayerNear({
                    title,
                    subtitle,
                    position,
                });
            } else {
                onPlayerLeave();
            }
        }
    });

    if (isAnswered) {
        return null;
    }

    return (
        <>
            <primitive object={scene} ref={mesh} />
            {/* <mesh position={position}> */}
                {/* <boxGeometry args={[0.5, 2, 0.5]} /> */}
                {/* <meshBasicMaterial wireframe color="red" /> */}
            {/* </mesh> */}
        </>
    );
}

export default Checkpoint;
