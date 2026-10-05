function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
}) {
    <div className="flex flex-col gap-1">
        {label && (
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>
        )}

        <input
            id={name}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
        />
    </div>;
}

export default Input;
