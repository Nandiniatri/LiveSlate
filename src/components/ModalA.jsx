import ReactDOM from 'react-dom';

const ModalA = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modalA-overlay">
      <div className="modalA-content">
        {children}
      </div>
    </div>,
    document.getElementById('modalA-root')
  );
};

export default ModalA;