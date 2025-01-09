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
}

export type Category = {
  name: string;
  icon: any;
  color: string;
  description: string;
}