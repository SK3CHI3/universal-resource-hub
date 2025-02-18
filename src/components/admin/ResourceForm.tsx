import { Resource } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResourceFormProps {
  selectedResource: Resource | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ResourceForm = ({ selectedResource, onSubmit }: ResourceFormProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {selectedResource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogDescription>
          Fill in the details for the resource. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
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
  );
};

