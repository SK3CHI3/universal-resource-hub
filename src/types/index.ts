
export interface Resource {
  id: string;
  title: string;
  description: string;
  source: string;
  tags: string[];
  link: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  dateAdded: string;
  visits?: number;
  clicks?: number;
  sponsored?: boolean;
}

export interface Category {
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}
