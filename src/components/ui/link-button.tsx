'use client';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LinkButton = ({ href, children, className }: LinkButtonProps) => {
  return (
    <Link href={href} className={cn('', className)}>
      {children}
    </Link>
  );
};
