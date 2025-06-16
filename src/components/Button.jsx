const Button = ({ children, onClick, className, disabled = false, style , type}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
}; 

export default Button;