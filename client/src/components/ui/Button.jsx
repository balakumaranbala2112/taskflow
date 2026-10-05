function Button({
    children,
    type = "button",
    variant = "primary",
    disabled = false,
    onClick
}) {
    const baseStyles = "rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
    }

    return (
        <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>{children}</button>
    )
}

export default Button;