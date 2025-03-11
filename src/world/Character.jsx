import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useEffect, useRef, useMemo, forwardRef, useState } from 'react';
import { useAnimations } from "@react-three/drei";
import * as CANNON from 'cannon-es';
import { useCannonWorld } from '../hooks/useCannonWorld';
import * as THREE from 'three';
import { useCamera } from '../hooks/useCamera';
import { useCharacterControls } from '../hooks/useCharacterControls';
import { useGameState } from '../context/GameStateContext';

const Character = forwardRef(({ cameraViewEnabled = false }, ref) => {
    const loadedModel = useLoader(GLTFLoader, '/models/sketchbot/scene.gltf');
    const { animations, scene } = loadedModel;
    scene.scale.set(2,2,2);
    const { actions, mixer } = useAnimations(animations, scene);
    const world = useCannonWorld();
    const bodyRef = useRef(null);
    const characterRef = useRef();
    const movement = useCharacterControls();
    const updateCamera = useCamera(scene);
    const [topView, setTopView] = useState(false);
    const { isCheckpointUIActive, isInstructionsOpen } = useGameState();
    const [forceUpdateTimer, setForceUpdateTimer] = useState(0);

    const direction = useRef(new THREE.Vector3());
    const velocity = useRef(0);
    const rotation = useRef(0);
    const scaledDirection = useRef(new CANNON.Vec3());
    const cannonDirection = useRef(new CANNON.Vec3());
    const rotationAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
    const targetQuaternion = useMemo(() => new THREE.Quaternion(), []);
    const currentQuaternion = useMemo(() => new THREE.Quaternion(), []);

    useEffect(() => {
        const shape = new CANNON.Cylinder(0.5, 0.5, 2, 8);
        const body = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 2, 0),
            shape: shape,
        });

        const quat = new CANNON.Quaternion();
        quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        body.quaternion.copy(quat);

        if (world) {
            world.addBody(body);
            bodyRef.current = body;
        }

        return () => {
            if (world && body) {
                world.removeBody(body);
            }
        };
    }, [world]);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => action.play());
        }
    }, [actions]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (isCheckpointUIActive) return; 
            if (e.key.toLowerCase() === 'c') {
                setTopView(prev => !prev);
                setForceUpdateTimer(50); 
                if (scene && bodyRef.current) {
                    scene.position.copy(bodyRef.current.position);
                    scene.quaternion.copy(bodyRef.current.quaternion);
                    updateCamera(!topView); 
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isCheckpointUIActive, scene, updateCamera, topView]);

    useFrame((state, delta) => {
        if (mixer) {
            mixer.update(delta);
        }

        if (bodyRef.current && scene) {
            if (movement.forward || movement.backward || movement.left || movement.right || forceUpdateTimer > 0) {
                scene.position.copy(bodyRef.current.position);
                scene.quaternion.copy(bodyRef.current.quaternion);
                updateCamera(topView);
                
                if (forceUpdateTimer > 0) {
                    setForceUpdateTimer(prev => prev - 1);
                }
            }

            if (bodyRef.current.position.y > 4) {
                bodyRef.current.position.y = 4;
                bodyRef.current.velocity.y = 0;
            }

            if (!isCheckpointUIActive && !isInstructionsOpen && (movement.forward || movement.backward || movement.left || movement.right)) {
                velocity.current = movement.sprint ? 13 : 8;

                scene.getWorldDirection(direction.current);
                direction.current.y = movement.jump ? Math.min(3, 2 - bodyRef.current.position.y) : 0;
                direction.current.normalize();

                if (movement.backward) {
                    direction.current.x *= -1;
                    direction.current.z *= -1;
                } else if (movement.left) {
                    direction.current.applyAxisAngle(rotationAxis, Math.PI / 4);
                } else if (movement.right) {
                    direction.current.applyAxisAngle(rotationAxis, -Math.PI / 4);
                }

                rotation.current = Math.atan2(direction.current.x, direction.current.z);
                targetQuaternion.setFromAxisAngle(rotationAxis, rotation.current);
                currentQuaternion.copy(bodyRef.current.quaternion);
                currentQuaternion.slerp(targetQuaternion, 0.1);
                bodyRef.current.quaternion.copy(currentQuaternion);

                cannonDirection.current.set(
                    direction.current.x,
                    direction.current.y,
                    direction.current.z
                );
                cannonDirection.current.scale(velocity.current * (1/60), scaledDirection.current);

                bodyRef.current.position.vadd(scaledDirection.current, bodyRef.current.position);
                bodyRef.current.velocity.set(0, 0, 0);
                bodyRef.current.angularVelocity.set(0, 0, 0);

                scene.position.copy(bodyRef.current.position);
                scene.quaternion.copy(bodyRef.current.quaternion);
                updateCamera(topView);

                scene.dispatchEvent({ type: 'positionChanged' });
            }
        }
    });

    useEffect(() => {
        if (scene) {
            ref.current = {
                scene: scene,
                teleport: (x, y, z) => {
                    if (bodyRef.current) {
                        bodyRef.current.position.set(x, y, z);
                        scene.position.set(x, y, z);
                    }
                }
            };
        }
    }, [scene, ref]);

    return <primitive object={scene} />;
});

export default Character;