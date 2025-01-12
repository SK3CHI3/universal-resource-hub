import { Resource } from '@/types';

export const resources: Resource[] = [
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
  {
    id: '3',
    title: 'MDN Web Docs',
    description: 'Comprehensive documentation and learning resources for web technologies.',
    source: 'Mozilla',
    tags: ['Documentation', 'Web Development', 'Reference'],
    link: 'https://developer.mozilla.org/',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    rating: 4.9,
    dateAdded: '2024-02-18',
  },
  // Design Resources
  {
    id: '4',
    title: 'Figma Community Resources',
    description: 'Free UI kits, design systems, and templates from the Figma community.',
    source: 'Figma',
    tags: ['UI/UX', 'Design Systems', 'Templates'],
    link: 'https://www.figma.com/community',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    rating: 4.7,
    dateAdded: '2024-02-17',
  },
  {
    id: '5',
    title: 'Dribbble - Design Inspiration',
    description: 'Platform for designers to share their work and find inspiration.',
    source: 'Dribbble',
    tags: ['Design Inspiration', 'UI/UX', 'Graphics'],
    link: 'https://dribbble.com/',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9',
    rating: 4.6,
    dateAdded: '2024-02-16',
  },
  // Business Resources
  {
    id: '6',
    title: 'SCORE Business Templates',
    description: 'Free business plan templates and financial planning resources.',
    source: 'SCORE',
    tags: ['Business Planning', 'Templates', 'Finance'],
    link: 'https://www.score.org/resource/business-plan-template-startups',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    rating: 4.5,
    dateAdded: '2024-02-15',
  },
  {
    id: '7',
    title: 'Google Digital Garage',
    description: 'Free digital marketing and business courses from Google.',
    source: 'Google',
    tags: ['Digital Marketing', 'Business', 'Certification'],
    link: 'https://learndigital.withgoogle.com/digitalgarage',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    rating: 4.8,
    dateAdded: '2024-02-14',
  },
  // Education Resources
  {
    id: '8',
    title: 'Khan Academy',
    description: 'Free world-class education in math, science, and more.',
    source: 'Khan Academy',
    tags: ['Mathematics', 'Science', 'Learning'],
    link: 'https://www.khanacademy.org/',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23',
    rating: 4.9,
    dateAdded: '2024-02-13',
  },
  {
    id: '9',
    title: 'Coursera',
    description: 'Access to free courses from top universities worldwide.',
    source: 'Coursera',
    tags: ['Online Courses', 'University', 'Professional Development'],
    link: 'https://www.coursera.org/courses?query=free',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
    rating: 4.7,
    dateAdded: '2024-02-12',
  },
  // Books Resources
  {
    id: '10',
    title: 'Project Gutenberg',
    description: 'Over 60,000 free eBooks to download or read online.',
    source: 'Project Gutenberg',
    tags: ['eBooks', 'Literature', 'Classic Books'],
    link: 'https://www.gutenberg.org/',
    category: 'Books',
    rating: 4.7,
    dateAdded: '2024-02-11',
  },
  {
    id: '11',
    title: 'Open Library',
    description: 'Millions of free books available to borrow digitally.',
    source: 'Internet Archive',
    tags: ['eBooks', 'Digital Library', 'Education'],
    link: 'https://openlibrary.org/',
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
    rating: 4.6,
    dateAdded: '2024-02-10',
  },
  // Music Resources
  {
    id: '12',
    title: 'Teoria - Music Theory',
    description: 'Free music theory lessons and exercises.',
    source: 'Teoria',
    tags: ['Music Theory', 'Exercises', 'Education'],
    link: 'https://www.teoria.com/',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    rating: 4.5,
    dateAdded: '2024-02-09',
  },
  {
    id: '13',
    title: 'MuseScore Sheet Music',
    description: 'Free sheet music and composition tools.',
    source: 'MuseScore',
    tags: ['Sheet Music', 'Composition', 'Music Tools'],
    link: 'https://musescore.org/',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
    rating: 4.7,
    dateAdded: '2024-02-08',
  },
  // Additional Resources
  {
    id: '14',
    title: 'Python Data Science Handbook',
    description: 'Comprehensive guide to data analysis in Python with pandas, numpy, and matplotlib.',
    source: 'GitHub',
    tags: ['Python', 'Data Science', 'Programming'],
    link: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    rating: 4.8,
    dateAdded: '2024-02-07',
  },
  {
    id: '15',
    title: 'Adobe Color Wheel',
    description: 'Create color schemes and explore color theory with Adobe\'s professional tool.',
    source: 'Adobe',
    tags: ['Design', 'Color Theory', 'Tools'],
    link: 'https://color.adobe.com/',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
    rating: 4.7,
    dateAdded: '2024-02-06',
  },
  {
    id: '16',
    title: 'Small Business Resource Center',
    description: 'Free templates, guides, and resources for small business owners.',
    source: 'SBA',
    tags: ['Business Planning', 'Entrepreneurship', 'Resources'],
    link: 'https://www.sba.gov/business-guide',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    rating: 4.6,
    dateAdded: '2024-02-05',
  },
  {
    id: '17',
    title: 'MIT OpenCourseWare',
    description: 'Free access to MIT course materials across various disciplines.',
    source: 'MIT',
    tags: ['Education', 'University', 'Learning'],
    link: 'https://ocw.mit.edu/',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    rating: 4.9,
    dateAdded: '2024-02-04',
  },
  {
    id: '18',
    title: 'Internet Archive Books',
    description: 'Millions of free books, texts, and other educational materials.',
    source: 'Internet Archive',
    tags: ['Books', 'Education', 'Digital Library'],
    link: 'https://archive.org/details/texts',
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    rating: 4.7,
    dateAdded: '2024-02-03',
  },
  {
    id: '19',
    title: 'Musictheory.net',
    description: 'Interactive music theory lessons and exercises.',
    source: 'Musictheory.net',
    tags: ['Music Theory', 'Education', 'Interactive'],
    link: 'https://www.musictheory.net/',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
    rating: 4.8,
    dateAdded: '2024-02-02',
  }
];