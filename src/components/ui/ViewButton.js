import { Eye } from "lucide-react";

export default function ViewButton({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-200"
      {...props}
    >
      <Eye size={18} className="text-gray-600" />
    </button>
  );
}
