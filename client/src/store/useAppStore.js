import { create } from 'zustand';
import dayjs from 'dayjs';

const useAppStore = create((set) => ({
  period: 'monthly',   // 'weekly' | 'monthly'
  setPeriod: (period) => set({ period }),

  // Current anchor date for period calculations
  currentDate: dayjs().format('YYYY-MM-DD'),
  setCurrentDate: (date) => set({ currentDate: date }),
}));

export default useAppStore;
