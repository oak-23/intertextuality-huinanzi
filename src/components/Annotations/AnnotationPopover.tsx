import { useEffect, useState, useRef, useCallback } from 'react';
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    setActiveFormats(formats);
  }, []);

  const applyFormat = useCallback((command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    updateActiveFormats();
  }, [updateActiveFormats]);

  const existing: Annotation[] = segmentId ? forSegment(segmentId) : [];
  const singleAnnotation = annotationId ? getAnnotationById(annotationId) : null;

  useEffect(() => {
    if (singleAnnotation) {
      setText(singleAnnotation.comment);
      setEditing(singleAnnotation.id);
      if (editorRef.current) editorRef.current.innerHTML = singleAnnotation.comment;
    } else {
      setText('');
      setEditing(null);
      if (editorRef.current) editorRef.current.innerHTML = '';
    }
  }, [segmentId, annotationId, singleAnnotation, open]);

  const getEditorContent = useCallback(() => {
    return editorRef.current?.innerHTML?.trim() || '';
  }, []);

  const handleSave = () => {
    const value = getEditorContent();
    if (!value || value === '<br>') return;
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
    if (editorRef.current) editorRef.current.innerHTML = '';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h3
            className="font-serif"
            style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}
          >
            {editing ? 'Edit Annotation' : 'New Annotation'}
          </h3>
          {state.language === 'zh' && (
            <p
              style={{
                fontSize: 12,
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-ui)',
                margin: 0,
              }}
            >
              Notes are stored on this device.
            </p>
          )}
        </div>
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
            }}
          >
            "{newSelection?.selectedText || singleAnnotation?.selectedText}"
          </div>
        )}
        {/* Editor container — toolbar + editable area as one unit */}
        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-button)',
            overflow: 'hidden',
            transition: 'border-color 0.15s ease',
          }}
        >
          {/* Formatting toolbar */}
          <div
            style={{
              display: 'flex',
              gap: 2,
              padding: '4px 6px',
              backgroundColor: 'var(--color-surface-low)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {[
              { cmd: 'bold', label: 'B', fontWeight: 700 as const, title: 'Bold' },
              { cmd: 'italic', label: 'I', fontStyle: 'italic' as const, title: 'Italic' },
              { cmd: 'underline', label: 'U', textDecoration: 'underline' as const, title: 'Underline' },
            ].map(({ cmd, label, fontWeight, fontStyle: fs, textDecoration, title }) => (
              <button
                key={cmd}
                type="button"
                title={title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat(cmd);
                }}
                onMouseEnter={(e) => {
                  if (!activeFormats.has(cmd)) {
                    e.currentTarget.style.backgroundColor = 'var(--color-border)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!activeFormats.has(cmd)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                style={{
                  width: 30,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: 4,
                  backgroundColor: activeFormats.has(cmd) ? 'var(--color-accent)' : 'transparent',
                  color: activeFormats.has(cmd) ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  fontWeight: fontWeight || 400,
                  fontStyle: fs || 'normal',
                  textDecoration: textDecoration || 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Rich text editor */}
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            aria-label="Annotation text"
            data-placeholder="Enter comment here…"
            onInput={() => {
              setText(editorRef.current?.innerHTML || '');
              updateActiveFormats();
            }}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onFocus={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) container.style.borderColor = 'var(--color-accent-bright)';
            }}
            onBlur={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) container.style.borderColor = 'var(--color-border)';
            }}
            style={{
              width: '100%',
              minHeight: 96,
              padding: '10px 12px',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              lineHeight: 1.5,
              outline: 'none',
              color: 'var(--color-text-primary)',
              overflowY: 'auto',
              maxHeight: 200,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          />
        </div>
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
                  dangerouslySetInnerHTML={{ __html: a.comment }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a.id);
                    setText(a.comment);
                    if (editorRef.current) editorRef.current.innerHTML = a.comment;
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
            disabled={!text.trim() || text.trim() === '<br>'}
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
              opacity: text.trim() && text.trim() !== '<br>' ? 1 : 0.5,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
