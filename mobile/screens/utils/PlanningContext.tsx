// context/PlanningContext.tsx
import React, { createContext, useContext, useState } from "react";

type PlanningContextType = {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
};

const PlanningContext = createContext<PlanningContextType | null>(null);

export const PlanningProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  return (
    <PlanningContext.Provider value={{ selectedWeek, setSelectedWeek }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context)
    throw new Error("usePlanning must be used inside PlanningProvider");
  return context;
};
