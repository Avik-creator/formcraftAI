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
    <span className={cn('truncate', triggerClassName)}>
      {values[0]?.label}{' '}
      {allowMultiple ? (
        values.length > 1 ? (
          <span className="text-zinc-400 text-xs truncate ml-2">{` +${values.length - 1} more`}</span>
        ) : (
          ''
        )
      ) : (
        ''
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
            'justify-between overflow-hidden h-11 px-3 bg-zinc-900/60 border-zinc-700/60 hover:bg-zinc-900/70 text-zinc-100',
            'focus-visible:ring-0 focus-visible:border-white/40',
            triggerClassName,
          )}
          style={triggerStyle}
        >
          {values.length > 0 ? (
            label
          ) : (
            <span className={cn('text-zinc-400', placeholderClassName)}>{placeholder ?? 'Select an option...'}</span>
          )}
          <CaretSortIcon className="ml-2 w-4 h-4 shrink-0 text-zinc-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: popupWidth, ...dropdownStyle }}
        className={cn('p-0 bg-zinc-900/95 border-zinc-700/70 shadow-lg backdrop-blur-sm', dropdownClassName)}
      >
        <Command className="bg-transparent text-zinc-100 [&_[cmdk-input-wrapper]]:border-zinc-800 [&_[cmdk-group-heading]]:text-zinc-400">
          <CommandInput placeholder="Search..." className="h-9 placeholder:text-zinc-400" />
          <CommandList>
            <CommandEmpty>Nothing Found.</CommandEmpty>
            <CommandGroup>
              {_options?.map((option) => (
                <CommandItem
                  key={option?.value as string}
                  value={option?.value as string}
                  onSelect={handleSelect}
                  className="text-zinc-100 data-[selected=true]:bg-zinc-800/70"
                >
                  {option?.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
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
