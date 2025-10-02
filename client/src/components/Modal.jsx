import { useEffect } from 'react';
import '../styles/modal.scss';

export function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <section 
        className="modal-content"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </section>
    </div>
  );
}