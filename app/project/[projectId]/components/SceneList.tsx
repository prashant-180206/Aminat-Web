import React from "react";
import { SceneDoc } from "./types";

interface SceneDialogListProps {
  scenes: SceneDoc[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const SceneList: React.FC<SceneDialogListProps> = ({
  scenes,
  selectedId,
  onSelect,
}) => (
  <div className="max-h-64 overflow-auto border rounded-md">
    {scenes.length === 0 ? (
      <div className="p-3 text-sm text-muted-foreground">
        No scenes available.
      </div>
    ) : (
      <ul>
        {scenes.map((s) => (
          <li
            key={s._id}
            className={`px-3 py-2 text-sm cursor-pointer hover:bg-muted ${
              selectedId === s._id ? "bg-muted" : ""
            }`}
            onClick={() => onSelect(s._id)}
          >
            {s.title}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SceneList;
