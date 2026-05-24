import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { IconButton } from './IconButton';
import { ReportModal } from '../Report/ReportModal';

export interface ReportButtonProps {
  className?: string;
}

export function ReportButton({ className }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        aria-label="Report an issue"
        onClick={() => setOpen(true)}
        className={className}
      >
        <MessageCircle size={18} />
      </IconButton>
      <ReportModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
