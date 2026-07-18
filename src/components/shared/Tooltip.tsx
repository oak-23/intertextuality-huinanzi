import type { ReactNode } from 'react';

export interface TooltipProps {
  label: string;
  children: ReactNode;
}

/** Hover tooltip for toolbar controls. Styles live in index.css (.tt-host). */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="tt-host">
      {children}
      <span className="tt-bubble" role="tooltip">
        {label}
      </span>
    </span>
  );
}
