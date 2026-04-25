import { create } from 'zustand';

const useAppStore = create((set) => ({
  period: 'monthly',   // 'weekly' | 'monthly'
  setPeriod: (period) => set({ period }),

  // Current anchor date for period calculations
  currentDate: new Date().toISOString().slice(0, 10),
  setCurrentDate: (date) => set({ currentDate: date }),
}));

export default useAppStore;
