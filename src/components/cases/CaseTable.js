"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/Table";
import TableActions from "@/components/ui/TableActions";
import useDeleteCase from "@/hooks/cases/useDeleteCase";
import StatusSelectTable from "@/components/ui/StatusSelectTable";
import useApiCaseStatuses from "@/hooks/cases/seApiCaseStatuses";
import { updateCaseStatus } from "@/services/cases/caseService";
import { showToast } from "@/utils/toast";
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';


export default function CaseTable({ cases, loading, error, setCases, onEditCase, onDeletedCase, onStatusUpdated, }) {
  const router = useRouter();
  const { deleteCase } = useDeleteCase();
  const { statuses: statusOptions } = useApiCaseStatuses();

  const [showDialog, setShowDialog] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);


  const handleDeleteRequest = (id) => {
    setCaseToDelete(id);
    setShowDialog(true);
  };


  const handleConfirmDelete = async () => {
    if (!caseToDelete) return;

    const { success, message } = await deleteCase(caseToDelete);
    if (success) {
      if (typeof setCases === "function") {
        setCases((prev) => prev.filter((item) => item.id !== caseToDelete));
      } else if (typeof onDeletedCase === "function") {
        onDeletedCase();
      }
      showToast({
        type: "success",
        message: "Expediente eliminado correctamente",
      });
    } else {
      showToast({
        type: "error",
        message: message || "No se pudo eliminar el expediente",
      });
    }

    setCaseToDelete(null);
    setShowDialog(false);
  };

  const handleStatusChange = async (caseItem, selected) => {
    try {
      const updated = await updateCaseStatus(caseItem.id, selected.value);

      if (typeof setCases === "function") {
        // Si existe setCases (control local), se actualiza la lista directamente
        setCases((prev) =>
          prev.map((c) => (c.id === caseItem.id ? updated : c))
        );
        showToast({
          type: "success",
          message: "Estado actualizado"
        });
      } else if (typeof onStatusUpdated === "function") {
        // Si no, delega al padre para que recargue datos
        onStatusUpdated(); // ✅
      }
    } catch (err) {
      showToast({
        type: "error",
        message: "Error al actualziar el estado"
      });
    }
  };


  const columns = [
    {
      label: "Nº",
      render: (item) => <span className="text-gray-900 font-medium">{item.case_number}</span>,
    },
    {
      label: "Projects",
      render: (item) => <span className="text-gray-900">{item.title}</span>,
    },
    {
      label: "Customer",
      render: (item) => <span className="text-gray-900">{item.client?.name} {item.client?.last_name}</span>,
    }, {
      label: "User",
      render: (item) => (
        <div className="flex -space-x-2">
          {item.lawyers?.map((lawyer) => {
            // Iniciales del nombre (solo nombre, puedes combinar con apellido si quieres)
            const initials = lawyer.name
              ? lawyer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
              : 'U';

            // Acceder avatar en lawyer.profile.avatar si existe
            const avatar = lawyer.profile?.avatar || null;

            return (
              <div key={lawyer.id} className="relative group">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={lawyer.name}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white shadow object-cover"
                    unoptimized
                  />

                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full border-2 border-white shadow text-xs">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {lawyer.name}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      label: "Status",
      render: (item) => (
        <div className="w-40">
          <StatusSelectTable
            value={item.status?.id}
            onChange={(selected) => handleStatusChange(item, selected)}
            options={statusOptions.map((s) => ({
              value: s.id,
              label: s.label,
              color: s.color,
            }))}
            isLoading={!statusOptions.length}
          />
        </div>
      ),
    },
    {
      label: "Actions",
      render: (item) => (
        <TableActions
          onView={() => router.push(`/dashboard/cases/${item.id}`)}
          onEdit={() => onEditCase(item)}
          onDelete={() => handleDeleteRequest(item.id)}
        />
      ),
    },
  ];

  return (
    <>
      <Table data={cases} columns={columns} loading={loading} error={error} checkbox />
      <ConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar expediente"
        message="¿Estás seguro de que deseas eliminar este expediente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </>
  );
}
