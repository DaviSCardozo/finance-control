import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn("skeleton", className)} />
);

export const CardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-40 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    ))}
  </div>
);
