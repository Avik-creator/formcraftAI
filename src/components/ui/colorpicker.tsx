"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  showLabel?: boolean;
  className?: string;
  triggerClassName?: string;
}

const ColorPicker = ({
  color,
  onChange,
  showLabel = false,
  className,
  triggerClassName,
}: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger  className={cn("flex flex-col items-center w-10", triggerClassName)}>
        <div
          title={color}
          className={cn("shadow-sm rounded-md w-8 h-8 transition-colors min-w-6 min-h-6 border border-zinc-700", className)}
          style={{ backgroundColor: color }}
        />
        {showLabel && (
          <input
            className="bg-transparent mx-2 border-none max-w-20 text-zinc-200 text-xs outline-none"
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </PopoverTrigger>

      <PopoverContent align="start" alignOffset={15} className="p-2 bg-zinc-900/95 border-zinc-800">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
