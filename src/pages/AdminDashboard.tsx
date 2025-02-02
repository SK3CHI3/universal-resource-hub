import { useEffect, useState } from "react";
import { Resource } from "@/types";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ResourceTable } from "@/components/admin/ResourceTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useResourceStore } from "@/store/resources";

const AdminDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>();
  const resources = useResourceStore(state => state.resources);
  const fetchResources = useResourceStore(state => state.fetchResources);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSubmit = async (resourceData: Partial<Resource>) => {
    // Handle resource submission
    console.log('Submitting resource:', resourceData);
    setIsDialogOpen(false);
    setSelectedResource(undefined);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Handle resource deletion
    console.log('Deleting resource:', id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Resource</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedResource ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
            </DialogHeader>
            <ResourceForm
              onSubmit={handleSubmit}
              initialData={selectedResource}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ResourceTable
        resources={resources}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDashboard;