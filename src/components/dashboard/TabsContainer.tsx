'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      defaultValue="/"
      value={pathname}
      onValueChange={(value) => {
        router.push(value, { scroll: false });
      }}
      className="flex-1"
    >
      <div className="flex justify-between gap-6 md:items-center sm:flex-row flex-col">
        <div className="div text-center md:text-left">
          {!isLoaded ? (
            <Skeleton className="h-7 w-52 rounded-md mx-auto sm:mx-0" />
          ) : (
            <h2 className="font-bold text-white md:text-2xl text-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Hey {user?.firstName ?? '...'}!</span>
              <span>👋</span>
            </h2>
          )}

          {!isLoaded ? (
            <Skeleton className="h-3 w-96 rounded-md mt-1 mx-auto sm:mx-0" />
          ) : (
            <p className="text-xs text-muted-foreground">
              This is your dashboard, here you can see how your forms are performing, recent activity and more.
            </p>
          )}
        </div>
        <div className="justify-between gap-3 items-center sm:flex mx-auto sm:m-0">
          <TabsList className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="/dashboard"
              className="text-xs md:text-sm px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-0 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:border data-[state=active]:border-zinc-700/60"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="/dashboard/forms"
              className="text-xs md:text-sm px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-0 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:border data-[state=active]:border-zinc-700/60"
            >
              My Forms
            </TabsTrigger>
            <TabsTrigger
              value="/dashboard/templates"
              className="text-xs md:text-sm px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-0 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:border data-[state=active]:border-zinc-700/60"
            >
              Templates
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value={pathname} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
