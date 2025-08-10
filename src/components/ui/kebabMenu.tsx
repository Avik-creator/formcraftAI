import React, { Fragment } from 'react';
import { cn } from '@/lib/utils';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

import { MoreVertical } from 'lucide-react';

interface KebabMenuProps {
  renderTrigger?: () => React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
    value?: string;
    seperator?: boolean;
    disabled?: boolean;
    className?: string;
  }[];
}

const Menu = ({ items, renderTrigger }: KebabMenuProps) => {
  return (
    <Menubar className="border-none p-0 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent">
      <MenubarMenu>
        <MenubarTrigger
          onClick={(e) => e.stopPropagation()}
          asChild
          className="border-0 bg-transparent p-0 data-[state=open]:bg-transparent focus:bg-transparent"
        >
          {renderTrigger ? (
            renderTrigger()
          ) : (
            <MoreVertical className="md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-zinc-400 hover:text-zinc-100 cursor-pointer transition-colors group-hover:opacity-100 hover:scale-110" />
          )}
        </MenubarTrigger>
        <MenubarContent className="bg-zinc-900/95 border-zinc-700/70 text-zinc-100 shadow-lg backdrop-blur-sm p-1 min-w-[10rem]">
          {items?.map((item) => (
            <Fragment key={item?.value || item?.label}>
              <MenubarItem
                onClick={item?.onClick}
                disabled={item?.disabled}
                className={cn(
                  "text-zinc-100 hover:bg-zinc-800/70 focus:bg-zinc-800/70 focus:text-zinc-100 cursor-pointer",
                  item?.className,
                )}
              >
                {item?.label}
              </MenubarItem>
              {item?.seperator && <MenubarSeparator className="bg-zinc-800/70" />}
            </Fragment>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Menu;
    