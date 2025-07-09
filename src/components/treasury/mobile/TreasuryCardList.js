"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { showToast } from "@/utils/toast";
import { deleteTreasuryMovement } from "@/services/treasury/treasuryService";
import TableActions from "@/components/ui/TableActions";

export default function TreasuryCardList({ movements = [], onEditMovement, setMovements }) {
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

  if (!movements.length) {
    return <div className="p-4 text-center text-gray-500">No hay movimientos</div>;
  }

  return (
    <div className="space-y-4 p-2">
      {movements.map((mov) => {
        const client = mov.client;
        const avatar = client?.profile?.avatar || null;
        const initials = client?.name
          ? client.name.split(" ").map((n) => n[0]).join("").toUpperCase()
          : "U";

        return (
          <div key={mov.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span
                className={`inline-block px-2 py-1 text-xs rounded ${mov.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {mov.type === "income" ? "Ingreso" : "Egreso"}
              </span>
              <span className="font-bold text-gray-800">${mov.amount}</span>
            </div>

            <div className="text-sm text-gray-700">{mov.concept || "Sin concepto"}</div>

            <div className="flex items-center gap-2 mt-2">
              <div className="relative group">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={client?.name || "Avatar"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full border-2 border-white shadow text-xs">
                    {initials}
                  </div>
                )}
                {client?.name && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {client.name}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600">{client?.name || "Sin cliente"}</span>
            </div>

            <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
              <FaMoneyBillWave className="text-gray-400" />
              {mov.case?.title || "Sin proyecto"}
            </div>

            <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
              <FaCalendarAlt className="text-gray-400" />
              {mov.transaction_date}
            </div>

            <div className="mt-3 flex justify-center gap-2">
              <TableActions
                onView={() => router.push(`/dashboard/treasury/${mov.id}`)}
                onEdit={() => onEditMovement(mov)}
                onDelete={() => handleDelete(mov.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
