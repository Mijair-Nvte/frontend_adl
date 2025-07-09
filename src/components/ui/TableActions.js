import ViewButton from "@/components/ui/ViewButton";
import EditButton from "@/components/ui/EditButton";
import DeleteButton from "@/components/ui/DeleteButton";
import MoreButton from "@/components/ui/MoreButton";

export default function TableActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {onView && <ViewButton onClick={onView} />}
      {onEdit && <EditButton onClick={onEdit} />}
      {onDelete && <DeleteButton onClick={onDelete} />}
      <MoreButton />
    </div>
  );
}
