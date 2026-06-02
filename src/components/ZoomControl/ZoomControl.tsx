import { useApp } from '../../context/AppContext';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function ZoomControl() {
  const { state, setZoomLevel } = useApp();

  const handleZoomIn = () => {
    setZoomLevel(Math.min(state.zoomLevel + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(state.zoomLevel - 0.1, 0.3));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'var(--color-surface)',
        padding: '8px',
        borderRadius: 'var(--radius-modal)',
        boxShadow: 'var(--shadow-modal)',
        border: '1px solid var(--color-border)',
        zIndex: 50,
      }}
    >
      <button
        onClick={handleZoomIn}
        title="Zoom In"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-button)',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={handleReset}
        title="Reset Zoom"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-button)',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <RotateCcw size={16} />
      </button>
      <button
        onClick={handleZoomOut}
        title="Zoom Out"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-button)',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ZoomOut size={20} />
      </button>
    </div>
  );
}
