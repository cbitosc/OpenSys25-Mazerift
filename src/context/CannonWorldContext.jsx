import { createContext, useEffect, useState } from 'react';
import * as CANNON from 'cannon-es';

export const CannonWorldContext = createContext(null);

export function CannonWorldProvider({ children }) {
    const [world] = useState(() => new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0)
    }));

    useEffect(() => {
        const fixedTimeStep = 1.0 / 60.0;
        let lastTime = 0;

        const animate = (time) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;
            world.step(fixedTimeStep, dt);
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        return () => {
        };
    }, [world]);

    return (
        <CannonWorldContext.Provider value={world}>
            {children}
        </CannonWorldContext.Provider>
    );
}
