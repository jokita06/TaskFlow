import '../styles/modal.scss';

export function Modal({ children, onClose }) {
  return (
    <div 
      className="modal-overlay" 
      role="dialog"
      aria-modal="true"
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