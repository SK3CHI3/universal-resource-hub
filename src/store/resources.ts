import { create } from 'zustand';
import { Resource } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'date_added' | 'rating' | 'title' | 'visits' | 'clicks';
  sortDirection: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sortBy: 'date_added' | 'rating' | 'title' | 'visits' | 'clicks') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setIsLoading: (loading: boolean) => void;
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  getFilteredResources: () => Resource[];
  fetchResources: () => Promise<void>;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: [],
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'date_added',
  sortDirection: 'desc',
  viewMode: 'grid',
  isLoading: true,
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },
  
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),
  
  removeResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id)
  })),

  fetchResources: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources. Please try again later.');
        return;
      }

      if (data) {
        set({ resources: data });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  getFilteredResources: () => {
    const state = get();
    let filtered = [...state.resources];
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter((resource) => {
        const searchableText = [
          resource.title,
          resource.description,
          resource.category,
          resource.source,
          ...(resource.tags || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        return searchableText.includes(query);
      });
    }

    if (state.selectedCategory) {
      filtered = filtered.filter(
        resource => resource.category === state.selectedCategory
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[state.sortBy];
      const bValue = b[state.sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return state.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      return state.sortDirection === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
  },
}));