import { useEffect, useRef, useCallback, useState } from 'react';

export const useSmartPolling = (fetchFn, options = {}) => {
    const {
        enabled = true,
        initialInterval = 5000,
        maxInterval = 30000,
        backoffMultiplier = 1.5,
        onError,
        stopCondition = () => false,
    } = options;

    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const currentIntervalRef = useRef(initialInterval);
    const fetchCountRef = useRef(0);

    const clearPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPolling(false);
    }, []);

    const startPolling = useCallback(() => {
        if (intervalRef.current) return;

        setIsPolling(true);
        currentIntervalRef.current = initialInterval;

        const poll = async () => {
            try {
                await fetchFn();
                fetchCountRef.current++;

                // Adaptive polling: slow down after many successful polls
                if (fetchCountRef.current > 5) {
                    currentIntervalRef.current = Math.min(
                        currentIntervalRef.current * backoffMultiplier,
                        maxInterval
                    );
                }

                // Stop if condition is met
                if (stopCondition()) {
                    clearPolling();
                    return;
                }

                // Reset interval for next poll
                clearPolling();
                intervalRef.current = setInterval(poll, currentIntervalRef.current);

            } catch (err) {
                setError(err);
                if (onError) onError(err);

                // Exponential backoff on error
                currentIntervalRef.current = Math.min(
                    currentIntervalRef.current * 2,
                    maxInterval
                );
            }
        };

        intervalRef.current = setInterval(poll, currentIntervalRef.current);
    }, [fetchFn, initialInterval, maxInterval, backoffMultiplier, stopCondition, clearPolling, onError]);

    const stopPolling = useCallback(() => {
        clearPolling();
        fetchCountRef.current = 0;
        currentIntervalRef.current = initialInterval;
    }, [clearPolling, initialInterval]);

    const restartPolling = useCallback(() => {
        stopPolling();
        if (enabled) {
            startPolling();
        }
    }, [stopPolling, startPolling, enabled]);

    // Auto-start/stop based on enabled
    useEffect(() => {
        if (enabled && !intervalRef.current) {
            startPolling();
        } else if (!enabled) {
            stopPolling();
        }

        return () => clearPolling();
    }, [enabled, startPolling, stopPolling, clearPolling]);

    return {
        isPolling,
        error,
        startPolling,
        stopPolling,
        restartPolling,
    };
};

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useThrottle = (callback, delay) => {
    const lastRan = useRef(Date.now());

    return useCallback((...args) => {
        if (Date.now() - lastRan.current >= delay) {
            callback(...args);
            lastRan.current = Date.now();
        }
    }, [callback, delay]);
};

export const useRequestQueue = (maxConcurrent = 3) => {
    const queue = useRef([]);
    const active = useRef(0);

    const addToQueue = useCallback((requestFn) => {
        return new Promise((resolve, reject) => {
            queue.current.push({ requestFn, resolve, reject });
            processQueue();
        });
    }, []);

    const processQueue = useCallback(async () => {
        while (queue.current.length > 0 && active.current < maxConcurrent) {
            const { requestFn, resolve, reject } = queue.current.shift();
            active.current++;

            try {
                const result = await requestFn();
                resolve(result);
            } catch (err) {
                reject(err);
            } finally {
                active.current--;
                processQueue();
            }
        }
    }, [maxConcurrent]);

    return { addToQueue };
};
