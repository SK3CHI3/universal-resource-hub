import { create } from 'zustand';
import { Resource } from '@/types';
import { resources } from './resourcesData';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  getFilteredResources: () => Resource[];
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: resources,
  searchQuery: '',
  selectedCategory: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    const resourcesSection = document.getElementById('resources');
    if (resourcesSection) {
      resourcesSection.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),
  
  removeResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id)
  })),
  
  getFilteredResources: () => {
    const state = get();
    return state.resources.filter((resource) => {
      const matchesSearch = state.searchQuery === '' || 
        resource.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()));
        
      const matchesCategory = !state.selectedCategory || resource.category === state.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },
}));