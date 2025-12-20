import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ActiveQuotation {
  id: number;
  docFullNo: string;
  status: string;
  customerName: string;
  grandTotal: number;
  relatedDocs: {
    po?: { id: number; docNo: string; status: string };
    gr?: { id: number; docNo: string; status: string };
    inv?: { id: number; docNo: string; status: string };
  };
}

interface ActiveQuotationContextType {
  activeQuotation: ActiveQuotation | null;
  setActiveQuotation: (q: ActiveQuotation | null) => void;
  clearActiveQuotation: () => void;
}

const ActiveQuotationContext = createContext<ActiveQuotationContextType | undefined>(undefined);

export const ActiveQuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeQuotation, setActiveQuotation] = useState<ActiveQuotation | null>(() => {
    const saved = localStorage.getItem('activeQuotation');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeQuotation) {
      localStorage.setItem('activeQuotation', JSON.stringify(activeQuotation));
    } else {
      localStorage.removeItem('activeQuotation');
    }
  }, [activeQuotation]);

  const clearActiveQuotation = () => setActiveQuotation(null);

  return (
    <ActiveQuotationContext.Provider value={{ activeQuotation, setActiveQuotation, clearActiveQuotation }}>
      {children}
    </ActiveQuotationContext.Provider>
  );
};

export const useActiveQuotation = () => {
  const context = useContext(ActiveQuotationContext);
  if (!context) {
    throw new Error('useActiveQuotation must be used within ActiveQuotationProvider');
  }
  return context;
};
