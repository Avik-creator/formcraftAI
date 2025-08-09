'use client';

import React from 'react';

import { Input } from '@/components/ui/input';

import { useFormActionProperty, useFormProperty } from '@/zustand/store';

const Header = () => {
  return (
    <header className="flex flex-col pt-2 gap-3 sticky top-[-13px] pb-3 bg-black/60 backdrop-blur-sm z-20 border-b border-zinc-800/30">
      <FormName />
    </header>
  );
};

const FormName = () => {
  const name = useFormProperty('name')!;
  const updateFormConfig = useFormActionProperty('updateFormConfig');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ name: e.target.value });
  };

  return (
    <Input
      placeholder="What's this form called?"
      onChange={handleNameChange}
      value={name}
      className="border-0 p-0 border-b-[1px] border-b-zinc-700/50 rounded-none focus-visible:ring-0 font-bold tracking-tight text-white text-xl bg-transparent placeholder:text-zinc-500"
    />
  );
};

export default Header;
