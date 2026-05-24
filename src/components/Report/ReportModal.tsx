import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useRepositories } from '../../context/RepositoryContext';
import { useToast } from '../shared/Toast';

export interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportModal({ open, onClose }: ReportModalProps) {
  const { reports } = useRepositories();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await reports.submitReport({ name, email, message });
    setSubmitting(false);
    show('Thanks, we’ll be in touch.');
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md" ariaLabel="Report an issue">
      <form onSubmit={submit} className="flex flex-col" style={{ gap: 16, marginTop: 4 }}>
        <div>
          <h3
            className="font-serif"
            style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}
          >
            Report Issue
          </h3>
          <p
            style={{
              marginTop: 4,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--color-secondary)',
            }}
          >
            Notice an error in the text? Let us know.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={name} onChange={setName} placeholder="Your Name" />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--color-secondary)',
              display: 'block',
              marginBottom: 4,
            }}
          >
            Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the textual error or technical issue…"
            rows={5}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-bright)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 36,
              padding: '0 16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !message.trim() || !email.trim()}
            style={{
              height: 36,
              padding: '0 16px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: 14,
              opacity: submitting || !message.trim() || !email.trim() ? 0.5 : 1,
            }}
          >
            {submitting ? 'Sending…' : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
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
