// const Modal = ({children, isOpen}) => {
//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 {children}
//             </div>
//         </div>
//     )
// }

// export default Modal;  

import ReactDOM from 'react-dom';

const Modal = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // 👈 Render outside main DOM
  );
};

export default Modal;