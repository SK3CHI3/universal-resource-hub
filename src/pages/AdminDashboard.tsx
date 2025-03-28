
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
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResourceForm } from '@/components/admin/ResourceForm';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { ResourceCollector } from '@/components/admin/ResourceCollector';

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
          <ResourceForm
            selectedResource={selectedResource}
            onSubmit={handleSubmit}
          />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <ResourceCollector />
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Resource Stats</CardTitle>
              <CardDescription>
                Overview of your resource collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Total Resources</p>
                  <p className="text-2xl font-bold">{resources.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">Unique Categories</p>
                  <p className="text-2xl font-bold">{new Set(resources.map(r => r.category)).size}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Total Clicks</p>
                  <p className="text-2xl font-bold">{resources.reduce((sum, r) => sum + (r.clicks || 0), 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Manage your resources here. You can add, edit, or delete resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceTable
            resources={resources}
            onEdit={(resource) => {
              setSelectedResource(resource);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
