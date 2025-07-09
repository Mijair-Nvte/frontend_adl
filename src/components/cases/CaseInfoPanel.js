import React from "react";
import {
  FaEdit,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";

import { Badge } from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";

import EntityTags from "@/components/shared/EntityTags";
import EntityDescription from "@/components/shared/EntityDescription";
import AssignedLawyers from "@/components/shared/AssignedLawyers";
import EntityActionsButtons from "@/components/shared/EntityActionsButtons";
import EditButton from "../ui/EditButton";

export default function CaseInfoPanel({ caseData, onEdit }) {
  return (
    <>
      {/* Header + título del caso */}
      <div className="border-b p-6 relative">
        <div className="flex items-center justify-between">
          <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Dashboard / Expedientes / #{caseData.id}
          </div>
           <EditButton onClick={onEdit}></EditButton>
        </div>

        <EntityTags tags={caseData.tags} />

        <div className="mt-4 space-y-1">
          <h2 className="text-xl font-bold text-gray-800">{caseData.title}</h2>
          <p className="text-sm text-gray-500">{caseData.case_number}</p>
          {caseData.status && (
            <div className="mt-2">
              <StatusBadge
                label={caseData.status.label}
                color={caseData.status.color}
              />
            </div>
          )}
        </div>
      </div>

      {/* Botones rápidos reutilizados (nota, archivo, etc) */}
      <EntityActionsButtons
            whatsapp={caseData.client.phone}
            email={caseData.client.email}
          />
    

      {/* Descripción */}
      <EntityDescription text={caseData.description} />

      {/* Info del caso */}
      <div className="p-6 text-sm text-gray-700 space-y-3">
        <h3 className="text-base font-semibold text-gray-900">Información del expediente</h3>
        <p className="flex items-center gap-2">
          <FaUser className="text-gray-500" />
          Cliente: {caseData.client?.name} {caseData.client?.last_name}
        </p>
        <p className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          Inicio: {caseData.start_date}
        </p>
        <p className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          Fin: {caseData.end_date || "No definido"}
        </p>
      </div>

      {/* Abogados asignados */}
      <AssignedLawyers lawyers={caseData.lawyers} />
    </>
  );
}
