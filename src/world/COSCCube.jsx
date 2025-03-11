import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useCannonWorld } from '../hooks/useCannonWorld';

function COSCCube({ position, textureName }) {
  const world = useCannonWorld();
  const meshRef = useRef();
  const bodyRef = useRef();
  const texture = useLoader(TextureLoader, '/textures/cosclogo.png');

  useEffect(() => {
    if (!world || bodyRef.current) return;

    const material = new CANNON.Material();
    material.friction = 0.3;
    material.restitution = 0.2;

    const shape = new CANNON.Box(new CANNON.Vec3(0.75,0.75,0.75));
    const body = new CANNON.Body({
      mass: 0.1,
      material: material,
      position: new CANNON.Vec3(...position),
      shape: shape,
      fixedRotation: false,
      linearDamping: 0.4,
      angularDamping: 0.4,
    });

    world.addBody(body);
    bodyRef.current = body;

    return () => {
      world.removeBody(body);
      bodyRef.current = null;
    };
  }, [world]); 

  useEffect(() => {
    if (!bodyRef.current) return;
    
    const handleCollide = () => {
    };

    bodyRef.current.addEventListener('collide', handleCollide);
    
    return () => {
      bodyRef.current?.removeEventListener('collide', handleCollide);
    };
  }, []);

  useFrame(() => {
    if (bodyRef.current && meshRef.current) {
      const { position, quaternion } = bodyRef.current;
      meshRef.current.position.set(position.x, position.y, position.z);
      meshRef.current.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5,1.5,1.5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default COSCCube;
