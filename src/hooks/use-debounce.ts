import { useState, useEffect } from 'react';

// Custom debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if value or delay changes (or on component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if the value or delay changes

  return debouncedValue;
}
