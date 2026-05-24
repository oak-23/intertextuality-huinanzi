import { Search } from 'lucide-react';

export interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SidebarSearch({ value, onChange, placeholder = 'Filter texts…' }: SidebarSearchProps) {
  return (
    <div className="relative">
      <span
        className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--color-secondary)' }}
      >
        <Search size={14} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Filter parallel texts"
        className="w-full"
        style={{
          height: 32,
          paddingLeft: 30,
          paddingRight: 10,
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--color-text-primary)',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent-bright)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      />
    </div>
  );
}
