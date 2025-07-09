import React from "react";
import { Badge } from "@/components/ui/Badge";

export default function EntityTags({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          style={{ backgroundColor: tag.color }}
          className="text-white text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}
