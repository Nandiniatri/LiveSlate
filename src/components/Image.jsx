const Image = ({ src, alt, className, style }) => {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
        />
    );
};

export default Image;
