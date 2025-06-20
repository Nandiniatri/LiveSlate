import ReactDOM from 'react-dom';

const ModalB = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modalB-overlay">
      <div className="modalB-content">
        {children}
      </div>
    </div>,
    document.getElementById('modalB-root')
  );
};

export default ModalB; 