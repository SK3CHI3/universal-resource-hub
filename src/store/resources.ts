import { create } from 'zustand';
import { Resource } from '@/types';

interface ResourceStore {
  resources: Resource[];
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  filteredResources: () => Resource[];
}

// Mock database with initial resources
const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Complete Python Programming Course',
    description: 'Learn Python from scratch with this comprehensive course covering all the basics to advanced concepts.',
    source: 'freeCodeCamp',
    tags: ['Programming', 'Beginner', 'Video'],
    link: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/400/300',
    rating: 4.8,
    dateAdded: '2024-02-20',
  },
  {
    id: '2',
    title: 'Modern UI Design Kit',
    description: 'A complete UI kit with modern components and design patterns for web applications.',
    source: 'Figma Community',
    tags: ['Design', 'UI/UX', 'Templates'],
    link: 'https://www.figma.com/community',
    category: 'Design',
    imageUrl: 'https://picsum.photos/400/301',
    rating: 4.5,
    dateAdded: '2024-02-19',
  },
  {
    id: '3',
    title: 'Business Plan Templates',
    description: 'Collection of professional business plan templates for startups and small businesses.',
    source: 'SCORE',
    tags: ['Business', 'Templates', 'PDF'],
    link: 'https://www.score.org/resource/business-plan-template-startups',
    category: 'Business',
    imageUrl: 'https://picsum.photos/400/302',
    rating: 4.2,
    dateAdded: '2024-02-18',
  },
  {
    id: '4',
    title: 'Free Music Theory Course',
    description: 'Comprehensive music theory course covering basics to advanced concepts.',
    source: 'Coursera',
    tags: ['Music', 'Theory', 'Course'],
    link: 'https://www.coursera.org',
    category: 'Music',
    imageUrl: 'https://picsum.photos/400/303',
    rating: 4.7,
    dateAdded: '2024-02-17',
  },
];

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: initialResources,
  searchQuery: '',
  selectedCategory: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  addResource: (resource) => set((state) => ({
    resources: [...state.resources, resource]
  })),
  
  removeResource: (id) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== id)
  })),
  
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