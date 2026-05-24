import { useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Popover } from '../shared/Popover';
import { IconButton } from './IconButton';

export interface ModeSwitchProps {
  className?: string;
}

interface Option {
  id: 'normal' | 'research';
  title: string;
  description: string;
}

const OPTIONS: Option[] = [
  { id: 'normal', title: 'Normal Mode', description: 'Spacious editorial default' },
  { id: 'research', title: 'Research Mode', description: 'Advanced functions for research' },
];

export function ModeSwitch({ className }: ModeSwitchProps) {
  const { state, setViewMode } = useApp();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        ref={triggerRef}
        active={open}
        aria-label="View options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        <Settings size={18} />
      </IconButton>
      <Popover
        open={open}
        anchor={triggerRef.current}
        placement="bottom-end"
        onClose={() => setOpen(false)}
        width={260}
        ariaLabel="View options"
      >
        <div className="py-2">
          <div
            className="px-4 py-1 text-caption uppercase"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.05em' }}
          >
            View options
          </div>
          {OPTIONS.map((opt) => {
            const active = state.viewMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setViewMode(opt.id);
                  setOpen(false);
                }}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-low transition-colors"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex items-center justify-center"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 9999,
                    border: '1.5px solid',
                    borderColor: active ? 'var(--color-accent-bright)' : 'var(--color-border-strong)',
                  }}
                >
                  {active && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        backgroundColor: 'var(--color-accent-bright)',
                      }}
                    />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className="block text-ui-label"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {opt.title}
                  </span>
                  <span
                    className="block text-ui-small"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    {opt.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
}
