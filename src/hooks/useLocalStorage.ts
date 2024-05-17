import { useLayoutEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(initialValue);

  useLayoutEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        setValue(JSON.parse(storedValue));
      } catch (error) {
        console.error(`Error parsing localStorage item "${key}":`, error);
      }
    }
  }, [key]);

  const updateLocalStorage = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, updateLocalStorage];
};

export default useLocalStorage;
