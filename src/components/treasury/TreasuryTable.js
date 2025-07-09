"use client";
import React from "react";
import Table from "@/components/ui/Table";
import TableActions from "@/components/ui/TableActions";
import { useRouter } from "next/navigation";
import { deleteTreasuryMovement } from "@/services/treasury/treasuryService";
import { showToast } from "@/utils/toast"; 

export default function TreasuryTable({ movements, loading, error, setMovements, onEditMovement }) {
  const router = useRouter();
  
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este movimiento?")) return;

    try {
      await deleteTreasuryMovement(id);
      setMovements((prev) => prev.filter((m) => m.id !== id));
      showToast({
        type: "success",
        message: "Movimiento eliminado correctamente",
      });
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Error al eliminar movimiento",
      });
    }
  };
  
  const columns = [
    {
      label: "Tipo",
      render: (mov) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs ${mov.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
          {mov.type === "income" ? "Ingreso" : "Egreso"}
        </span>
      ),
    },
    { label: "Monto", render: (mov) => `$${mov.amount}` },
    { label: "Concepto", render: (mov) => mov.concept },
    { label: "Cliente", render: (mov) => mov.client?.name || "-" },
    { label: "Proyecto", render: (mov) => mov.case?.title || "-" },
    { label: "Fecha", render: (mov) => mov.transaction_date },
    {
      label: "Acciones",
      render: (mov) => (
        <TableActions
          onView={() => router.push(`/dashboard/treasury/${mov.id}`)}
          onEdit={() => onEditMovement(mov)}
          onDelete={() => handleDelete(mov.id)}
        />
      ),
    },
  ];

  return <Table data={movements} columns={columns} isLoading={loading} error={error} />;
}
