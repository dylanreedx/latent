import { useState, useEffect } from "react";

interface UseLocalStorageOptions<T> {
  key: string;
  initialValue: T;
}

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const updateLocalStorage = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, updateLocalStorage];
};

export default useLocalStorage;
