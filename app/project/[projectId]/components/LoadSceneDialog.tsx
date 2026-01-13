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

interface LoadSceneDialogProps {
  open: boolean;
  scenes: SceneDoc[];
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}

const LoadSceneDialog: React.FC<LoadSceneDialogProps> = ({
  open,
  scenes,
  onOpenChange,
  onSelect,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Load Scene</DialogTitle>
        <DialogDescription>
          Select a scene to load into the editor.
        </DialogDescription>
      </DialogHeader>
      <SceneList scenes={scenes} selectedId={null} onSelect={onSelect} />
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default LoadSceneDialog;
