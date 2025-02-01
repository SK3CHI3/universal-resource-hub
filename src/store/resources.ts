import { create } from 'zustand';
import { Resource } from '@/types';
import { resources as initialResources } from './resourcesData';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'dateAdded' | 'rating' | 'title' | 'visits' | 'clicks';
  sortDirection: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isLoading: boolean;  // Added this property
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sortBy: 'dateAdded' | 'rating' | 'title' | 'visits' | 'clicks') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setIsLoading: (loading: boolean) => void;  // Added this method
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  getFilteredResources: () => Resource[];
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: initialResources,
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'dateAdded',
  sortDirection: 'desc',
  viewMode: 'grid',
  isLoading: true,  // Added initial state
  
  setSearchQuery: (query) => {
    console.log('Search query being set:', query);
    set({ searchQuery: query });
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    const resourcesSection = document.getElementById('resources');
    if (resourcesSection) {
      resourcesSection.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsLoading: (loading) => set({ isLoading: loading }),  // Added this method
  
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),
  
  removeResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id)
  })),
  
  getFilteredResources: () => {
    const state = get();
    let filtered = [...state.resources];
    
    // Apply search filter if there's a non-empty search query
    if (state.searchQuery) {
      console.log('Filtering with search query:', state.searchQuery);
      
      filtered = filtered.filter((resource) => {
        // Create a searchable string from all relevant resource fields
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
        
        // Check if the searchable text includes the search query
        const matches = searchableText.includes(state.searchQuery.toLowerCase());
        console.log(`Resource ${resource.title} ${matches ? 'matches' : 'does not match'} search`);
        return matches;
      });
      
      console.log(`Found ${filtered.length} matching resources`);
    }

    // Apply category filter if selected
    if (state.selectedCategory) {
      filtered = filtered.filter(
        resource => resource.category === state.selectedCategory
      );
    }

    // Apply sorting
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