import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) throw error;

      // Map the snake_case database fields to camelCase for our Resource type
      const mappedResources: Resource[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        source: item.source,
        tags: item.tags || [],
        link: item.link,
        category: item.category,
        imageUrl: item.image_url,
        rating: item.rating || 0,
        dateAdded: item.date_added,
        visits: item.visits || 0,
        clicks: item.clicks || 0
      }));

      setResources(mappedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Map form data to match database column names
    const resourceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      source: formData.get('source') as string,
      link: formData.get('link') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      image_url: formData.get('imageUrl') as string || null,
    };

    try {
      if (selectedResource) {
        const { error } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', selectedResource.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Resource updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('resources')
          .insert([resourceData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Resource created successfully",
        });
      }

      setIsDialogOpen(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Resource Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedResource(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedResource ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the resource. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="title"
                  placeholder="Title"
                  defaultValue={selectedResource?.title}
                  required
                />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Description"
                  defaultValue={selectedResource?.description}
                  required
                />
              </div>
              <div>
                <Input
                  name="source"
                  placeholder="Source"
                  defaultValue={selectedResource?.source}
                  required
                />
              </div>
              <div>
                <Input
                  name="link"
                  placeholder="Link"
                  defaultValue={selectedResource?.link}
                  required
                />
              </div>
              <div>
                <Input
                  name="category"
                  placeholder="Category"
                  defaultValue={selectedResource?.category}
                  required
                />
              </div>
              <div>
                <Input
                  name="tags"
                  placeholder="Tags (comma-separated)"
                  defaultValue={selectedResource?.tags?.join(', ')}
                  required
                />
              </div>
              <div>
                <Input
                  name="imageUrl"
                  placeholder="Image URL (optional)"
                  defaultValue={selectedResource?.imageUrl}
                />
              </div>
              <Button type="submit" className="w-full">
                {selectedResource ? 'Update' : 'Create'} Resource
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Manage your resources here. You can add, edit, or delete resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.source}</TableCell>
                  <TableCell>
                    {new Date(resource.dateAdded).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedResource(resource);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;