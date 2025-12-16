import { Input } from "./ui/input";

type ColorDiscProps = {
  value: string;
  onChange: (val: string) => void;
};

export const ColorDisc = ({ value, onChange }: ColorDiscProps) => {
  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 shadow-sm"
      style={{ backgroundColor: value }}
      onClick={(e) => {
        // forward click to the hidden input
        const input = e.currentTarget.querySelector(
          "input[type='color']"
        ) as HTMLInputElement | null;
        input?.click();
      }}
    >
      <Input
        type="color"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.style.backgroundColor = e.target.value;
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </button>
  );
};
