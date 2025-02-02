import { useState } from "react";
import { Resource } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResourceFormProps {
  onSubmit: (resource: Partial<Resource>) => void;
  initialData?: Resource;
}

export const ResourceForm = ({ onSubmit, initialData }: ResourceFormProps) => {
  const [formData, setFormData] = useState<Partial<Resource>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    source: initialData?.source || '',
    link: initialData?.link || '',
    category: initialData?.category || '',
    image_url: initialData?.image_url || '',
    rating: initialData?.rating || 0,
    tags: initialData?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags?.join(', ')}
          onChange={handleTagsChange}
        />
      </div>

      <Button type="submit">
        {initialData ? 'Update Resource' : 'Add Resource'}
      </Button>
    </form>
  );
};