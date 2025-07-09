import { MoreVertical } from "lucide-react";

export default function MoreButton({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-black/10"
      {...props}
    >
      <MoreVertical size={18} />
    </button>
  );
}
