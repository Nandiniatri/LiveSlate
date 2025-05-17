const Input = ({ type, value, onChange, placeholder, name , style}) => {
    return (
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={style}
        />
    );
};

export default Input;
