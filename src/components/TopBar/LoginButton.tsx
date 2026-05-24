import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from '../Auth/LoginModal';

export interface LoginButtonProps {
  className?: string;
}

export function LoginButton({ className }: LoginButtonProps) {
  const { loggedIn, email, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loggedIn) {
    const initial = email?.[0]?.toUpperCase() ?? '?';
    return (
      <button
        type="button"
        onClick={logout}
        aria-label={`Sign out ${email ?? ''}`}
        title={`${email}\nClick to sign out`}
        className={`inline-flex items-center justify-center transition-transform hover:scale-105 ${className ?? ''}`}
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-text-inverse)',
          fontWeight: 600,
          fontSize: 13,
          fontFamily: 'var(--font-ui)',
          border: 'none',
        }}
      >
        {initial}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`transition-colors ${className ?? ''}`}
        style={{
          height: 36,
          padding: '0 16px',
          borderRadius: 'var(--radius-button)',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Login
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
