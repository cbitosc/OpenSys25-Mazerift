import { Text3D, Center } from '@react-three/drei';

function FloatingText() {
    return (
        <group position={[0, 2, 0]}>
            <Center position={[-2, 0, 0]}>
                <Text3D
                    font="./fonts/helvetiker_regular.typeface.json"
                    size={0.5}
                    height={0.1}
                    curveSegments={12}
                >
                    Learn.
                    <meshStandardMaterial color="hotpink" />
                </Text3D>
            </Center>

            <Center position={[0, 0, 0]}>
                <Text3D
                    font="./fonts/helvetiker_regular.typeface.json"
                    size={0.5}
                    height={0.1}
                    curveSegments={12}
                >
                    Code.
                    <meshStandardMaterial color="hotpink" />
                </Text3D>
            </Center>

            <Center position={[2, 0, 0]}>
                <Text3D
                    font="./fonts/helvetiker_regular.typeface.json"
                    size={0.5}
                    height={0.1}
                    curveSegments={12}
                >
                    Share.
                    <meshStandardMaterial color="hotpink" />
                </Text3D>
            </Center>
        </group>
    );
}

export default FloatingText;
