import { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import type { Annotation } from '../../types';

export interface AnnotationPopoverProps {
  open: boolean;
  onClose: () => void;
  chapterId: string;
  segmentId?: string | null;
  annotationId?: string | null;
  newSelection?: {
    startIndex: number;
    endIndex: number;
    language: "zh" | "en";
    selectedText: string;
  } | null;
}

export function AnnotationPopover({ open, onClose, chapterId, segmentId, annotationId, newSelection }: AnnotationPopoverProps) {
  const { forSegment, getAnnotationById, save, remove, update } = useAnnotations(chapterId);
  const { loggedIn } = useAuth();
  const { state, toggleAnnotationMode } = useApp();
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const existing: Annotation[] = segmentId ? forSegment(segmentId) : [];
  const singleAnnotation = annotationId ? getAnnotationById(annotationId) : null;

  useEffect(() => {
    if (singleAnnotation) {
      setText(singleAnnotation.comment);
      setEditing(singleAnnotation.id);
    } else {
      setText('');
      setEditing(null);
    }
  }, [segmentId, annotationId, singleAnnotation, open]);

  const handleSave = () => {
    const value = text.trim();
    if (!value) return;
    if (editing) {
      update(editing, value);
    } else if (newSelection) {
      save({
        comment: value,
        startIndex: newSelection.startIndex,
        endIndex: newSelection.endIndex,
        language: newSelection.language,
        selectedText: newSelection.selectedText,
      });
    } else if (segmentId) {
      save({ segmentId, comment: value });
    }
    setText('');
    setEditing(null);
    if (!editing || singleAnnotation) onClose();
    if (state.annotationMode) {
      toggleAnnotationMode();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Annotation"
      size="sm"
      ariaLabel="Annotation editor"
    >
      <div className="flex flex-col gap-3" style={{ marginTop: 8 }}>
        <h3
          className="font-serif"
          style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}
        >
          {editing ? 'Edit Annotation' : 'New Annotation'}
        </h3>
        {state.language === 'zh' && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Notes are stored on this device.
          </p>
        )}
        {(newSelection?.selectedText || singleAnnotation?.selectedText) && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--color-surface-low)',
              borderRadius: 'var(--radius-button)',
              borderLeft: '3px solid var(--color-accent)',
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
            }}
          >
            "{newSelection?.selectedText || singleAnnotation?.selectedText}"
          </div>
        )}
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter comment here…"
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
        {!loggedIn && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Log in to save across devices.
          </p>
        )}
        {existing.length > 0 && (
          <ul
            className="flex flex-col gap-2"
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 12,
              marginTop: 4,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {existing.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-2"
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--color-surface-low)',
                  borderRadius: 'var(--radius-button)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'var(--color-text-primary)',
                    flex: 1,
                  }}
                >
                  {a.comment}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a.id);
                    setText(a.comment);
                  }}
                  style={{
                    fontSize: 11,
                    color: 'var(--color-accent-bright)',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  style={{
                    fontSize: 11,
                    color: 'var(--color-error)',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {singleAnnotation && !existing.length && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => {
                remove(singleAnnotation.id);
                onClose();
              }}
              style={{
                fontSize: 13,
                color: 'var(--color-error)',
                background: 'none',
                border: 'none',
              }}
            >
              Delete Annotation
            </button>
          </div>
        )}
        <div className="flex justify-end gap-2" style={{ marginTop: 4 }}>
          <button
            type="button"
            onClick={() => {
              if (editing && !singleAnnotation) {
                setEditing(null);
                setText('');
              } else {
                onClose();
              }
            }}
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
            type="button"
            onClick={handleSave}
            disabled={!text.trim()}
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
              opacity: text.trim() ? 1 : 0.5,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
