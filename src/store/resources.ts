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
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sortBy: 'dateAdded' | 'rating' | 'title' | 'visits' | 'clicks') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
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
  
  setSearchQuery: (query) => {
    console.log('Search query being set to:', query); // Debug log
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
  
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),
  
  removeResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id)
  })),
  
  getFilteredResources: () => {
    const state = get();
    let filtered = [...state.resources];
    
    console.log('Current search query:', state.searchQuery); // Debug log

    // Only apply search filter if there's a non-empty search query
    if (state.searchQuery && state.searchQuery.length > 0) {
      const searchTerms = state.searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      console.log('Search terms:', searchTerms); // Debug log
      
      filtered = filtered.filter((resource) => {
        const searchableText = [
          resource.title,
          resource.description || '',
          resource.category,
          ...resource.tags
        ].join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
      
      console.log('Filtered results count:', filtered.length); // Debug log
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