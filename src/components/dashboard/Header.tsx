'use client';

import { UserButton } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import CreateFormModal from './CreateFormModal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
        <Link className="font-bold text-lg md:text-xl" href={'/'}>
          FormCraft
        </Link>
      </div>
      <CreateFormModal open={isOpen} setOpen={setIsOpen} className="ml-auto" />
      <UserButton />
    </div>
  );
};

export default Header;
