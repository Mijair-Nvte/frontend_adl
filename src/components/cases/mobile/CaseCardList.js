'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StatusSelectTable from '@/components/ui/StatusSelectTable';
import TableActions from '@/components/ui/TableActions';
import useDeleteCase from '@/hooks/cases/useDeleteCase';
import { updateCaseStatus } from '@/services/cases/caseService';
import { showToast } from '@/utils/toast';
import useApiCaseStatuses from '@/hooks/cases/seApiCaseStatuses';
import Image from 'next/image';

export default function CaseCardList({
    cases = [],
    loading,
    error,
    setCases,
    onEditCase,
    onDeletedCase,
    onStatusUpdated
}) {
    const router = useRouter();
    const { deleteCase } = useDeleteCase();
    const { statuses: statusOptions } = useApiCaseStatuses();

    const handleDelete = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de eliminar este expediente?");
        if (!confirmDelete) return;

        const { success, message } = await deleteCase(id);
        if (success) {
            if (typeof setCases === "function") {
                const updated = cases.filter((item) => item.id !== id);
                setCases(updated);
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
    };

    const handleStatusChange = async (caseItem, selected) => {
        try {
            const updated = await updateCaseStatus(caseItem.id, selected.value);
            if (typeof setCases === "function") {
                setCases((prev) =>
                    prev.map((c) => (c.id === caseItem.id ? updated : c))
                );
                showToast({ type: "success", message: "Estado actualizado" });
            } else if (typeof onStatusUpdated === "function") {
                onStatusUpdated();
            }
        } catch {
            showToast({ type: "error", message: "Error al actualizar el estado" });
        }
    };

    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-500">Error al cargar los expedientes</div>;
    if (!cases.length) return <div className="p-4">No hay expedientes</div>;

    return (
        <div className="space-y-4 p-2">
            {cases.map((item) => (
                <div key={item.id} className="bg-white  rounded-lg border p-4">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">
                        Nº {item.case_number} | Cliente: {item.client?.name} {item.client?.last_name}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {item.lawyers?.map((lawyer) => {
                            const avatar = lawyer.profile?.avatar || null;
                            const initials = lawyer.name
                                ? lawyer.name.split(' ').map((n) => n[0]).join('').toUpperCase()
                                : 'U';
                            return (
                                <div key={lawyer.id} className="relative group">
                                    {avatar ? (
                                        <Image
                                            src={avatar}
                                            alt={lawyer.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover border-2 border-white shadow"
                                            unoptimized
                                        />

                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2">
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
                    <div className="mt-2">
                        <TableActions
                            onView={() => router.push(`/dashboard/cases/${item.id}`)}
                            onEdit={() => onEditCase(item)}
                            onDelete={() => handleDelete(item.id)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
