"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import useDeleteClient from "@/hooks/clients/useDeleteClient";
import useApiClienteStatuses from "@/hooks/clients/useApiClienteStatuses";
import StatusSelectTable from "@/components/ui/StatusSelectTable";
import TableActions from "@/components/ui/TableActions";
import { updateClientStatus } from "@/services/clients/clientService";
import { showToast } from "@/utils/toast";
import Image from "next/image";

export default function CustomerCardList({
  clients = [],
  loading,
  error,
  setClients,
  onEditClient,
  onStatusUpdated
}) {
  const router = useRouter();
  const { deleteClient } = useDeleteClient();
  const { statuses: statusOptions } = useApiClienteStatuses();

  const handleDelete = async (id) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar este cliente?");
    if (!confirmDelete) return;

    const { success, message } = await deleteClient(id);
    if (success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      showToast({
        type: "success",
        message: "Cliente eliminado"
      });
    } else {
      showToast({
        type: "error",
        message: message || "No se pudo eliminar el cliente"
      });
    }
  };

  const handleStatusChange = async (client, selected) => {
    try {
      const updatedClient = await updateClientStatus(client.id, selected.value);

      if (typeof setClients === "function") {
        setClients((prev) =>
          prev.map((c) => (c.id === client.id ? updatedClient : c))
        );
        showToast({
          type: "success",
          message: "Estado actualizado"
        });
      } else if (typeof onStatusUpdated === "function") {
        onStatusUpdated();
      }
    } catch {
      showToast({
        type: "error",
        message: "Error al actualizar el estado"
      });
    }
  };

  const getInitials = (name, lastName) =>
    `${name?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const formatPhone = (phone) => {
    if (!phone) return ""; // Protección si el teléfono es null o vacío
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.startsWith("52") ? cleaned : `52${cleaned}`;
  };


  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error al cargar los clientes</div>;
  if (!clients.length) return <div className="p-4">No hay clientes</div>;

  return (
    <div className="space-y-4 p-2">
      {clients.map((client) => (
        <div key={client.id} className="bg-white  border rounded-lg p-4">
          <div className="font-semibold text-gray-900">
            {client.name} {client.last_name}
          </div>
          <div className="text-sm text-gray-600">{client.email}</div>

          <div className="mt-2 flex items-center gap-2">
            {client.avatar ? (
              <Image
                src={client.avatar}
                alt={`${client.name} ${client.last_name}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-400 text-white flex items-center justify-center text-sm font-semibold uppercase">
                {getInitials(client.name, client.last_name)}
              </div>
            )}
            <a
              href={`https://wa.me/${formatPhone(client.phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:underline text-sm"
            >
              <FaWhatsapp size={16} />
              {client.phone}
            </a>
          </div>

          <div className="mt-2">
            <StatusSelectTable
              value={client.client_status?.id}
              onChange={(selected) => handleStatusChange(client, selected)}
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
              onView={() => router.push(`/dashboard/customers/${client.id}`)}
              onEdit={() => onEditClient(client)}
              onDelete={() => handleDelete(client.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
