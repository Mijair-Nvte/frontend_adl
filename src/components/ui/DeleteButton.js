import { Trash2 } from "lucide-react";

export default function DeleteButton({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-red-100"
      {...props}
    >
      <Trash2 size={18} className="text-red-600" />
    </button>
  );
}
