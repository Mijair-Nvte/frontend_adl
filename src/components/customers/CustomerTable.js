"use client";

import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useDeleteClient from "@/hooks/clients/useDeleteClient";
import Table from "@/components/ui/Table";
import TableActions from "@/components/ui/TableActions";
import StatusSelectTable from "@/components/ui/StatusSelectTable";
import useApiClienteStatuses from "@/hooks/clients/useApiClienteStatuses";
import { updateClientStatus } from "@/services/clients/clientService";
import { showToast } from "@/utils/toast";
import Image from "next/image";

export default function CustomerTable({ clients, loading, error, setClients, onEditClient, onStatusUpdated }) {
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
      alert("❌ " + message);
    }
  };

  const getInitials = (name, lastName) =>
    `${name?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();


  const columns = [
    {
      label: "Nombre",
      render: (client) => (
        <div className="flex items-center gap-3">
          {client.avatar ? (
            <Image
              src={client.avatar}
              alt={`${client.name} ${client.last_name}`}
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-rose-400 text-white flex items-center justify-center text-sm font-semibold uppercase">
              {getInitials(client.name, client.last_name)}
            </div>
          )}
          <div className="text-sm">
            <p className="text-gray-900">{client.name} {client.last_name}</p>
            <p className="text-gray-400 text-xs leading-5">{client.email}</p>
          </div>
        </div>
      )
    },
    {
      label: "Telefono",
      render: (client) => {
        if (!client.phone) {
          return (
            <span className="text-gray-400 text-sm italic">
              Sin número
            </span>
          );
        }

        const formatPhone = (phone) => {
          const cleaned = phone.replace(/\D/g, "");
          return cleaned.startsWith("52") ? cleaned : `52${cleaned}`;
        };

        return (
          <a
            href={`https://wa.me/${formatPhone(client.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:underline"
          >
            <FaWhatsapp size={16} />
            {client.phone}
          </a>
        );
      }
    },
    {
      label: "Estado",
      render: (client) => {
        const status = client.client_status;
     
        const handleStatusChange = async (selected) => {
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
              onStatusUpdated(); // 🔄 dispara recarga del padre
            }
          } catch (err) {
            showToast({
              type: "error",
              message: "Error al actualizar"
            });
          }
        };



        return (
          <div className="w-40">
            <StatusSelectTable
              value={status?.id}
              onChange={handleStatusChange}
              options={statusOptions.map((s) => ({
                value: s.id,
                label: s.label,
                color: s.color,
              }))}
              isLoading={!statusOptions.length}
            />

          </div>
        );
      },
    }

    ,
    {
      label: "Acciones",
      render: (client) => (
        <TableActions
          onView={() => router.push(`/dashboard/customers/${client.id}`)}
          onEdit={() => onEditClient(client)}
          onDelete={() => handleDelete(client.id)}

        />

      )
    }
  ];

  return (

    <Table
      data={clients}
      columns={columns}
      isLoading={loading}
      error={error}
      checkbox
    />
  );
}
