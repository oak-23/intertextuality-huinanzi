import { useState } from 'react';
import { User } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../shared/Toast';

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const { show } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('scholar@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const action = mode === 'login' ? login : register;
    const result = await action(email, password);
    setSubmitting(false);
    if (result.success) {
      show(`Signed in as ${result.email}`);
      onClose();
      setPassword('');
    } else {
      setError(result.error ?? 'Sign-in failed.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" ariaLabel="Sign in">
      <form
        onSubmit={submit}
        className="flex flex-col items-stretch"
        style={{ gap: 14, marginTop: 8 }}
      >
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <span
            aria-hidden
            className="inline-flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              backgroundColor: 'var(--color-surface-low)',
              color: 'var(--color-secondary)',
            }}
          >
            <User size={26} />
          </span>
          <h3
            className="font-serif"
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textAlign: 'center',
            }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--color-secondary)',
              textAlign: 'center',
            }}
          >
            Sign in to sync your annotations.
          </p>
        </div>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
        />
        {error && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              color: 'var(--color-error)',
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          style={{
            height: 40,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 500,
            fontSize: 14,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'register' : 'login'));
            setError(null);
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--color-secondary)',
            textAlign: 'center',
          }}
        >
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <span style={{ color: 'var(--color-accent-bright)', fontWeight: 500 }}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span style={{ color: 'var(--color-accent-bright)', fontWeight: 500 }}>Log In</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  type: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col" style={{ gap: 4 }}>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-secondary)',
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        style={{
          height: 40,
          padding: '0 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
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
    </label>
  );
}
