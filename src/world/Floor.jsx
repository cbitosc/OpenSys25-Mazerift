import * as THREE from 'three';
import { useMemo, useEffect } from 'react';
import { useCannonWorld } from '../hooks/useCannonWorld'; // You'll need to create this hook
import * as CANNON from 'cannon-es';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

function Floor() {
    const world = useCannonWorld();
    
    const floorTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        const gradient = context.createRadialGradient(
            128, 128, 0,    
            128, 128, 180   
        );

        gradient.addColorStop(0, 'rgba(116, 103, 239, 0.8)');     
        gradient.addColorStop(0.5, 'rgba(132, 112, 255, 0.6)');   
        gradient.addColorStop(1, 'rgba(123, 69, 231, 0.7)');     

        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
        return texture;
    }, []);

    useEffect(() => {
        if (!world) return;

        const shape = new CANNON.Plane();
        const body = new CANNON.Body({
            mass: 0,
            shape: shape,
            position: new CANNON.Vec3(0, -1, 0),
        });

        body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            -Math.PI / 2
        );

        world.addBody(body);

        return () => {
            world.removeBody(body);
        };
    }, [world]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10000, 10000]} />
            <meshStandardMaterial 
                map={floorTexture}
                metalness={0.2}
                roughness={0.8}
                opacity={1}
            />
        </mesh>
    );
}

export default Floor;