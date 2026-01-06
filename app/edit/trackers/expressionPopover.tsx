"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ExpressionEditor } from "@/components/expressionEditor";
import { useScene } from "@/hooks/SceneContext";

type MessageState =
  | { type: "success"; text: string }
  | { type: "error"; text: string }
  | null;

export const ExpressionPopover: React.FC = () => {
  const [newExpr, setNewExpr] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  const { scene, valRefresh, valToggle } = useScene();
  if (!scene) return null;
  void valToggle;

  const manager = scene.trackerManager;
  const expressions = manager.getAllExpressions();

  const handleAdd = () => {
    const result = manager.connectTrackers(newExpr);

    if (result.success) {
      setNewExpr("");
      setMessage({ type: "success", text: result.msg });
      valRefresh();
    } else {
      setMessage({ type: "error", text: result.msg });
    }
  };

  const handleDelete = (expr: string) => {
    manager.removeExpression(expr);
    setMessage({ type: "success", text: "Expression removed." });
    valRefresh();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-full items-center justify-center"
        >
          <Calculator className="h-4 w-4" />
          Expressions ({expressions.length})
        </Button>
      </PopoverTrigger>

      <PopoverContent className=" p-0" align="start" side="left">
        <div className="w-[180px]">
          {/* Header */}
          <div className="p-4 border-b bg-muted/50">
            <h4 className="font-medium leading-none mb-1">Expression Editor</h4>
            <p className="text-xs text-muted-foreground">
              Format: <code className="font-mono">[target] = [dep] * 2;</code>
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* Input Section */}
            <div className="space-y-2">
              <ExpressionEditor
                value={newExpr}
                onChange={(v) => {
                  setNewExpr(v);
                  if (message) setMessage(null); // clear old message on edit
                }}
                trackers={manager.getAllNames()}
                className="border rounded-md"
              />

              {/* Inline feedback using shadcn Alert */}
              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {message.type === "error" ? "Error" : "Success"}
                  </AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button
                size="sm"
                className="w-full"
                onClick={handleAdd}
                disabled={!newExpr.trim().endsWith(";")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expression
              </Button>
            </div>

            <hr />

            {/* List Section */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Links
              </h5>

              <ScrollArea className="h-[200px] pr-4">
                {expressions.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic text-center py-8">
                    No expressions active.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {expressions.map((expr) => (
                      <div
                        key={expr}
                        className="group flex items-start justify-between gap-2 p-2 rounded-md border bg-card text-card-foreground text-xs font-mono"
                      >
                        <span className="break-all">{expr}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={() => handleDelete(expr)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
