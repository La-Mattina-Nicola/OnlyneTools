export default function Input({
  label,
  value,
  onChange = () => {},
  className = "",
  readOnly = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  className?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          className="border px-2 py-1 rounded w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          type={type}
        />
        {type === "datetime-local" && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 pointer-events-none">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 112 0v1h4V2a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h1V2zm-1 4v11h10V6H5zm2 3h2v2H7V9zm4 0h2v2h-2V9z" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
