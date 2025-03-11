import { useEffect, useRef, useMemo } from 'react';
import * as CANNON from 'cannon-es';
import { useCannonWorld } from '../hooks/useCannonWorld';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';

function Maze({ layout }) {
    const world = useCannonWorld();
    
    const colors = useMemo(() => [
        // new THREE.Color('#2E1F6D').multiplyScalar(1.2), // Deep purple
        // new THREE.Color('#4B0082').multiplyScalar(1.3), // Indigo
        // new THREE.Color('#8A2BE2').multiplyScalar(1.1), // Blue violet
        // new THREE.Color('#9400D3').multiplyScalar(1.2), // Dark violet
        new THREE.Color('#7B68EE').multiplyScalar(1.4)  // Medium slate blue
    ], []);

    const [wallGeometry, wallMaterial] = useMemo(() => {
        const geometry = new THREE.BoxGeometry(4, 6/4, 4);
        const material = new THREE.MeshStandardMaterial({
            metalness: 0.7,
            roughness: 0.3,
            envMapIntensity: 1.5,
            emissiveIntensity: 0.3,
            emissive: new THREE.Color('#1a1a2e')
        });
        return [geometry, material];
    }, []);

    useEffect(() => {
        if (!world || !layout) return;

        const wallBodies = [];
        const wallSize = 4;
        const wallShape = new CANNON.Box(new CANNON.Vec3(wallSize/2, wallSize/2, wallSize/2));

        const mazeWidth = layout.length;
        const mazeHeight = layout[0].length;
        const totalWidth = mazeWidth * wallSize;
        const totalHeight = mazeHeight * wallSize;

        for (let i = -1; i <= mazeWidth; i++) {
            wallBodies.push(new CANNON.Body({
                mass: 0,
                shape: wallShape,
                position: new CANNON.Vec3(
                    -(totalWidth/2) + i * wallSize,
                    wallSize/2,
                    -(totalHeight/2) - wallSize/2
                )
            }));
            
            wallBodies.push(new CANNON.Body({
                mass: 0,
                shape: wallShape,
                position: new CANNON.Vec3(
                    -(totalWidth/2) + i * wallSize,
                    wallSize/2,
                    (totalHeight/2) + wallSize/2
                )
            }));
        }

        for (let j = -1; j <= mazeHeight; j++) {
            wallBodies.push(new CANNON.Body({
                mass: 0,
                shape: wallShape,
                position: new CANNON.Vec3(
                    -(totalWidth/2) - wallSize/2,
                    wallSize/2,
                    -(totalHeight/2) + j * wallSize
                )
            }));
            
            wallBodies.push(new CANNON.Body({
                mass: 0,
                shape: wallShape,
                position: new CANNON.Vec3(
                    (totalWidth/2) + wallSize/2,
                    wallSize/2,
                    -(totalHeight/2) + j * wallSize
                )
            }));
        }

        wallBodies.forEach(body => world.addBody(body));

        layout.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    const body = new CANNON.Body({
                        mass: 0,
                        shape: wallShape,
                        position: new CANNON.Vec3(
                            -(layout.length * wallSize) / 2 + i * wallSize,
                            wallSize/2,
                            -(layout[0].length * wallSize) / 2 + j * wallSize
                        )
                    });
                    world.addBody(body);
                    wallBodies.push(body);
                }
            });
        });

        return () => {
            wallBodies.forEach(body => world.removeBody(body));
        };
    }, [world, layout]);

    const walls = useMemo(() => {
        if (!layout) return null;

        const wallInstances = [];
        const wallSize = 4;
        const mazeWidth = layout.length;
        const mazeHeight = layout[0].length;
        const totalWidth = mazeWidth * wallSize;
        const totalHeight = mazeHeight * wallSize;
        const startX = -totalWidth/2;
        const startZ = -totalHeight/2;

        for (let i = -1; i <= mazeWidth; i++) {
            wallInstances.push({
                position: [startX + i * wallSize, wallSize/8, startZ - wallSize],
                color: colors[0]
            });
            wallInstances.push({
                position: [startX + i * wallSize, wallSize/8, startZ + mazeHeight * wallSize],
                color: colors[0]
            });
        }

        for (let j = -1; j <= mazeHeight; j++) {
            wallInstances.push({
                position: [startX - wallSize, wallSize/8, startZ + j * wallSize],
                color: colors[0]
            });
            wallInstances.push({
                position: [startX + mazeWidth * wallSize, wallSize/8, startZ + j * wallSize],
                color: colors[0]
            });
        }

        layout.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    const position = [
                        startX + i * wallSize,
                        wallSize/8,
                        startZ + j * wallSize
                    ];
                    const color = colors[(i + j) % colors.length];
                    wallInstances.push({ position, color });
                }
            });
        });

        return wallInstances;
    }, [layout, colors]);

    if (!layout || !walls) return null;

    return (
        <Instances limit={walls.length}>
            <boxGeometry args={[4, 6/3, 4]} />
            <meshStandardMaterial
                metalness={0.7}
                roughness={0.3}
                envMapIntensity={1.5}
                emissiveIntensity={0.3}
                emissive={new THREE.Color('#1a1a2e')}
            />
            {walls.map((wall, i) => (
                <Instance 
                    key={i}
                    position={wall.position}
                    color={wall.color}
                />
            ))}
        </Instances>
    );
}

export default Maze;
