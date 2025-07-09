import React from "react";
import { FaEdit, FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaEnvelopeOpenText, FaFileAlt, FaStickyNote, FaTasks } from "react-icons/fa";
import { Badge } from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import EntityTags from "@/components/shared/EntityTags";
import EntityDescription from "@/components/shared/EntityDescription";
import EntityContactInfo from "@/components/shared/EntityContactInfo";
import AssignedLawyers from "@/components/shared/AssignedLawyers";
import EntityActionsButtons from "@/components/shared/EntityActionsButtons";
import EditButton from "../ui/EditButton";


export default function ClientInfoPanel({ client, onEdit }) {
  return (
    <>
      {/* Header + nombre */}
      <div className="border-b p-6 relative">
        <div className="flex items-center justify-between">
          <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Dashboard / Clientes / #{client.id}
          </div>

          <EditButton onClick={onEdit}></EditButton>
        </div>

        <EntityTags tags={client.tags} />

        <div className="mt-4">
          <h2 className="text-black text-xl font-bold">
            {client.name} {client.last_name}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 capitalize">
              {client.type}
            </span>
            {client.client_status ? (
              <StatusBadge
                label={client.client_status.label}
                color={client.client_status.color}
              />
            ) : (
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                Sin estado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botones rápidos */}
      <EntityActionsButtons
        whatsapp={client.phone}
        email={client.email}
      />


      {/* Descripción */}
      <EntityDescription text={client.descriptions} />

      {/* Contacto + abogados */}
      <EntityContactInfo
        phone={client.phone}
        email={client.email}
        estado={client.estado}
        address={client.address}
      />

      <AssignedLawyers lawyers={client.lawyers} />
    </>
  );
}
