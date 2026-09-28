
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  // Base button styles
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none select-none active:scale-[0.98]";

  // Variant styles
  const variantStyles = {
    primary:
      "text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 border border-transparent",
    secondary:
      "text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/80 hover:border-slate-600 shadow-sm",
    danger:
      "text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/30 hover:shadow-rose-600/50 border border-transparent",
    outline:
      "text-violet-400 hover:text-white bg-transparent hover:bg-violet-600/10 border border-violet-500/50 hover:border-violet-400 shadow-sm",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  // Disabled / Loading state
  const disabledStyles =
    disabled || loading
      ? "opacity-50 cursor-not-allowed pointer-events-none shadow-none active:scale-100"
      : "";

  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${disabledStyles} ${className}`.trim()}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
}
