function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  className = "",
  placeholder = "Select an option",
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase tracking-wider text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value ?? ""}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-blue-500"
        } ${className}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
