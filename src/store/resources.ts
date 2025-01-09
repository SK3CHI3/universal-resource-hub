import { create } from 'zustand';
import { Resource } from '@/types';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  filteredResources: () => Resource[];
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: [
    {
      id: '1',
      title: 'Complete Python Programming Course',
      description: 'Learn Python from scratch with this comprehensive course covering all the basics to advanced concepts.',
      source: 'freeCodeCamp',
      tags: ['Programming', 'Beginner', 'Video'],
      link: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
      category: 'Technology',
    },
    {
      id: '2',
      title: 'UI Design Kit',
      description: 'A complete UI kit with modern components and design patterns for web applications.',
      source: 'Figma Community',
      tags: ['Design', 'UI/UX', 'Templates'],
      link: 'https://www.figma.com/community',
      category: 'Design',
    },
    {
      id: '3',
      title: 'Business Plan Templates',
      description: 'Collection of professional business plan templates for startups and small businesses.',
      source: 'SCORE',
      tags: ['Business', 'Templates', 'PDF'],
      link: 'https://www.score.org/resource/business-plan-template-startups',
      category: 'Business',
    },
  ],
  searchQuery: '',
  selectedCategory: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  filteredResources: () => {
    const { resources, searchQuery, selectedCategory } = get();
    
    return resources.filter((resource) => {
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },
}));