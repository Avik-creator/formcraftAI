import React, { useEffect, useState } from 'react';
import FieldConfigMenu from './field-config-menu/FieldConfigMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { useSelectedFieldStore } from '@/zustand/store';
import FieldListMenu from './field-list-menu/FieldListMenu';

const RightPane = ({ className }: GenericProps) => {
  const classes = cn(
    'h-full bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-md p-4 flex flex-col overflow-auto',
    'border-l border-zinc-700/60 shadow-2xl',
    className,
  );
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const [selected, setSelected] = useState('fields');

  useEffect(() => {
    setSelected(selectedField ? 'settings' : 'fields');
  }, [selectedField]);

  return (
    <div className={classes}>
      <Tabs value={selected} className="w-full h-full flex flex-col">
        <TabsList className="w-full sticky top-0 z-10 bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-xl p-1.5 shadow-lg mb-4">
          <TabsTrigger
            value="fields"
            className="basis-1/2 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:ring-0 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-purple-600/20 data-[state=active]:border data-[state=active]:border-blue-500/30 data-[state=active]:shadow-md"
            onClick={() => setSelected('fields')}
          >
            Fields
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="basis-1/2 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:ring-0 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-purple-600/20 data-[state=active]:border data-[state=active]:border-blue-500/30 data-[state=active]:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!selectedField}
            onClick={() => setSelected('settings')}
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fields" className="flex-1 overflow-auto">
          <FieldListMenu />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="space-y-4">
            <FieldConfigMenu />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPane;
