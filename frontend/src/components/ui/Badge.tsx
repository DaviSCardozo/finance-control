import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  const variants: Record<string, string> = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    destructive: 'bg-red-500/10 text-red-600 dark:text-red-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    outline: 'border border-border text-muted-foreground',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold leading-5",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
