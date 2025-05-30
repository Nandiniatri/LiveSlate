const Modal = (children, isOpen) => {

    if (isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
            </div>
        </div>
    )
}

export default Modal; 