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
import SceneList from "./SceneList";
import { SceneDoc } from "./types";

interface DeleteSceneDialogProps {
  open: boolean;
  scenes: SceneDoc[];
  selectedId: string | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
  onDelete: () => void;
}

const DeleteSceneDialog: React.FC<DeleteSceneDialogProps> = ({
  open,
  scenes,
  selectedId,
  onOpenChange,
  onSelect,
  onDelete,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Scene</DialogTitle>
        <DialogDescription>
          Select a scene to delete. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <SceneList scenes={scenes} selectedId={selectedId} onSelect={onSelect} />
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={!selectedId}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteSceneDialog;
