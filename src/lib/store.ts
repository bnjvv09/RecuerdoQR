import { create } from 'zustand';
import { Order, Experience, Theme, Product } from '@/lib/db';

export type AdminTab = 'orders' | 'experiences' | 'creator' | 'themes' | 'pricing';

interface AdminStore {
  // Auth & Navigation
  isLogged: boolean;
  activeTab: AdminTab;
  setIsLogged: (logged: boolean) => void;
  setActiveTab: (tab: AdminTab) => void;

  // Data
  orders: Order[];
  experiences: Experience[];
  themes: Theme[];
  products: Product[];
  setOrders: (orders: Order[]) => void;
  setExperiences: (experiences: Experience[]) => void;
  setThemes: (themes: Theme[]) => void;
  setProducts: (products: Product[]) => void;

  // Selection & UI Filters
  selectedOrder: Order | null;
  selectedExperience: Experience | null;
  statusFilter: string;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  setSelectedOrder: (order: Order | null) => void;
  setSelectedExperience: (exp: Experience | null) => void;
  setStatusFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;

  // Local Optimistic Modifiers
  updateOrderStatusLocal: (orderId: string, status: Order['status']) => void;
  deleteExperienceLocal: (expId: string) => void;
  updateExperienceLocal: (expId: string, updated: Partial<Experience>) => void;
  updateProductPriceLocal: (productId: string, price: number) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isLogged: false,
  activeTab: 'orders',
  setIsLogged: (isLogged) => set({ isLogged }),
  setActiveTab: (activeTab) => set({ activeTab }),

  orders: [],
  experiences: [],
  themes: [],
  products: [],
  setOrders: (orders) => set({ orders }),
  setExperiences: (experiences) => set({ experiences }),
  setThemes: (themes) => set({ themes }),
  setProducts: (products) => set({ products }),

  selectedOrder: null,
  selectedExperience: null,
  statusFilter: 'all',
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 10,

  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  setSelectedExperience: (selectedExperience) => set({ selectedExperience }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  updateOrderStatusLocal: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      selectedOrder:
        state.selectedOrder?.id === orderId
          ? { ...state.selectedOrder, status }
          : state.selectedOrder,
    })),

  deleteExperienceLocal: (expId) =>
    set((state) => ({
      experiences: state.experiences.filter((e) => e.id !== expId),
      selectedExperience:
        state.selectedExperience?.id === expId ? null : state.selectedExperience,
    })),

  updateExperienceLocal: (expId, updated) =>
    set((state) => ({
      experiences: state.experiences.map((e) => (e.id === expId ? { ...e, ...updated } : e)),
      selectedExperience:
        state.selectedExperience?.id === expId ? { ...state.selectedExperience, ...updated } : state.selectedExperience,
    })),

  updateProductPriceLocal: (productId, price) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === productId ? { ...p, price } : p)),
    })),
}));
