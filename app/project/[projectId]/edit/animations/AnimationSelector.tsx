import React from "react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/combobox";

interface AnimationSelectorProps {
  animNames: string[];
  selectedAnim: string | null;
  onSelectAnim: (name: string) => void;
}

const AnimationSelector: React.FC<AnimationSelectorProps> = ({
  animNames,
  selectedAnim,
  onSelectAnim,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium">Animation Type</Label>
      <Combobox
        options={animNames.map((name) => ({
          label: name,
          value: name,
        }))}
        value={selectedAnim}
        onChange={onSelectAnim}
        placeholder="Select animation"
      />
    </div>
  );
};

export default AnimationSelector;
