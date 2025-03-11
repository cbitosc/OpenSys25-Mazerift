import { useContext } from 'react';
import { CannonWorldContext } from '../context/CannonWorldContext';

export function useCannonWorld() {
    return useContext(CannonWorldContext);
}
