// src/components/ui/Badge.js
export function Badge({ children, className = "", style }) {
    return (
      <span
        className={`inline-block text-xs font-medium px-2 py-1 rounded ${className}`}
        style={style}
      >
        {children}
      </span>
    );
  }
  