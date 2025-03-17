import { create } from 'zustand';
import { Resource } from '@/types';
import { resources as initialResources } from './resourcesData';
import { supabase } from '@/lib/supabase';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'dateAdded' | 'rating' | 'title' | 'visits' | 'clicks';
  sortDirection: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  error: Error | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sortBy: 'dateAdded' | 'rating' | 'title' | 'visits' | 'clicks') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  fetchResources: () => Promise<void>;
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
  isLoading: false,
  error: null,
  
  fetchResources: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Try to get resources from Supabase
      const { data, error } = await supabase
        .from('resources')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      // If we got data from Supabase, use it, otherwise use initial data
      if (data && data.length > 0) {
        // Map the Supabase data to our Resource interface
        const mappedResources: Resource[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          source: item.source,
          tags: item.tags || [],
          link: item.link,
          category: item.category,
          imageUrl: item.image_url,
          rating: item.rating,
          dateAdded: item.date_added || new Date().toISOString(),
          visits: item.visits || 0,
          clicks: item.clicks || 0,
          is_sponsored: item.is_sponsored || false
        }));
        
        set({ resources: mappedResources, isLoading: false });
      } else {
        // If no data from Supabase, use initial data
        set({ resources: initialResources, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      set({ error: error as Error, isLoading: false });
      // Fallback to initial data
      set({ resources: initialResources });
    }
  },
  
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
