function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  className = "",
  icon: Icon = null,
  ...rest
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

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onChange}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 ${
            Icon ? "pl-9" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500"
          } ${className}`}
          {...rest}
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
