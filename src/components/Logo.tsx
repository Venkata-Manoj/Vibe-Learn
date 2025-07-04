import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VibeLearn AI Logo"
    >
      <defs>
        <linearGradient id="vibe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      {/* Abstract shape representing a brain-wave or neural path */}
      <path
        d="M20,70 C35,20 65,20 80,70"
        stroke="url(#vibe-gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30,75 C40,45 60,45 70,75"
        stroke="url(#vibe-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
       <circle cx="50" cy="25" r="6" fill="url(#vibe-gradient)" />
    </svg>
  );
}
