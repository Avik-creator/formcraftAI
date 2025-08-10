'use client';

import React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GenericProps } from '@/types/common';

export type Option = {
  value: string | number | boolean;
  label: string;
};

interface ComboboxProps extends GenericProps {
  options: Option[];
  allowMultiple?: boolean;
  selectedValues?: Option[];
  handleChange?: (values: Option[]) => void;
  placeholder?: string;
  triggerClassName?: string;
  placeholderClassName?: string;
  triggerStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
}

export function Combobox({
  placeholder,
  options: _options,
  allowMultiple,
  selectedValues = [],
  handleChange,
  triggerClassName,
  dropdownClassName,
  dropdownStyle,
  triggerStyle,
  placeholderClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Option[]>(selectedValues);
  const [popupWidth, setPopupWidth] = React.useState(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleSelect = (currentValue: string) => {
    if (allowMultiple) {
      const selected = _options.find((option) => option.value === currentValue) as Option;
      const updated = values?.find((d) => d.value === currentValue)
        ? values?.filter((d) => d.value !== currentValue)
        : [...values, selected];
      setValues(updated);
      handleChange?.(updated);
    } else {
      const doesExist = values?.[0]?.value === currentValue;
      if (doesExist) {
        setValues([]);
        handleChange?.([]);
        setOpen(false);
        return;
      }

      const updated = _options.find((option) => option.value === currentValue) as Option;
      setValues([updated]);
      handleChange?.([updated]);
      setOpen(false);
    }
  };

  React.useLayoutEffect(() => {
    if (open) {
      setPopupWidth(buttonRef.current?.getBoundingClientRect()?.width || 0);
    }
  }, [open]);

  React.useEffect(() => {
    setValues(selectedValues?.filter(Boolean));
  }, [selectedValues]);

  const label = (
    <span className={cn('truncate flex items-center', triggerClassName)}>
      <span className="text-zinc-100 font-medium">{values[0]?.label}</span>
      {allowMultiple && values.length > 1 && (
        <span className="text-zinc-400 text-xs bg-zinc-700/50 px-2 py-0.5 rounded-full ml-2">
          +{values.length - 1}
        </span>
      )}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between overflow-hidden h-10 px-3 bg-zinc-800/50 border-zinc-600/50 hover:bg-zinc-700/60 text-zinc-100',
            'focus-visible:ring-2 focus-visible:ring-zinc-500/20 focus-visible:border-zinc-500/70 transition-all duration-200',
            'shadow-sm hover:shadow-md',
            triggerClassName,
          )}
          style={triggerStyle}
        >
          {values.length > 0 ? (
            label
          ) : (
            <span className={cn('text-zinc-400 font-normal', placeholderClassName)}>{placeholder ?? 'Select an option...'}</span>
          )}
          <CaretSortIcon className="ml-2 w-4 h-4 shrink-0 text-zinc-400 transition-transform duration-200" data-state={open ? 'open' : 'closed'} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: popupWidth, ...dropdownStyle }}
        className={cn(
          'p-0 bg-zinc-800/95 border-zinc-600/60 shadow-xl backdrop-blur-md max-h-80 overflow-auto text-white',
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          dropdownClassName
        )}
      >
        <Command className="bg-transparent text-zinc-100 [&_[cmdk-input-wrapper]]:border-zinc-700/50 [&_[cmdk-group-heading]]:text-zinc-400">
          <CommandInput 
            placeholder="Search..." 
            className="h-10 text-zinc-100 placeholder:text-zinc-400 bg-zinc-800/30 border-0 focus:ring-0" 
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="p-4 text-center text-zinc-400 text-sm">
              No options found.
            </CommandEmpty>
            <CommandGroup className="p-1">
              {_options?.map((option) => (
                <CommandItem
                  key={option?.value as string}
                  value={option?.value as string}
                  onSelect={handleSelect}
                  className={cn(
                    'text-zinc-100 hover:bg-zinc-700/60 data-[selected=true]:bg-zinc-700/80',
                    'cursor-pointer rounded-md px-3 py-2 text-sm transition-colors duration-150',
                    'focus:bg-zinc-700/60 focus:outline-none focus:text-white'
                  )}
                >
                  <span className="flex-1 text-white">{option?.label}</span>
                  <CheckIcon
                    className={cn(
                      'ml-2 h-4 w-4 text-emerald-400 transition-opacity duration-150',
                      values?.find((v) => v?.value === option?.value) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
