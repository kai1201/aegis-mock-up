import { createContext, useContext, useState, ReactNode } from 'react';

export interface RFQItem {
  id: string;
  partNumber: string;
  manufacturer: string;
  description: string;
  quantity: number;
  targetPrice?: number;
  needByDate?: Date;
  notes?: string;
  source: 'bom' | 'manual';
  bomRowId?: string;
}

export interface RFQDraft {
  id: string;
  title: string;
  items: RFQItem[];
  notes?: string;
  needByDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface RFQContextType {
  rfqDraft: RFQDraft | null;
  addToRFQ: (items: Omit<RFQItem, 'id'>[]) => void;
  removeFromRFQ: (itemId: string) => void;
  updateRFQItem: (itemId: string, updates: Partial<RFQItem>) => void;
  clearRFQ: () => void;
  getTotalItems: () => number;
  createRFQFromDraft: () => string;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

export function RFQProvider({ children }: { children: ReactNode }) {
  const [rfqDraft, setRFQDraft] = useState<RFQDraft | null>(null);

  const addToRFQ = (items: Omit<RFQItem, 'id'>[]) => {
    const now = new Date();
    
    setRFQDraft(prev => {
      if (!prev) {
        // Create new draft
        return {
          id: 'draft-' + Date.now(),
          title: 'BOM Analysis RFQ',
          items: items.map(item => ({
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          })),
          createdAt: now,
          updatedAt: now,
        };
      } else {
        // Add to existing draft
        const newItems = items.map(item => ({
          ...item,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }));
        
        return {
          ...prev,
          items: [...prev.items, ...newItems],
          updatedAt: now,
        };
      }
    });
  };

  const removeFromRFQ = (itemId: string) => {
    setRFQDraft(prev => {
      if (!prev) return null;
      
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      
      if (updatedItems.length === 0) {
        return null; // Clear draft if no items left
      }
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
  };

  const updateRFQItem = (itemId: string, updates: Partial<RFQItem>) => {
    setRFQDraft(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
        updatedAt: new Date(),
      };
    });
  };

  const clearRFQ = () => {
    setRFQDraft(null);
  };

  const getTotalItems = () => {
    return rfqDraft?.items.length || 0;
  };

  const createRFQFromDraft = () => {
    if (!rfqDraft) return '';
    
    // In a real app, this would create an actual RFQ record
    const rfqId = `RFQ-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Clear the draft after creating RFQ
    setRFQDraft(null);
    
    return rfqId;
  };

  return (
    <RFQContext.Provider value={{
      rfqDraft,
      addToRFQ,
      removeFromRFQ,
      updateRFQItem,
      clearRFQ,
      getTotalItems,
      createRFQFromDraft,
    }}>
      {children}
    </RFQContext.Provider>
  );
}

export function useRFQ() {
  const context = useContext(RFQContext);
  if (context === undefined) {
    throw new Error('useRFQ must be used within a RFQProvider');
  }
  return context;
}
