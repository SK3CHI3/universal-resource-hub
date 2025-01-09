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
  getFilteredResources: () => Resource[];
}

const initialResources: Resource[] = [
  // Technology Resources
  {
    id: '1',
    title: 'freeCodeCamp - Full Stack Development',
    description: 'Learn web development with comprehensive courses covering HTML, CSS, JavaScript, React, and more.',
    source: 'freeCodeCamp',
    tags: ['Programming', 'Web Development', 'Full Stack'],
    link: 'https://www.freecodecamp.org/',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    rating: 4.9,
    dateAdded: '2024-02-20',
  },
  {
    id: '2',
    title: 'The Odin Project',
    description: 'Free full-stack curriculum from basics to advanced web development concepts.',
    source: 'The Odin Project',
    tags: ['Web Development', 'JavaScript', 'Ruby'],
    link: 'https://www.theodinproject.com/',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    rating: 4.8,
    dateAdded: '2024-02-19',
  },
  // Design Resources
  {
    id: '3',
    title: 'Figma Community Resources',
    description: 'Free UI kits, design systems, and templates from the Figma community.',
    source: 'Figma',
    tags: ['UI/UX', 'Design Systems', 'Templates'],
    link: 'https://www.figma.com/community',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    rating: 4.7,
    dateAdded: '2024-02-18',
  },
  {
    id: '4',
    title: 'Coolors - Color Schemes Generator',
    description: 'Generate perfect color combinations for your designs.',
    source: 'Coolors',
    tags: ['Colors', 'Design Tools', 'Inspiration'],
    link: 'https://coolors.co/',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9',
    rating: 4.6,
    dateAdded: '2024-02-17',
  },
  // Business Resources
  {
    id: '5',
    title: 'SCORE Business Templates',
    description: 'Free business plan templates and financial planning resources.',
    source: 'SCORE',
    tags: ['Business Planning', 'Templates', 'Finance'],
    link: 'https://www.score.org/resource/business-plan-template-startups',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    rating: 4.5,
    dateAdded: '2024-02-16',
  },
  {
    id: '6',
    title: 'Google Digital Garage',
    description: 'Free digital marketing and business courses from Google.',
    source: 'Google',
    tags: ['Digital Marketing', 'Business', 'Certification'],
    link: 'https://learndigital.withgoogle.com/digitalgarage',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    rating: 4.8,
    dateAdded: '2024-02-15',
  },
  // Education Resources
  {
    id: '7',
    title: 'Khan Academy',
    description: 'Free world-class education in math, science, and more.',
    source: 'Khan Academy',
    tags: ['Mathematics', 'Science', 'Learning'],
    link: 'https://www.khanacademy.org/',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23',
    rating: 4.9,
    dateAdded: '2024-02-14',
  },
  {
    id: '8',
    title: 'MIT OpenCourseWare',
    description: 'Free access to MIT course content across multiple disciplines.',
    source: 'MIT',
    tags: ['University Courses', 'Engineering', 'Science'],
    link: 'https://ocw.mit.edu/',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    rating: 4.8,
    dateAdded: '2024-02-13',
  },
  // Books Resources
  {
    id: '9',
    title: 'Project Gutenberg',
    description: 'Over 60,000 free eBooks to download or read online.',
    source: 'Project Gutenberg',
    tags: ['eBooks', 'Literature', 'Classic Books'],
    link: 'https://www.gutenberg.org/',
    category: 'Books',
    rating: 4.7,
    dateAdded: '2024-02-12',
  },
  {
    id: '10',
    title: 'Open Library',
    description: 'Millions of free books available to borrow digitally.',
    source: 'Internet Archive',
    tags: ['eBooks', 'Digital Library', 'Education'],
    link: 'https://openlibrary.org/',
    category: 'Books',
    rating: 4.6,
    dateAdded: '2024-02-11',
  },
  // Music Resources
  {
    id: '11',
    title: 'Teoria - Music Theory',
    description: 'Free music theory lessons and exercises.',
    source: 'Teoria',
    tags: ['Music Theory', 'Exercises', 'Education'],
    link: 'https://www.teoria.com/',
    category: 'Music',
    rating: 4.5,
    dateAdded: '2024-02-10',
  },
  {
    id: '12',
    title: 'MuseScore Sheet Music',
    description: 'Free sheet music and composition tools.',
    source: 'MuseScore',
    tags: ['Sheet Music', 'Composition', 'Music Tools'],
    link: 'https://musescore.org/',
    category: 'Music',
    rating: 4.7,
    dateAdded: '2024-02-09',
  }
];

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: initialResources,
  searchQuery: '',
  selectedCategory: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    // Scroll to resources section when category is selected
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