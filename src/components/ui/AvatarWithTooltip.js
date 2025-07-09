// components/ui/AvatarWithTooltip.js
import React from "react";
import { Tooltip } from "react-tooltip"; // o cualquier lib de tooltip que uses
import Image from "next/image";

export default function AvatarWithTooltip({ name, lastName, avatar, id }) {
  const initials = `${name?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div data-tooltip-id={`lawyer-${id}`} data-tooltip-content={`${name} ${lastName}`}>
      {avatar ? (
       <Image
          src={avatar}
          alt={`${name} ${lastName}`}
          fill
          sizes="32px"
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-500 text-white text-sm rounded-full flex items-center justify-center font-bold">
          {initials}
        </div>
      )}
      <Tooltip id={`lawyer-${id}`} place="top" effect="solid" />
    </div>
  );
}
