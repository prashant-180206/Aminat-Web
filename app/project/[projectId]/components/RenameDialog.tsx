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

interface RenameDialogProps {
  open: boolean;
  name: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  open,
  name,
  description,
  onOpenChange,
  onSave,
  onNameChange,
  onDescriptionChange,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename Project</DialogTitle>
        <DialogDescription>
          Update the project name and description.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid gap-1">
          <Label htmlFor="proj-name">Name</Label>
          <Input
            id="proj-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="proj-desc">Description</Label>
          <Input
            id="proj-desc"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!name.trim()}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default RenameDialog;
