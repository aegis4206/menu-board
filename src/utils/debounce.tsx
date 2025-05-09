import { useRef } from 'react';

const useDebounce = <T extends (...args: Parameters<T>) => void>(callback: T, delay: number) => {
    const timer = useRef<number | null>(null);

    const debouncedFunction = (...args: Parameters<T>) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedFunction;
};

export default useDebounce;