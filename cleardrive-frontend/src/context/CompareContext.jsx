import { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [selected, setSelected] = useState([]); // array of car objects, max 3

  function toggle(car) {
    setSelected((prev) => {
      const exists = prev.find((c) => c.id === car.id);
      if (exists) return prev.filter((c) => c.id !== car.id);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, car];
    });
  }

  function clear() {
    setSelected([]);
  }

  return (
    <CompareContext.Provider value={{ selected, toggle, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
}
