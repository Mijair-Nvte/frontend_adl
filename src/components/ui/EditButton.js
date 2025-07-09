import { Edit } from "lucide-react";

export default function EditButton({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-indigo-100"
      {...props}
    >
      <Edit size={18} className="text-indigo-500" />
    </button>
  );
}
