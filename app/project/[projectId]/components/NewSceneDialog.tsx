import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewSceneDialogProps {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (v: string) => void;
  onCreate: () => void;
  disabled?: boolean;
}

const NewSceneDialog: React.FC<NewSceneDialogProps> = ({
  open,
  title,
  onOpenChange,
  onTitleChange,
  onCreate,
  disabled,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Scene from Current</DialogTitle>
        <DialogDescription>
          Save the current canvas as a new scene.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid gap-1">
          <Label htmlFor="scene-title">Title</Label>
          <Input
            id="scene-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onCreate} disabled={disabled}>
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default NewSceneDialog;
