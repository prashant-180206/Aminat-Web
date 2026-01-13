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

interface SaveSceneDialogProps {
  open: boolean;
  scenes: SceneDoc[];
  selectedId: string | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
  onSave: () => void;
  disabled?: boolean;
}

const SaveSceneDialog: React.FC<SaveSceneDialogProps> = ({
  open,
  scenes,
  selectedId,
  onOpenChange,
  onSelect,
  onSave,
  disabled,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Save Current to Existing Scene</DialogTitle>
        <DialogDescription>
          Choose a scene to overwrite with the current canvas.
        </DialogDescription>
      </DialogHeader>
      <SceneList scenes={scenes} selectedId={selectedId} onSelect={onSelect} />
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={disabled || !selectedId}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default SaveSceneDialog;
