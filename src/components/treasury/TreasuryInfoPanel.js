import React from "react";
import {
  FaEdit,
  FaMoneyBillWave,
  FaCalendarDay,
  FaCreditCard,
  FaTags,
  FaUserTie,
  FaBriefcase,
  FaUserShield,
} from "react-icons/fa";

export default function TreasuryInfoPanel({ movement, onEdit }) {
  return (
    <div className="border-b p-6 relative bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
          DASHBOARD / TESORERÍA / #{movement.id}
        </div>

        <button
          title="Editar cliente"
          className="text-gray-500 hover:text-indigo-600 transition"
          onClick={onEdit}
        >
          <FaEdit size={16} />
        </button>

      </div>

      {/* Concepto + Etiquetas */}
      <div className="mt-2">
        <h2 className="text-black text-2xl font-bold flex items-center gap-3">
          {movement.concept}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${movement.type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {movement.type === "income" ? "Ingreso" : "Egreso"}
          </span>
        </h2>
      </div>

   {/* Descripción */}
<div className="flex items-center gap-2 text-gray-700 mt-4">

  <span className="font-medium">{movement.descriptions || "-"}</span>
</div>


      {/* Monto y fecha */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <FaMoneyBillWave className="text-gray-400" /> $
          {Number(movement.amount).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}
        </span>
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarDay className="text-gray-400" />
          {movement.transaction_date}
        </span>
      </div>


      {/* Campos adicionales */}
      <div className="space-y-3 mt-7">
        <div className="flex items-center gap-2 text-gray-700">
          <FaCreditCard className="text-gray-400" />
          <span className="font-bold text-gray-900">Método de pago:</span>
          <span className="font-medium">{movement.payment_method?.name || "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaTags className="text-gray-400" />
          <span className="font-bold text-gray-900">Categoría:</span>
          <span className="font-medium">{movement.category?.name || "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserTie className="text-gray-400" />
          <span className="font-bold text-gray-900">Cliente:</span>
          <span className="font-medium">
            {movement.client
              ? `${movement.client.name} ${movement.client.last_name || ""}`
              : "-"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaBriefcase className="text-gray-400" />
          <span className="font-bold text-gray-900">Proyecto:</span>
          <span className="font-medium">
            {movement.case ? movement.case.title : "-"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserShield className="text-gray-400" />
          <span className="font-bold text-gray-900">Registrado por:</span>
          <span className="font-medium">{movement.creator?.name || "-"}</span>
        </div>
      </div>

    </div>
  );
}
