import { useEffect, useState } from "react";

// Returns a copy of `value` that only updates after `delay` ms
// have passed without `value` changing again.
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
