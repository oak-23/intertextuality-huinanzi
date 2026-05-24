import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: number;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { active, size = 36, children, className = '', style, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition-colors ${
        active ? 'bg-surface-container' : 'hover:bg-surface-high'
      } ${className}`}
      style={{
        width: size,
        height: size,
        color: 'var(--color-secondary)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
});
