import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Project</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the project and all its scenes.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex gap-3 justify-end">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteDialog;
