'use client';

import { UserButton } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import CreateFormModal from './CreateFormModal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const aiFormBuilder = params?.get('ai-form-builder');
      if (aiFormBuilder === '1') {
        setIsOpen(true);
      }
    }
  }, [params, mounted]);

  return (
    <div className="flex justify-between gap-6 items-center mb-4 sticky bg-[#0f0d10] -top-3 py-3 z-20 w-full">
      <div className="flex items-center gap-2">
        <Image src={'/logo.webp'} alt="FormCraft" width={32} height={32} />
        <Link className="font-bold text-lg md:text-xl text-white" href={'/'}>
          FormCraft
        </Link>
      </div>
      
      <CreateFormModal open={isOpen} setOpen={setIsOpen} className="ml-auto" />
      <div className="flex items-center gap-2">
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 border-zinc-600/50 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl">
            Upgrade
          </Button>
        </Link>
      </div>
      <UserButton />
    </div>
  );
};

export default Header;
