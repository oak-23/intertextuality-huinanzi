import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { IconButton } from './IconButton';
import { TutorialModal } from '../Tutorial/TutorialModal';

export interface TutorialButtonProps {
  className?: string;
}

export function TutorialButton({ className }: TutorialButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        aria-label="Open the tutorial"
        onClick={() => setOpen(true)}
        className={className}
      >
        <HelpCircle size={18} />
      </IconButton>
      <TutorialModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
